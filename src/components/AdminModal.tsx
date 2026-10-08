import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  Unlock,
  Users,
  Utensils,
  Download,
  Search,
  Filter,
  Trash2,
  ExternalLink,
  RefreshCw,
  AlertTriangle,
  Database,
  CheckCircle2,
  XCircle,
  X,
  FileSpreadsheet,
  ChevronRight
} from 'lucide-react';
import { RSVPRecord } from '../types/wedding';
import { MAIN_DISHES } from '../data/dishes';
import { fetchAllRSVPs, deleteRSVP, exportRSVPsToCSV } from '../services/rsvpService';
import { getSupabaseStatus, SUPABASE_SQL_SCHEMA } from '../lib/supabase';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSupabaseConfig: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  onOpenSupabaseConfig
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState(false);

  const [records, setRecords] = useState<RSVPRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDish, setFilterDish] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [fromSupabase, setFromSupabase] = useState(false);

  const [activeTab, setActiveTab] = useState<'convidados' | 'cardapio' | 'alergias' | 'supabase'>('convidados');

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadData();
    }
  }, [isOpen, isAuthenticated]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchAllRSVPs();
      setRecords(res.records);
      setFromSupabase(res.fromSupabase);
    } catch (err) {
      console.error('Erro ao carregar registros:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default passcodes for Felipe & Evelyn
    const valid = ['evelynfelipe', 'felipeevelyn', 'amor', 'noivos', 'goth'];
    if (valid.includes(password.toLowerCase().trim()) || password.trim() === '') {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Deseja remover a confirmação de "${name}"?`)) {
      await deleteRSVP(id);
      loadData();
    }
  };

  const handleDownloadCSV = () => {
    const csvContent = exportRSVPsToCSV(records);
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `RSVP_Casamento_Felipe_Evelyn_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  // Compute statistics
  const confirmedList = records.filter(r => r.attendanceStatus === 'confirmed');
  const declinedList = records.filter(r => r.attendanceStatus === 'declined');

  // Total people attending = primary guests confirmed + all their companions
  const totalCompanions = confirmedList.reduce((acc, curr) => acc + (curr.companionsCount || 0), 0);
  const totalConfirmedPeople = confirmedList.length + totalCompanions;

  // Dishes calculation (primary + companions)
  const dishCounts: { [dishId: string]: number } = {};
  MAIN_DISHES.forEach(d => { dishCounts[d.id] = 0; });

  confirmedList.forEach(r => {
    if (r.mainDishId && dishCounts[r.mainDishId] !== undefined) {
      dishCounts[r.mainDishId] += 1;
    }
    // Companions dish counts
    if (r.companions && r.companions.length > 0) {
      r.companions.forEach(c => {
        if (c.dishId && dishCounts[c.dishId] !== undefined) {
          dishCounts[c.dishId] += 1;
        }
      });
    }
  });

  const totalDishesServed = Object.values(dishCounts).reduce((a, b) => a + b, 0);

  // Filtered records
  const filteredRecords = records.filter(r => {
    const matchesSearch =
      r.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.phone.includes(searchTerm);

    const matchesDish = filterDish === 'all' || r.mainDishId === filterDish;
    const matchesStatus = filterStatus === 'all' || r.attendanceStatus === filterStatus;

    return matchesSearch && matchesDish && matchesStatus;
  });

  // Guests with dietary alerts
  const dietaryAlerts = confirmedList.filter(
    r => (r.dietaryRestrictions && r.dietaryRestrictions.trim().length > 0) || (r.dietaryTags && r.dietaryTags.length > 0)
  );

  const supabaseStatus = getSupabaseStatus();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="max-w-5xl w-full bg-[#120a10] border border-[#c5a059] rounded-3xl p-5 sm:p-8 shadow-[0_0_60px_rgba(0,0,0,0.95)] relative max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#c5a059]/25 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2a0e19] border border-[#84172c] flex items-center justify-center text-[#ff7e93]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-cinzel text-lg sm:text-xl font-bold text-gold-gradient">
                Painel dos Noivos — Felipe & Evelyn
              </h3>
              <p className="text-xs text-[#a6988f]">
                Controle de convidados, contagem de pratos para o buffet e integração Supabase
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#1d1019] border border-[#c5a059]/30 text-[#a6988f] hover:text-[#f4eae0] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Auth Gate if not logged in */}
        {!isAuthenticated ? (
          <div className="py-12 px-4 max-w-md mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-[#201019] border border-[#c5a059]/40 flex items-center justify-center text-[#c5a059] mx-auto mb-4">
              <Lock className="w-8 h-8" />
            </div>
            <h4 className="font-cinzel text-xl font-bold text-[#f4eae0] mb-2">
              Acesso Restrito aos Noivos
            </h4>
            <p className="text-xs text-[#a6988f] mb-6 font-cormorant text-base">
              Digite a chave de acesso dos noivos para visualizar a lista completa de convidados e opções de menu.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Senha dos noivos (ou deixe em branco)"
                className="w-full px-4 py-3 rounded-xl bg-[#090507] border border-[#c5a059]/40 text-[#f4eae0] text-sm focus:outline-none focus:border-[#c5a059] text-center"
              />
              {authError && (
                <span className="text-xs text-red-400 block">
                  Senha incorreta. Tente "evelynfelipe" ou "amor".
                </span>
              )}
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl font-cinzel text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#84172c] to-[#560d1e] text-white border border-[#c5a059]"
                >
                  Entrar no Painel
                </button>
                <button
                  type="button"
                  onClick={() => setIsAuthenticated(true)}
                  className="py-3 px-4 rounded-xl font-cinzel text-xs uppercase tracking-wider bg-[#1d1019] text-[#e8d08d] border border-[#c5a059]/30"
                >
                  Acesso Rápido
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0 pt-4">
            {/* Quick Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 shrink-0">
              <div className="p-3.5 rounded-xl bg-[#0a0608] border border-[#c5a059]/25">
                <span className="text-[10px] font-cinzel uppercase tracking-widest text-[#a6988f] block">
                  Total Presentes
                </span>
                <span className="text-2xl font-cinzel font-bold text-gold-gradient">
                  {totalConfirmedPeople}
                </span>
                <span className="text-[10px] text-[#8e8077] block">
                  {confirmedList.length} titulares + {totalCompanions} acomp.
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0a0608] border border-[#c5a059]/25">
                <span className="text-[10px] font-cinzel uppercase tracking-widest text-[#a6988f] block">
                  Pratos a Servir
                </span>
                <span className="text-2xl font-cinzel font-bold text-[#e8d08d]">
                  {totalDishesServed}
                </span>
                <span className="text-[10px] text-[#8e8077] block">
                  Refeições do Banquete
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0a0608] border border-[#c5a059]/25">
                <span className="text-[10px] font-cinzel uppercase tracking-widest text-[#a6988f] block">
                  Recusas / Ausentes
                </span>
                <span className="text-2xl font-cinzel font-bold text-[#ff7e93]">
                  {declinedList.length}
                </span>
                <span className="text-[10px] text-[#8e8077] block">
                  Não poderão comparecer
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0a0608] border border-[#c5a059]/25">
                <span className="text-[10px] font-cinzel uppercase tracking-widest text-[#a6988f] block">
                  Alertas Nutricionais
                </span>
                <span className="text-2xl font-cinzel font-bold text-amber-400">
                  {dietaryAlerts.length}
                </span>
                <span className="text-[10px] text-[#8e8077] block">
                  Restrições / Alergias
                </span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#c5a059]/20 pb-3 mb-4 shrink-0">
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-cinzel">
                <button
                  onClick={() => setActiveTab('convidados')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    activeTab === 'convidados'
                      ? 'bg-[#84172c] text-white border border-[#c5a059]/50'
                      : 'bg-[#150a12] text-[#a6988f] hover:text-[#f4eae0]'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  Lista de Convidados ({records.length})
                </button>

                <button
                  onClick={() => setActiveTab('cardapio')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    activeTab === 'cardapio'
                      ? 'bg-[#84172c] text-white border border-[#c5a059]/50'
                      : 'bg-[#150a12] text-[#a6988f] hover:text-[#f4eae0]'
                  }`}
                >
                  <Utensils className="w-3.5 h-3.5" />
                  Divisão de Pratos Buffet
                </button>

                <button
                  onClick={() => setActiveTab('alergias')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    activeTab === 'alergias'
                      ? 'bg-[#84172c] text-white border border-[#c5a059]/50'
                      : 'bg-[#150a12] text-[#a6988f] hover:text-[#f4eae0]'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Restrições Alimentares ({dietaryAlerts.length})
                </button>

                <button
                  onClick={() => setActiveTab('supabase')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    activeTab === 'supabase'
                      ? 'bg-[#84172c] text-white border border-[#c5a059]/50'
                      : 'bg-[#150a12] text-[#a6988f] hover:text-[#f4eae0]'
                  }`}
                >
                  <Database className="w-3.5 h-3.5" />
                  Banco Supabase
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={loadData}
                  disabled={loading}
                  title="Atualizar dados"
                  className="p-2 rounded-lg bg-[#1a0f17] border border-[#c5a059]/30 text-[#e8d08d] hover:bg-[#251521] transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                </button>

                <button
                  onClick={handleDownloadCSV}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a0f17] border border-[#c5a059]/30 text-xs font-cinzel text-[#e8d08d] hover:bg-[#281624] transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-[#c5a059]" />
                  Exportar Excel/CSV
                </button>
              </div>
            </div>

            {/* TAB 1: Convidados */}
            {activeTab === 'convidados' && (
              <div className="flex-1 flex flex-col min-h-0">
                {/* Search and Filter bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3 shrink-0">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-[#a6988f] absolute left-3 top-3" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      placeholder="Buscar por nome, email ou telefone..."
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#090507] border border-[#c5a059]/25 text-xs text-[#f4eae0] focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>

                  <select
                    value={filterDish}
                    onChange={e => setFilterDish(e.target.value)}
                    className="px-3 py-2 rounded-lg bg-[#090507] border border-[#c5a059]/25 text-xs text-[#f4eae0] focus:outline-none"
                  >
                    <option value="all">Todos os Pratos</option>
                    {MAIN_DISHES.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                    className="px-3 py-2 rounded-lg bg-[#090507] border border-[#c5a059]/25 text-xs text-[#f4eae0] focus:outline-none"
                  >
                    <option value="all">Todos os Status</option>
                    <option value="confirmed">Apenas Confirmados</option>
                    <option value="declined">Apenas Recusados</option>
                  </select>
                </div>

                {/* Table of Guests */}
                <div className="flex-1 overflow-y-auto rounded-xl border border-[#c5a059]/20 bg-[#090507]">
                  {filteredRecords.length === 0 ? (
                    <div className="p-12 text-center text-xs text-[#a6988f]">
                      Nenhuma confirmação encontrada com os filtros selecionados.
                    </div>
                  ) : (
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#180f15] border-b border-[#c5a059]/20 text-[#e8d08d] font-cinzel sticky top-0">
                        <tr>
                          <th className="py-2.5 px-3">Convidado</th>
                          <th className="py-2.5 px-3">Contato</th>
                          <th className="py-2.5 px-3">Presença</th>
                          <th className="py-2.5 px-3">Prato Escolhido</th>
                          <th className="py-2.5 px-3">Acomp.</th>
                          <th className="py-2.5 px-3 text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#c5a059]/10 text-[#d8c8bd]">
                        {filteredRecords.map(r => {
                          const dish = MAIN_DISHES.find(d => d.id === r.mainDishId);
                          const isConfirmed = r.attendanceStatus === 'confirmed';
                          // WhatsApp clean number
                          const cleanPhone = r.phone.replace(/\D/g, '');

                          return (
                            <tr key={r.id} className="hover:bg-[#130b11] transition-colors">
                              <td className="py-3 px-3">
                                <span className="font-semibold text-[#f4eae0] block">
                                  {r.guestName}
                                </span>
                                {r.message && (
                                  <span className="text-[11px] text-[#a6988f] italic block max-w-xs truncate" title={r.message}>
                                    "{r.message}"
                                  </span>
                                )}
                              </td>

                              <td className="py-3 px-3">
                                <div className="text-[11px] text-[#bcaea4]">{r.email}</div>
                                {cleanPhone && (
                                  <a
                                    href={`https://wa.me/55${cleanPhone}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[11px] text-[#c5a059] hover:underline flex items-center gap-1"
                                  >
                                    {r.phone} <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                )}
                              </td>

                              <td className="py-3 px-3">
                                {isConfirmed ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-cinzel bg-emerald-950/60 border border-emerald-600/40 text-emerald-300">
                                    <CheckCircle2 className="w-3 h-3" /> Confirmado
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-cinzel bg-red-950/60 border border-red-700/40 text-red-300">
                                    <XCircle className="w-3 h-3" /> Ausente
                                  </span>
                                )}
                              </td>

                              <td className="py-3 px-3">
                                {isConfirmed ? (
                                  <div>
                                    <span className="text-[#f4eae0] font-medium block">
                                      {dish ? dish.name : r.mainDishId}
                                    </span>
                                    {r.dietaryRestrictions && (
                                      <span className="text-[10px] text-amber-400 block">
                                        Restrição: {r.dietaryRestrictions}
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-[#6d5f57]">—</span>
                                )}
                              </td>

                              <td className="py-3 px-3">
                                {r.hasCompanions && r.companions && r.companions.length > 0 ? (
                                  <div>
                                    <span className="font-bold text-[#e8d08d]">
                                      +{r.companions.length}
                                    </span>
                                    <div className="text-[10px] text-[#a6988f]">
                                      {r.companions.map(c => c.name).join(', ')}
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-[#6d5f57]">0</span>
                                )}
                              </td>

                              <td className="py-3 px-3 text-right">
                                <button
                                  onClick={() => handleDelete(r.id, r.guestName)}
                                  title="Remover confirmação"
                                  className="text-[#8e8077] hover:text-red-400 transition-colors p-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: Cardápio & Contagem Buffet */}
            {activeTab === 'cardapio' && (
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                <div className="p-4 rounded-xl bg-[#090507] border border-[#c5a059]/20">
                  <h4 className="font-cinzel text-sm font-bold text-[#e8d08d] mb-1">
                    Total Consolidado para a Equipe de Cozinha / Buffet
                  </h4>
                  <p className="text-xs text-[#a6988f] mb-4">
                    Contagem exata somando convidados titulares e seus respectivos acompanhantes confirmados:
                  </p>

                  <div className="space-y-3">
                    {MAIN_DISHES.map(dish => {
                      const count = dishCounts[dish.id] || 0;
                      const percentage = totalDishesServed > 0 ? Math.round((count / totalDishesServed) * 100) : 0;

                      return (
                        <div key={dish.id} className="p-3.5 rounded-xl bg-[#140b12] border border-[#c5a059]/25">
                          <div className="flex items-center justify-between mb-1.5">
                            <div>
                              <span className="font-cinzel text-sm font-bold text-[#f4eae0]">
                                {dish.name}
                              </span>
                              <span className="text-[11px] text-[#a6988f] block">
                                {dish.badge || dish.category} • Harmonização: {dish.pairing}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-xl font-cinzel font-bold text-gold-gradient">
                                {count}
                              </span>
                              <span className="text-[10px] text-[#8e8077] block">
                                {percentage}% do total
                              </span>
                            </div>
                          </div>

                          {/* Progress bar */}
                          <div className="w-full h-2 rounded-full bg-[#0a0508] overflow-hidden border border-[#c5a059]/20">
                            <div
                              className="h-full bg-gradient-to-r from-[#84172c] to-[#c5a059] rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Alergias & Restrições */}
            {activeTab === 'alergias' && (
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                <div className="p-4 rounded-xl bg-[#090507] border border-[#c5a059]/20">
                  <h4 className="font-cinzel text-sm font-bold text-amber-400 mb-1 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    Lista de Atenção para o Chef Executivo
                  </h4>
                  <p className="text-xs text-[#a6988f] mb-4">
                    Convidados com restrições alimentares declaradas no RSVP:
                  </p>

                  {dietaryAlerts.length === 0 ? (
                    <p className="text-xs text-[#8e8077] py-6 text-center">
                      Nenhuma restrição alimentar severa cadastrada até o momento.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {dietaryAlerts.map(r => (
                        <div key={r.id} className="p-3 rounded-lg bg-[#150c12] border border-amber-500/30 flex items-start justify-between gap-3 text-xs">
                          <div>
                            <span className="font-semibold text-[#f4eae0] block">
                              {r.guestName}
                            </span>
                            <span className="text-[#a6988f] text-[11px] block">
                              Prato: {MAIN_DISHES.find(d => d.id === r.mainDishId)?.name || 'N/A'}
                            </span>
                            {r.dietaryRestrictions && (
                              <p className="text-amber-300 font-medium mt-1">
                                ⚠️ "{r.dietaryRestrictions}"
                              </p>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1 shrink-0">
                            {r.dietaryTags.map(tag => (
                              <span key={tag} className="px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/40 text-amber-300 text-[10px]">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: Supabase Integration */}
            {activeTab === 'supabase' && (
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
                <div className="p-4 rounded-xl bg-[#090507] border border-[#c5a059]/30">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-[#c5a059]" />
                      <h4 className="font-cinzel text-sm font-bold text-[#e8d08d]">
                        Status da Conexão Supabase
                      </h4>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-cinzel ${
                      supabaseStatus.isConfigured
                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/50'
                        : 'bg-amber-950/60 text-amber-300 border border-amber-500/50'
                    }`}>
                      {supabaseStatus.isConfigured ? 'Ativo & Conectado' : 'Modo Local Ativo'}
                    </span>
                  </div>

                  <p className="text-[#bcaea4] leading-relaxed mb-4">
                    {supabaseStatus.message}
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={onOpenSupabaseConfig}
                      className="px-4 py-2 rounded-lg font-cinzel text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#84172c] to-[#560d1e] text-white border border-[#c5a059]"
                    >
                      Configurar Chaves Supabase & Ver Script SQL
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#090507] border border-[#c5a059]/20">
                  <h4 className="font-cinzel text-xs uppercase tracking-wider text-[#e8d08d] mb-2">
                    Script SQL para Criar a Tabela no Supabase
                  </h4>
                  <pre className="p-3 rounded-lg bg-[#050304] border border-[#c5a059]/15 text-[#a6988f] font-mono text-[11px] overflow-x-auto max-h-48">
                    {SUPABASE_SQL_SCHEMA}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
