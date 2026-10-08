import React, { useState } from 'react';
import { Utensils, Wine, Sparkles, CheckCircle2, ChevronRight, Info, Crown, Leaf, Fish } from 'lucide-react';
import { MAIN_DISHES } from '../data/dishes';
import { Dish } from '../types/wedding';

interface DishesSectionProps {
  onSelectDish: (dishId: string) => void;
  selectedDishId?: string;
}

export const DishesSection: React.FC<DishesSectionProps> = ({
  onSelectDish,
  selectedDishId
}) => {
  const [activeModalDish, setActiveModalDish] = useState<Dish | null>(null);

  const handleSelect = (dishId: string) => {
    onSelectDish(dishId);
    const rsvpElement = document.getElementById('rsvp');
    if (rsvpElement) {
      rsvpElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="cardapio" className="py-24 relative bg-[#0b0709] border-t border-b border-[#c5a059]/20">
      {/* Background dark radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#560d1e]/10 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Title */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full border border-[#c5a059]/30 bg-[#160b12] text-[#e8d08d] text-xs font-cinzel tracking-[0.25em] uppercase">
            <Utensils className="w-3.5 h-3.5 text-[#c5a059]" />
            Alta Gastronomia Sombria
          </div>
          <h2 className="text-3xl sm:text-5xl font-cinzel font-bold text-gold-gradient tracking-wider mb-4">
            O Banquete: Prato Principal
          </h2>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#b8aaa0] font-cormorant italic">
            Elaborado exclusivamente para o casamento de Felipe & Evelyn, nosso menu combina cortes nobres, ingredientes escuros raros e harmonização requintada. Escolha a sua preferência:
          </p>
          <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#c5a059] to-transparent mx-auto mt-6" />
        </div>

        {/* Dishes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {MAIN_DISHES.map((dish, index) => {
            const isSelected = selectedDishId === dish.id;

            return (
              <div
                key={dish.id}
                className={`flex flex-col justify-between rounded-2xl p-7 transition-all duration-300 relative bg-[#130b11] border ${
                  isSelected
                    ? 'border-[#c5a059] shadow-[0_0_30px_rgba(197,160,89,0.3)] ring-1 ring-[#c5a059]/50'
                    : 'border-[#c5a059]/30 hover:border-[#c5a059]/70 hover:shadow-[0_0_20px_rgba(0,0,0,0.8)]'
                }`}
              >
                {/* Badge Header */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  {dish.badge ? (
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-cinzel tracking-wider uppercase bg-[#28131d] border border-[#84172c] text-[#ff9fb2]">
                      {dish.badge}
                    </span>
                  ) : <div />}

                  <span className="text-xs font-cinzel text-[#a6988f]">
                    Opção 0{index + 1}
                  </span>
                </div>

                {/* Dish Name */}
                <div>
                  <h3 className="text-xl sm:text-2xl font-cinzel font-semibold text-[#f7ede4] mb-3 leading-snug">
                    {dish.name}
                  </h3>
                  <p className="text-sm text-[#bcaea4] leading-relaxed mb-6 font-cormorant text-base">
                    {dish.shortDesc}
                  </p>
                </div>

                {/* Wine Pairing & Tags */}
                <div className="space-y-4 pt-4 border-t border-[#c5a059]/15">
                  <div className="flex items-start gap-2 text-xs text-[#d8c2ad]">
                    <Wine className="w-4 h-4 text-[#84172c] shrink-0 mt-0.5" />
                    <span><strong className="text-[#e8d08d] font-cinzel">Harmonização:</strong> {dish.pairing}</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {dish.dietaryTags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#1f141b] border border-[#c5a059]/20 text-[#a6988f]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => handleSelect(dish.id)}
                      className={`flex-1 py-3 px-4 rounded-xl font-cinzel text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#c5a059] text-[#080507] shadow-[0_0_15px_rgba(197,160,89,0.5)]'
                          : 'bg-[#26101c] hover:bg-[#3d182b] text-[#f4eae0] border border-[#84172c]'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" /> Selecionado no RSVP
                        </>
                      ) : (
                        <>
                          Escolher Este Prato
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setActiveModalDish(dish)}
                      title="Ver detalhes dos ingredientes"
                      className="p-3 rounded-xl bg-[#1a0f17] border border-[#c5a059]/30 text-[#e8d08d] hover:border-[#c5a059] hover:bg-[#251521] transition-all"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dietary Note at Bottom */}
        <div className="text-center max-w-xl mx-auto p-5 rounded-xl bg-[#140b12] border border-[#c5a059]/25 text-xs text-[#a6988f]">
          <p>
            Possui alergia alimentar severa ou restrição nutricional não contemplada acima?
            No formulário de RSVP abaixo você poderá detalhar todas as suas necessidades para a equipe de chefes de cozinha.
          </p>
        </div>
      </div>

      {/* Detail Modal */}
      {activeModalDish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-lg w-full bg-[#140b12] border border-[#c5a059] rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.9)] relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveModalDish(null)}
              className="absolute top-4 right-4 text-[#a6988f] hover:text-[#f4eae0] font-cinzel text-lg"
            >
              ✕
            </button>

            <span className="inline-block px-3 py-0.5 rounded-full text-xs font-cinzel tracking-wider uppercase bg-[#28131d] border border-[#84172c] text-[#ff9fb2] mb-3">
              {activeModalDish.badge || 'Prato Principal'}
            </span>

            <h3 className="text-2xl font-cinzel font-bold text-gold-gradient mb-3">
              {activeModalDish.name}
            </h3>

            <p className="text-sm sm:text-base text-[#ded2c7] leading-relaxed mb-6 font-cormorant">
              {activeModalDish.detailedDesc}
            </p>

            <div className="mb-6">
              <h4 className="text-xs font-cinzel uppercase tracking-widest text-[#e8d08d] mb-3">
                Composição & Ingredientes Nobres:
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#bcaea4]">
                {activeModalDish.ingredients.map((ing) => (
                  <li key={ing} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059]" />
                    {ing}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-lg bg-[#0e080d] border border-[#c5a059]/20 mb-6 text-xs text-[#d8c2ad]">
              <span className="font-cinzel text-[#e8d08d] block mb-1">Nota do Chef:</span>
              <p className="italic">{activeModalDish.chefNote}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  handleSelect(activeModalDish.id);
                  setActiveModalDish(null);
                }}
                className="flex-1 py-3 px-4 rounded-xl font-cinzel text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#84172c] to-[#560d1e] text-white border border-[#c5a059]"
              >
                Confirmar Escolha no RSVP
              </button>
              <button
                onClick={() => setActiveModalDish(null)}
                className="py-3 px-4 rounded-xl font-cinzel text-xs uppercase tracking-wider bg-[#1c1219] text-[#a6988f] border border-[#c5a059]/30"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
