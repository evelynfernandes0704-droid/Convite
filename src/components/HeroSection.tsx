import React, { useState, useEffect } from 'react';
import { Heart, Calendar, MapPin, ChevronDown, Sparkles } from 'lucide-react';
import { weddingHeroImage, weddingSealImage } from '../assets/images';
import { WEDDING_INFO } from '../data/dishes';

export const HeroSection: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date(WEDDING_INFO.dateIso).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToRSVP = () => {
    document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToMenu = () => {
    document.getElementById('cardapio')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-screen pt-24 pb-16 flex items-center justify-center overflow-hidden">
      {/* Background Image with Dark Vignette */}
      <div className="absolute inset-0 z-0">
        <img
          src={weddingHeroImage}
          alt="Salão de Casamento Gótico Elegante de Felipe e Evelyn"
          className="w-full h-full object-cover object-center filter brightness-[0.42] contrast-[1.12]"
        />
        {/* Layered atmospheric gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080507] via-[#080507]/60 to-[#080507]/80" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#080507]/50 to-[#080507]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#560d1e]/25 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center pt-8">
        {/* Ornate Wax Seal emblem */}
        <div className="flex justify-center mb-6">
          <div className="relative group">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden p-1 bg-gradient-to-br from-[#c5a059] via-[#84172c] to-[#3a0510] shadow-[0_0_35px_rgba(197,160,89,0.45)] border border-[#c5a059]">
              <img
                src={weddingSealImage}
                alt="Selo Monograma Evelyn e Felipe"
                className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            {/* Candle glow points */}
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 candle-glow shadow-[0_0_12px_#ffaa33]" />
            <div className="absolute -bottom-1 -left-1 w-3 h-3 rounded-full bg-amber-400 candle-glow shadow-[0_0_12px_#ffaa33]" />
          </div>
        </div>

        {/* Subtitle / Invitation Call */}
        <div className="inline-block px-4 py-1 mb-4 rounded-full border border-[#c5a059]/40 bg-[#160b12]/80 backdrop-blur-sm">
          <p className="font-cinzel text-xs sm:text-sm tracking-[0.3em] uppercase text-[#e8d08d]">
            Celebração da União Eterna
          </p>
        </div>

        {/* Names */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-cinzel font-black tracking-[0.1em] text-gold-gradient mb-3 drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
          FELIPE & EVELYN
        </h1>

        {/* Poetic script text */}
        <p className="font-script text-3xl sm:text-4xl md:text-5xl text-[#f3e5db] mb-6 drop-shadow-md">
          {WEDDING_INFO.quote}
        </p>

        {/* Date and Location pills */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm font-cinzel tracking-wider text-[#dcd1c7] mb-8">
          <div className="flex items-center gap-2 bg-[#120a10]/80 border border-[#c5a059]/30 px-4 py-2 rounded-lg">
            <Calendar className="w-4 h-4 text-[#c5a059]" />
            <span>{WEDDING_INFO.date} • {WEDDING_INFO.time}</span>
          </div>
          <div className="flex items-center gap-2 bg-[#120a10]/80 border border-[#c5a059]/30 px-4 py-2 rounded-lg">
            <MapPin className="w-4 h-4 text-[#84172c]" />
            <span>{WEDDING_INFO.ceremonyVenue}</span>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="max-w-xl mx-auto mb-10 p-5 rounded-2xl bg-[#140b12]/75 border border-[#c5a059]/35 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.8)]">
          <div className="text-[11px] font-cinzel uppercase tracking-[0.25em] text-[#a6988f] mb-3">
            Tempo restante até a noite dos votos
          </div>
          <div className="grid grid-cols-4 gap-2 sm:gap-4 font-cinzel">
            <div className="bg-[#090507]/90 border border-[#c5a059]/20 rounded-lg py-2 sm:py-3">
              <span className="text-2xl sm:text-3xl font-bold text-gold-gradient block">{timeLeft.days}</span>
              <span className="text-[10px] sm:text-xs tracking-widest text-[#a6988f] uppercase">Dias</span>
            </div>
            <div className="bg-[#090507]/90 border border-[#c5a059]/20 rounded-lg py-2 sm:py-3">
              <span className="text-2xl sm:text-3xl font-bold text-gold-gradient block">{timeLeft.hours}</span>
              <span className="text-[10px] sm:text-xs tracking-widest text-[#a6988f] uppercase">Horas</span>
            </div>
            <div className="bg-[#090507]/90 border border-[#c5a059]/20 rounded-lg py-2 sm:py-3">
              <span className="text-2xl sm:text-3xl font-bold text-gold-gradient block">{timeLeft.minutes}</span>
              <span className="text-[10px] sm:text-xs tracking-widest text-[#a6988f] uppercase">Min</span>
            </div>
            <div className="bg-[#090507]/90 border border-[#c5a059]/20 rounded-lg py-2 sm:py-3">
              <span className="text-2xl sm:text-3xl font-bold text-wine-gradient block">{timeLeft.seconds}</span>
              <span className="text-[10px] sm:text-xs tracking-widest text-[#a6988f] uppercase">Seg</span>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={scrollToRSVP}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-cinzel text-sm uppercase tracking-[0.2em] font-bold text-white bg-gradient-to-r from-[#7f162c] via-[#560d1e] to-[#2e050f] border border-[#c5a059] shadow-[0_0_25px_rgba(127,22,44,0.6)] hover:shadow-[0_0_35px_rgba(197,160,89,0.7)] hover:border-[#f3df9b] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Confirmar Presença (RSVP)
          </button>
          <button
            onClick={scrollToMenu}
            className="w-full sm:w-auto px-7 py-4 rounded-xl font-cinzel text-sm uppercase tracking-[0.18em] font-semibold text-[#e8dfd8] bg-[#120a10]/85 border border-[#c5a059]/40 hover:border-[#c5a059] hover:bg-[#1f111b] transition-all"
          >
            Ver Pratos Principais
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="mt-12 flex justify-center">
          <a
            href="#detalhes"
            className="flex flex-col items-center gap-1 text-[11px] font-cinzel tracking-[0.2em] text-[#a6988f] hover:text-[#e8d08d] transition-colors"
          >
            <span>DESCUBRA OS DETALHES</span>
            <ChevronDown className="w-4 h-4 animate-bounce text-[#c5a059]" />
          </a>
        </div>
      </div>
    </section>
  );
};
