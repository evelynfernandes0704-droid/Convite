import React from 'react';
import { CheckCircle2, Calendar, Clock, MapPin, Utensils, Heart, Share2, Download, Copy, Check, X } from 'lucide-react';
import { RSVPRecord } from '../types/wedding';
import { MAIN_DISHES, WEDDING_INFO } from '../data/dishes';
import { weddingSealImage } from '../assets/images';

interface ConfirmationModalProps {
  record: RSVPRecord | null;
  supabaseSynced: boolean;
  onClose: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  record,
  supabaseSynced,
  onClose
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!record) return null;

  const dish = MAIN_DISHES.find(d => d.id === record.mainDishId);
  const isConfirmed = record.attendanceStatus === 'confirmed';

  const handleCopy = () => {
    const text = `Confirmação de Casamento — Felipe & Evelyn\nConvidado: ${record.guestName}\nData: ${WEDDING_INFO.date} às ${WEDDING_INFO.time}\nLocal: ${WEDDING_INFO.ceremonyVenue}\nPrato: ${dish ? dish.name : 'N/A'}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const createGoogleCalendarLink = () => {
    const title = encodeURIComponent('Casamento Gótico: Felipe & Evelyn');
    const details = encodeURIComponent(`Presença confirmada para ${record.guestName}.\nPrato selecionado: ${dish ? dish.name : ''}\nTraje: Gothic Black Tie.`);
    const location = encodeURIComponent(`${WEDDING_INFO.ceremonyVenue}, ${WEDDING_INFO.ceremonyAddress}`);
    // 2026-10-31 19:30 BRT (UTC-3) -> 22:30 UTC to next day 04:00 UTC
    const dates = '20261031T223000Z/20261101T060000Z';
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="max-w-xl w-full bg-[#120a10] border border-[#c5a059] rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(132,23,44,0.4)] relative max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#1e111a] border border-[#c5a059]/40 text-[#a6988f] hover:text-[#f4eae0] flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Seal Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative mb-3">
            <div className="w-20 h-20 rounded-full overflow-hidden p-0.5 bg-gradient-to-br from-[#c5a059] via-[#84172c] to-[#3a0510] shadow-[0_0_20px_rgba(197,160,89,0.3)]">
              <img
                src={weddingSealImage}
                alt="Selo Evelyn & Felipe"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#84172c] border border-[#c5a059] flex items-center justify-center text-white">
              <CheckCircle2 className="w-4 h-4 text-[#e8d08d]" />
            </div>
          </div>

          <span className="font-cinzel text-xs tracking-[0.3em] uppercase text-[#e8d08d] mb-1">
            {isConfirmed ? 'Passe de Entrada Confirmado' : 'Mensagem Recebida'}
          </span>
          <h3 className="text-2xl sm:text-3xl font-cinzel font-bold text-gold-gradient">
            {isConfirmed ? 'Honrados com Sua Presença' : 'Agradecemos Seu Carinho'}
          </h3>
          <p className="text-xs text-[#a6988f] font-cinzel tracking-wider mt-1">
            Felipe & Evelyn • 31 de Outubro de 2026
          </p>
        </div>

        {/* Pass Card Container */}
        {isConfirmed ? (
          <div className="p-5 sm:p-6 rounded-2xl bg-[#090507] border border-[#c5a059]/40 space-y-4 mb-6 shadow-inner">
            <div className="flex items-center justify-between pb-3 border-b border-[#c5a059]/20">
              <div>
                <span className="text-[10px] font-cinzel uppercase tracking-widest text-[#a6988f] block">
                  Convidado de Honra
                </span>
                <span className="text-lg font-cinzel font-bold text-[#f4eae0]">
                  {record.guestName}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-cinzel uppercase tracking-widest text-[#a6988f] block">
                  Telefone / WhatsApp
                </span>
                <span className="text-xs font-mono text-[#d4c6b8]">
                  {record.phone}
                </span>
              </div>
            </div>

            {/* Dish Choice Banner */}
            <div className="p-3.5 rounded-xl bg-[#1a0f17] border border-[#84172c]/60">
              <span className="text-[10px] font-cinzel uppercase tracking-widest text-[#ff9fb2] block mb-1 flex items-center gap-1.5">
                <Utensils className="w-3 h-3 text-[#ff7e93]" />
                Prato Principal Escolhido:
              </span>
              <span className="text-sm sm:text-base font-cinzel font-semibold text-[#f8ede5] block">
                {dish ? dish.name : 'Opção Gastronômica Registrada'}
              </span>
              {dish?.pairing && (
                <span className="text-xs text-[#c5a059] block mt-1">
                  Harmonização: {dish.pairing}
                </span>
              )}
            </div>

            {/* Companions Details if any */}
            {record.hasCompanions && record.companions && record.companions.length > 0 && (
              <div className="pt-2 text-xs text-[#b8aaa0]">
                <span className="font-cinzel text-[#e8d08d] block mb-1">
                  Acompanhante(s) Registrado(s):
                </span>
                <ul className="space-y-1 pl-2">
                  {record.companions.map((c, i) => (
                    <li key={i} className="flex items-center justify-between">
                      <span>• {c.name}</span>
                      <span className="text-[11px] text-[#a6988f] italic">
                        {MAIN_DISHES.find(d => d.id === c.dishId)?.name || 'Prato Principal'}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Event Coordinates */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-[#c5a059]/15 text-[#a6988f]">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>{WEDDING_INFO.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>{WEDDING_INFO.time} em ponto</span>
              </div>
              <div className="col-span-2 flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#84172c] shrink-0 mt-0.5" />
                <span>{WEDDING_INFO.ceremonyVenue}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-[#090507] border border-[#c5a059]/30 text-center mb-6">
            <p className="text-sm text-[#b8aaa0] mb-2 font-cormorant text-base">
              Registramos que infelizmente você não poderá comparecer. Sentiremos sua falta nesta noite mágica, mas levamos suas boas vibrações no coração!
            </p>
            <span className="text-xs text-[#a6988f] font-cinzel">
              Com carinho, Felipe & Evelyn.
            </span>
          </div>
        )}

        {/* Sync Status Note */}
        <div className="flex items-center justify-between text-[11px] text-[#8e8077] mb-6 px-1">
          <span>Código do Registro: #{record.id.slice(-6).toUpperCase()}</span>
          <span className="flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${supabaseSynced ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            {supabaseSynced ? 'Sincronizado no Supabase' : 'Salvo no Sistema Local'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          {isConfirmed && (
            <a
              href={createGoogleCalendarLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 px-4 rounded-xl font-cinzel text-xs font-semibold uppercase tracking-wider bg-[#1d1019] hover:bg-[#2d1827] text-[#e8d08d] border border-[#c5a059]/40 flex items-center justify-center gap-2 transition-all"
            >
              <Calendar className="w-4 h-4 text-[#c5a059]" />
              Salvar na Agenda Google
            </a>
          )}

          <button
            onClick={handleCopy}
            className="flex-1 py-3 px-4 rounded-xl font-cinzel text-xs font-semibold uppercase tracking-wider bg-[#140b12] hover:bg-[#1e111a] text-[#f4eae0] border border-[#c5a059]/40 flex items-center justify-center gap-2 transition-all"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                Copiado com Sucesso!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#a6988f]" />
                Copiar Comprovante
              </>
            )}
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="text-xs font-cinzel uppercase tracking-widest text-[#a6988f] hover:text-[#f4eae0] transition-colors"
          >
            Concluir e Voltar à Página
          </button>
        </div>
      </div>
    </div>
  );
};
