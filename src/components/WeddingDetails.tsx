import React from 'react';
import { Church, Sparkles, Clock, MapPin, Shirt, AlertCircle, HeartHandshake } from 'lucide-react';
import { WEDDING_INFO } from '../data/dishes';

export const WeddingDetails: React.FC = () => {
  return (
    <section id="detalhes" className="py-20 relative bg-[#090507]">
      {/* Subtle ornate background texture */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full border border-[#c5a059]/30 bg-[#160c13] text-[#c5a059] text-xs font-cinzel tracking-[0.25em] uppercase">
            <Sparkles className="w-3 h-3" />
            O Ritual & A Celebração
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-cinzel font-bold text-gold-gradient tracking-wider mb-4">
            Detalhes da Cerimônia
          </h2>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#b8aaa0] font-cormorant italic">
            Uma noite mística e inesquecível inspirada na arquitetura gótica vitoriana, rosas carmesim e luz de velas.
          </p>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#c5a059] to-transparent mx-auto mt-6" />
        </div>

        {/* 3 Main Detail Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Card 1: Cerimônia */}
          <div className="p-8 rounded-2xl bg-[#130b11] border border-[#c5a059]/30 relative overflow-hidden group hover:border-[#c5a059] transition-all hover:shadow-[0_0_30px_rgba(197,160,89,0.15)]">
            <div className="w-12 h-12 rounded-xl bg-[#240f1a] border border-[#84172c] flex items-center justify-center text-[#ff7e93] mb-6">
              <Church className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-cinzel font-semibold text-[#f4eae0] mb-2 tracking-wide">
              A Cerimônia
            </h3>
            <p className="text-sm font-cinzel text-[#c5a059] mb-4 flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> 19h30 em ponto
            </p>
            <p className="text-sm text-[#b8aaa0] leading-relaxed mb-4">
              {WEDDING_INFO.ceremonyVenue}
            </p>
            <div className="text-xs text-[#8f8076] flex items-start gap-1.5 pt-3 border-t border-[#c5a059]/15">
              <MapPin className="w-4 h-4 text-[#84172c] shrink-0 mt-0.5" />
              <span>{WEDDING_INFO.ceremonyAddress}</span>
            </div>
          </div>

          {/* Card 2: Recepção & Banquete */}
          <div className="p-8 rounded-2xl bg-[#130b11] border border-[#c5a059]/30 relative overflow-hidden group hover:border-[#c5a059] transition-all hover:shadow-[0_0_30px_rgba(197,160,89,0.15)]">
            <div className="w-12 h-12 rounded-xl bg-[#20150d] border border-[#c5a059] flex items-center justify-center text-[#f3df9b] mb-6">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-cinzel font-semibold text-[#f4eae0] mb-2 tracking-wide">
              Banquete & Festa
            </h3>
            <p className="text-sm font-cinzel text-[#c5a059] mb-4 flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> A partir das 21h00
            </p>
            <p className="text-sm text-[#b8aaa0] leading-relaxed mb-4">
              {WEDDING_INFO.receptionVenue}
            </p>
            <div className="text-xs text-[#8f8076] flex items-start gap-1.5 pt-3 border-t border-[#c5a059]/15">
              <MapPin className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
              <span>{WEDDING_INFO.receptionAddress}</span>
            </div>
          </div>

          {/* Card 3: Traje Dress Code */}
          <div className="p-8 rounded-2xl bg-[#130b11] border border-[#c5a059]/30 relative overflow-hidden group hover:border-[#c5a059] transition-all hover:shadow-[0_0_30px_rgba(197,160,89,0.15)]">
            <div className="w-12 h-12 rounded-xl bg-[#1b0811] border border-[#84172c] flex items-center justify-center text-[#ff7e93] mb-6">
              <Shirt className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-cinzel font-semibold text-[#f4eae0] mb-2 tracking-wide">
              Dress Code
            </h3>
            <p className="text-sm font-cinzel text-[#ff7e93] mb-4">
              {WEDDING_INFO.dressCode}
            </p>
            <p className="text-sm text-[#b8aaa0] leading-relaxed mb-4">
              {WEDDING_INFO.dressCodeDetails}
            </p>

            {/* Color Palette Swatches */}
            <div className="pt-3 border-t border-[#c5a059]/15">
              <div className="text-[10px] font-cinzel uppercase tracking-widest text-[#a6988f] mb-2">
                Paleta Sugerida:
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#0a0608] border border-[#443840]" title="Preto Ônix / Raven Black" />
                <span className="w-6 h-6 rounded-full bg-[#4e0917] border border-[#7f162c]" title="Borgonha / Vinho Escuro" />
                <span className="w-6 h-6 rounded-full bg-[#0b291c] border border-[#1b4d36]" title="Esmeralda Profundo" />
                <span className="w-6 h-6 rounded-full bg-[#0a1426] border border-[#193258]" title="Azul Meia-Noite" />
                <span className="w-6 h-6 rounded-full bg-[#9e7b23] border border-[#c5a059]" title="Ouro Envelhecido / Bronze" />
              </div>
            </div>
          </div>
        </div>

        {/* Notice Banner */}
        <div className="p-6 rounded-xl bg-[#1a0f17]/60 border border-[#84172c]/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2a0e19] border border-[#84172c] flex items-center justify-center text-[#ff7e93] shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-cinzel text-sm sm:text-base font-semibold text-[#f4eae0]">
                Prazo Impreterível de Confirmação (RSVP)
              </h4>
              <p className="text-xs sm:text-sm text-[#b8aaa0]">
                Por favor, confirme a presença e sua escolha de prato até <strong className="text-[#e8d08d]">{WEDDING_INFO.rsvpDeadline}</strong> para que nosso banquete gastronômico seja preparado com primor.
              </p>
            </div>
          </div>
          <button
            onClick={() => document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' })}
            className="shrink-0 px-5 py-2.5 rounded-lg font-cinzel text-xs font-bold uppercase tracking-wider text-white bg-[#84172c] hover:bg-[#a01f39] transition-colors border border-[#c5a059]/40"
          >
            Confirmar Agora
          </button>
        </div>
      </div>
    </section>
  );
};
