import React, { useState } from 'react';
import { Database, Check, Copy, ExternalLink, ShieldAlert, Key, Sparkles, X, CheckCircle2 } from 'lucide-react';
import {
  getSupabaseCredentials,
  saveCustomSupabaseCredentials,
  getSupabaseStatus,
  SUPABASE_SQL_SCHEMA,
  getSupabaseClient
} from '../lib/supabase';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigChanged: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({
  isOpen,
  onClose,
  onConfigChanged
}) => {
  const current = getSupabaseCredentials();
  const [url, setUrl] = useState(current.url);
  const [anonKey, setAnonKey] = useState(current.key);
  const [copiedSql, setCopiedSql] = useState(false);
  const [testResult, setTestResult] = useState<{ status: 'idle' | 'testing' | 'success' | 'error'; message: string }>({
    status: 'idle',
    message: ''
  });

  if (!isOpen) return null;

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleSave = () => {
    saveCustomSupabaseCredentials(url, anonKey);
    onConfigChanged();
    setTestResult({ status: 'idle', message: 'Configurações salvas!' });
  };

  const handleTestConnection = async () => {
    // Save first
    saveCustomSupabaseCredentials(url, anonKey);
    onConfigChanged();

    setTestResult({ status: 'testing', message: 'Testando conexão com o Supabase...' });

    const client = getSupabaseClient();
    if (!client) {
      setTestResult({
        status: 'error',
        message: 'Preencha a URL do projeto e a Chave Pública Anon.'
      });
      return;
    }

    try {
      // Test querying the rsvps table or checking auth health
      const { data, error } = await client.from('rsvps').select('id').limit(1);

      if (error) {
        if (error.code === '42P01' || error.message.includes('relation "public.rsvps" does not exist')) {
          setTestResult({
            status: 'error',
            message: 'Conectou ao Supabase, mas a tabela "rsvps" ainda não foi criada! Execute o script SQL abaixo no SQL Editor do Supabase.'
          });
        } else {
          setTestResult({
            status: 'error',
            message: `Erro do Supabase: ${error.message}`
          });
        }
      } else {
        setTestResult({
          status: 'success',
          message: 'Conexão realizada com sucesso! A tabela "rsvps" está acessível.'
        });
      }
    } catch (e: any) {
      setTestResult({
        status: 'error',
        message: `Falha na conexão de rede: ${e.message || e}`
      });
    }
  };

  const status = getSupabaseStatus();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="max-w-2xl w-full bg-[#120a10] border border-[#c5a059] rounded-3xl p-5 sm:p-8 shadow-[0_0_60px_rgba(0,0,0,0.95)] relative max-h-[94vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#1d1019] border border-[#c5a059]/30 text-[#a6988f] hover:text-[#f4eae0] flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#c5a059]/25">
          <div className="w-10 h-10 rounded-xl bg-[#2a0e19] border border-[#c5a059] flex items-center justify-center text-[#e8d08d]">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-cinzel text-lg sm:text-xl font-bold text-gold-gradient">
              Integração Supabase — Banco de Dados
            </h3>
            <p className="text-xs text-[#a6988f]">
              Conecte sua base de dados na nuvem para armazenar os convites de Felipe & Evelyn
            </p>
          </div>
        </div>

        {/* Current Status Pill */}
        <div className={`p-4 rounded-xl border mb-6 flex items-start gap-3 ${
          status.isConfigured
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
            : 'bg-[#180f15] border-[#c5a059]/30 text-[#d4c6b8]'
        }`}>
          <div className="shrink-0 mt-0.5">
            {status.isConfigured ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <Sparkles className="w-4 h-4 text-[#c5a059]" />
            )}
          </div>
          <div className="text-xs">
            <span className="font-cinzel font-semibold block mb-0.5">
              {status.isConfigured ? 'Supabase Conectado' : 'Modo Autônomo com Fallback Ativo'}
            </span>
            <p className="leading-relaxed">
              {status.message}
            </p>
          </div>
        </div>

        {/* Connection Credentials Form */}
        <div className="p-4 rounded-2xl bg-[#090507] border border-[#c5a059]/25 mb-6 space-y-4">
          <h4 className="font-cinzel text-xs uppercase tracking-widest text-[#e8d08d] flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-[#c5a059]" />
            Credenciais do Projeto Supabase
          </h4>

          <div>
            <label className="block text-[11px] font-cinzel text-[#d4c6b8] mb-1">
              Project URL do Supabase
            </label>
            <input
              type="text"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://seu-projeto-id.supabase.co"
              className="w-full px-3 py-2 rounded-lg bg-[#140b12] border border-[#c5a059]/30 text-xs text-[#f4eae0] focus:outline-none focus:border-[#c5a059]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-cinzel text-[#d4c6b8] mb-1">
              Anon Public API Key
            </label>
            <input
              type="password"
              value={anonKey}
              onChange={e => setAnonKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full px-3 py-2 rounded-lg bg-[#140b12] border border-[#c5a059]/30 text-xs text-[#f4eae0] focus:outline-none focus:border-[#c5a059]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button
              onClick={handleTestConnection}
              className="px-4 py-2 rounded-lg font-cinzel text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#84172c] to-[#560d1e] text-white border border-[#c5a059] hover:brightness-110 transition-all"
            >
              Testar Conexão com Supabase
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg font-cinzel text-xs uppercase tracking-wider bg-[#1d1019] text-[#e8d08d] border border-[#c5a059]/30 hover:bg-[#281624] transition-all"
            >
              Salvar Credenciais
            </button>
          </div>

          {testResult.message && (
            <div className={`p-3 rounded-lg text-xs font-sans ${
              testResult.status === 'success'
                ? 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-200'
                : testResult.status === 'error'
                ? 'bg-red-950/60 border border-red-500/50 text-red-200'
                : 'bg-[#1e1019] text-[#e8d08d]'
            }`}>
              {testResult.message}
            </div>
          )}
        </div>

        {/* Step-by-Step Instructions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-cinzel text-xs uppercase tracking-widest text-[#e8d08d]">
              Como Criar a Tabela no Supabase (1 Minuto):
            </h4>
            <button
              onClick={handleCopySql}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-cinzel bg-[#1f101a] border border-[#c5a059]/40 text-[#e8d08d] hover:bg-[#2d1827] transition-all"
            >
              {copiedSql ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Script SQL Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copiar Script SQL
                </>
              )}
            </button>
          </div>

          <ol className="list-decimal list-inside space-y-1.5 text-xs text-[#bcaea4] leading-relaxed">
            <li>Acesse seu painel no <strong>Supabase</strong> (<a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-[#c5a059] underline">supabase.com</a>)</li>
            <li>No menu lateral esquerdo, clique em <strong>SQL Editor</strong></li>
            <li>Cole o script abaixo e clique no botão verde <strong>RUN</strong></li>
            <li>Vá em <strong>Settings &gt; API</strong>, copie a <em>Project URL</em> e o <em>anon public key</em> e cole acima!</li>
          </ol>

          {/* SQL Snippet box */}
          <pre className="p-3.5 rounded-xl bg-[#070406] border border-[#c5a059]/20 text-[#a6988f] font-mono text-[11px] overflow-x-auto max-h-48 leading-relaxed">
            {SUPABASE_SQL_SCHEMA}
          </pre>
        </div>
      </div>
    </div>
  );
};
