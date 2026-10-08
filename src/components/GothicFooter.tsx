import React from 'react';
import { Heart, Sparkles, ShieldCheck, Database } from 'lucide-react';
import { WEDDING_INFO } from '../data/dishes';
import { weddingSealImage } from '../assets/images';

interface GothicFooterProps {
  onOpenAdmin: () => void;
  onOpenSupabase: () => void;
}

export const GothicFooter: React.FC<GothicFooterProps> = ({
  onOpenAdmin,
  onOpenSupabase
}) => {
  return (
    <footer className="relative bg-[#050304] border-t border-[#c5a059]/25 py-16 text-center text-xs text-[#8e8077]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Seal */}
        <div className="w-16 h-16 rounded-full overflow-hidden p-0.5 bg-gradient-to-br from-[#c5a059] to-[#84172c] mx-auto mb-4 border border-[#c5a059]/60 shadow-[0_0_20px_rgba(197,160,89,0.25)]">
          <img
            src={weddingSealImage}
            alt="Monograma Evelyn & Felipe"
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        <h3 className="text-xl font-cinzel font-bold text-gold-gradient tracking-[0.2em] mb-2">
          FELIPE & EVELYN
        </h3>

        <p className="font-script text-2xl text-[#d4c6b8] mb-6">
          "Até que a eternidade nos acolha no mesmo abraço."
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] font-cinzel uppercase tracking-widest text-[#a6988f] mb-8">
          <span>{WEDDING_INFO.date}</span>
          <span>•</span>
          <span>{WEDDING_INFO.ceremonyVenue}</span>
          <span>•</span>
          <span>São Paulo - SP</span>
        </div>

        <div className="w-16 h-[1px] bg-[#c5a059]/30 mx-auto mb-8" />

        {/* Admin and Supabase footer triggers */}
        <div className="flex items-center justify-center gap-4 text-xs">
          <button
            onClick={onOpenAdmin}
            className="text-[#a6988f] hover:text-[#e8d08d] transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#ff7e93]" />
            Área dos Noivos (Felipe & Evelyn)
          </button>
          <span>•</span>
          <button
            onClick={onOpenSupabase}
            className="text-[#a6988f] hover:text-[#e8d08d] transition-colors flex items-center gap-1.5"
          >
            <Database className="w-3.5 h-3.5 text-[#c5a059]" />
            Status Supabase
          </button>
        </div>

        <p className="text-[10px] text-[#5e534c] mt-8 tracking-wider">
          Celebração Matrimonial Gótica & Sistema de RSVP © 2026. Feito com amor e sombras.
        </p>
      </div>
    </footer>
  );
};
