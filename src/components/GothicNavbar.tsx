import React from 'react';
import { Sparkles, Heart, ShieldCheck, Database, Calendar, UtensilsCrossed } from 'lucide-react';
import { AudioAtmosphere } from './AudioAtmosphere';
import { SupabaseConfigStatus } from '../types/wedding';

interface GothicNavbarProps {
  onOpenAdmin: () => void;
  onOpenSupabase: () => void;
  supabaseStatus: SupabaseConfigStatus;
}

export const GothicNavbar: React.FC<GothicNavbarProps> = ({
  onOpenAdmin,
  onOpenSupabase,
  supabaseStatus
}) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#080507]/85 backdrop-blur-md border-b border-[#c5a059]/25 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Brand / Couple Monogram */}
        <div 
          onClick={() => scrollTo('hero')} 
          className="cursor-pointer flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-full border border-[#c5a059]/60 flex items-center justify-center bg-[#180f15] shadow-[0_0_15px_rgba(197,160,89,0.25)] group-hover:border-[#c5a059] transition-all">
            <span className="font-cinzel text-sm font-bold tracking-widest text-gold-gradient">
              F&E
            </span>
          </div>
          <div>
            <div className="font-cinzel text-sm sm:text-base font-semibold tracking-[0.2em] text-[#f4eae0] group-hover:text-gold-gradient transition-colors">
              FELIPE & EVELYN
            </div>
            <div className="text-[10px] tracking-[0.25em] text-[#a6988f] font-cinzel uppercase">
              31 . OUTUBRO . 2026
            </div>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs uppercase tracking-[0.18em] font-cinzel">
          <button
            onClick={() => scrollTo('detalhes')}
            className="text-[#cfc3b8] hover:text-[#e8d08d] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#c5a059] hover:after:w-full after:transition-all"
          >
            O Casamento
          </button>
          <button
            onClick={() => scrollTo('cardapio')}
            className="text-[#cfc3b8] hover:text-[#e8d08d] transition-colors flex items-center gap-1.5 py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#c5a059] hover:after:w-full after:transition-all"
          >
            <UtensilsCrossed className="w-3.5 h-3.5 text-[#c5a059]" />
            Menu Principal
          </button>
          <button
            onClick={() => scrollTo('rsvp')}
            className="text-[#ff92a6] hover:text-[#ffb3c1] font-semibold transition-colors flex items-center gap-1.5 py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#ff7e93] hover:after:w-full after:transition-all"
          >
            <Heart className="w-3.5 h-3.5 fill-[#84172c] text-[#ff7e93]" />
            Confirmar Presença
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <AudioAtmosphere />

          {/* Supabase Status Pill */}
          <button
            onClick={onOpenSupabase}
            title={supabaseStatus.message}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-cinzel border transition-all bg-[#0e0a0d] border-[#c5a059]/30 hover:border-[#c5a059] text-[#d6c9be]"
          >
            <Database className={`w-3 h-3 ${supabaseStatus.isConfigured ? 'text-emerald-400' : 'text-[#c5a059]'}`} />
            <span>Supabase</span>
            <span className={`w-1.5 h-1.5 rounded-full ${supabaseStatus.isConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          </button>

          {/* Bride & Groom Admin Access */}
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-cinzel tracking-wider uppercase bg-gradient-to-r from-[#3e0b17] to-[#1a060b] border border-[#84172c]/80 text-[#ffb5c2] hover:border-[#ff7e93] hover:text-white transition-all shadow-[0_0_12px_rgba(132,23,44,0.3)]"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#ff7e93]" />
            <span className="hidden sm:inline">Área dos Noivos</span>
            <span className="sm:hidden">Noivos</span>
          </button>
        </div>
      </div>
    </header>
  );
};
