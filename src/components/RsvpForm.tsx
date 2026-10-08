import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Heart,
  Send,
  User,
  Mail,
  Phone,
  CheckCircle2,
  XCircle,
  Users,
  Utensils,
  Plus,
  Trash2,
  AlertCircle,
  Sparkles,
  Loader2,
  MessageSquare
} from 'lucide-react';
import { MAIN_DISHES, DIETARY_OPTIONS } from '../data/dishes';
import { RSVPFormData, Companion, RSVPRecord } from '../types/wedding';
import { submitRSVP } from '../services/rsvpService';
import { weddingSealImage } from '../assets/images';

interface RsvpFormProps {
  selectedDishId: string;
  onSelectDish: (dishId: string) => void;
  onSuccess: (record: RSVPRecord, supabaseSynced: boolean) => void;
}

export const RsvpForm: React.FC<RsvpFormProps> = ({
  selectedDishId,
  onSelectDish,
  onSuccess
}) => {
  const [formData, setFormData] = useState<RSVPFormData>({
    guestName: '',
    email: '',
    phone: '',
    attendanceStatus: 'confirmed',
    mainDishId: selectedDishId || 'filet-mignon-porto',
    dietaryRestrictions: '',
    dietaryTags: [],
    hasCompanions: false,
    companionsCount: 0,
    companions: [],
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Format phone number with Brazilian or international mask
  const handlePhoneChange = (val: string) => {
    // Clean string
    const digits = val.replace(/\D/g, '');
    let formatted = val;

    if (digits.length <= 11) {
      if (digits.length > 10) {
        // (11) 98765-4321
        formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
      } else if (digits.length > 6) {
        // (11) 8765-4321
        formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6, 10)}`;
      } else if (digits.length > 2) {
        formatted = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
      } else if (digits.length > 0) {
        formatted = `(${digits}`;
      }
    }

    setFormData(prev => ({ ...prev, phone: formatted }));
    if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.guestName.trim()) {
      newErrors.guestName = 'Por favor, informe seu nome completo.';
    } else if (formData.guestName.trim().length < 3) {
      newErrors.guestName = 'Nome muito curto.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'O e-mail é obrigatório para envio do passe de confirmação.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Insira um endereço de e-mail válido.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'O telefone / WhatsApp é obrigatório.';
    } else if (formData.phone.replace(/\D/g, '').length < 8) {
      newErrors.phone = 'Insira um telefone válido com DDD.';
    }

    if (formData.attendanceStatus === 'confirmed' && !formData.mainDishId) {
      newErrors.mainDishId = 'Por favor, selecione sua opção de prato principal.';
    }

    // Validate companions if enabled
    if (formData.hasCompanions && formData.attendanceStatus === 'confirmed') {
      if (formData.companions.length === 0) {
        newErrors.companions = 'Adicione ao menos um acompanhante ou desmarque a opção.';
      } else {
        formData.companions.forEach((comp, idx) => {
          if (!comp.name.trim()) {
            newErrors[`companion_${idx}`] = 'Preencha o nome do acompanhante.';
          }
        });
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCompanion = () => {
    setFormData(prev => ({
      ...prev,
      companionsCount: prev.companions.length + 1,
      companions: [
        ...prev.companions,
        {
          name: '',
          dishId: MAIN_DISHES[0].id,
          dietaryNotes: ''
        }
      ]
    }));
  };

  const handleRemoveCompanion = (index: number) => {
    setFormData(prev => {
      const updated = prev.companions.filter((_, i) => i !== index);
      return {
        ...prev,
        companions: updated,
        companionsCount: updated.length,
        hasCompanions: updated.length > 0
      };
    });
  };

  const handleCompanionFieldChange = (index: number, field: keyof Companion, value: string) => {
    setFormData(prev => {
      const updated = [...prev.companions];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, companions: updated };
    });
  };

  const toggleDietaryTag = (tagId: string) => {
    setFormData(prev => {
      const exists = prev.dietaryTags.includes(tagId);
      const updated = exists
        ? prev.dietaryTags.filter(t => t !== tagId)
        : [...prev.dietaryTags, tagId];
      return { ...prev, dietaryTags: updated };
    });
  };

  const fireGothicConfetti = () => {
    try {
      // Crimson, ruby, gold, and champagne gothic colors
      const colors = ['#84172c', '#d4af37', '#e8d08d', '#560d1e', '#110c10'];
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors,
        disableForReducedMotion: true
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors
        });
      }, 250);
    } catch (e) {
      // ignore in environments without canvas
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitRSVP(formData);
      if (formData.attendanceStatus === 'confirmed') {
        fireGothicConfetti();
      }
      onSuccess(result.record, result.supabaseSynced);
    } catch (err) {
      console.error('Erro ao enviar RSVP:', err);
      setErrors({ form: 'Ocorreu um erro inesperado ao salvar. Tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="rsvp" className="py-24 relative bg-[#090507]">
      {/* Background ornamentation */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full border border-[#c5a059]/30 bg-[#160b12] text-[#e8d08d] text-xs font-cinzel tracking-[0.25em] uppercase">
            <Heart className="w-3.5 h-3.5 text-[#ff7e93]" />
            Confirmação de Presença
          </div>
          <h2 className="text-3xl sm:text-5xl font-cinzel font-bold text-gold-gradient tracking-wider mb-4">
            RSVP Oficial
          </h2>
          <p className="max-w-xl mx-auto text-base sm:text-lg text-[#b8aaa0] font-cormorant italic">
            Honre-nos com sua confirmação e escolha seu prato principal para que nossa equipe de alta gastronomia prepare sua experiência com máxima perfeição.
          </p>
          <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#c5a059] to-transparent mx-auto mt-6" />
        </div>

        {/* Form Container */}
        <div className="rounded-3xl p-6 sm:p-10 bg-[#130b11] border border-[#c5a059]/35 shadow-[0_0_50px_rgba(0,0,0,0.85)] relative overflow-hidden">
          {/* Subtle top wax seal crest */}
          <div className="flex items-center justify-center -mt-2 mb-8">
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-[#1b0e18] border border-[#c5a059]/40">
              <img
                src={weddingSealImage}
                alt="Selo Evelyn e Felipe"
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="font-cinzel text-xs tracking-widest text-[#e8d08d] uppercase">
                Felipe & Evelyn • 31 de Outubro
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Attendance Status */}
            <div>
              <label className="block text-xs font-cinzel uppercase tracking-[0.2em] text-[#e8d08d] mb-4">
                Sua Presença na Noite Eterna *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, attendanceStatus: 'confirmed' }))}
                  className={`p-5 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
                    formData.attendanceStatus === 'confirmed'
                      ? 'bg-gradient-to-br from-[#2a0e19] to-[#160910] border-[#c5a059] shadow-[0_0_20px_rgba(197,160,89,0.25)] ring-1 ring-[#c5a059]/40'
                      : 'bg-[#0f090e] border-[#c5a059]/20 hover:border-[#c5a059]/50 text-[#a6988f]'
                  }`}
                >
                  <CheckCircle2
                    className={`w-6 h-6 shrink-0 mt-0.5 ${
                      formData.attendanceStatus === 'confirmed' ? 'text-[#ff7e93]' : 'text-[#594d45]'
                    }`}
                  />
                  <div>
                    <span className="font-cinzel text-sm sm:text-base font-bold text-[#f4eae0] block mb-1">
                      Sim, com certeza celebrarei!
                    </span>
                    <span className="text-xs text-[#b8aaa0] block leading-relaxed">
                      Estarei presente para brindar o amor de Felipe & Evelyn sob a luz das velas.
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, attendanceStatus: 'declined' }))}
                  className={`p-5 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
                    formData.attendanceStatus === 'declined'
                      ? 'bg-gradient-to-br from-[#231a20] to-[#120c11] border-[#84172c] shadow-[0_0_20px_rgba(132,23,44,0.3)] ring-1 ring-[#84172c]/40'
                      : 'bg-[#0f090e] border-[#c5a059]/20 hover:border-[#c5a059]/50 text-[#a6988f]'
                  }`}
                >
                  <XCircle
                    className={`w-6 h-6 shrink-0 mt-0.5 ${
                      formData.attendanceStatus === 'declined' ? 'text-[#ff7e93]' : 'text-[#594d45]'
                    }`}
                  />
                  <div>
                    <span className="font-cinzel text-sm sm:text-base font-bold text-[#f4eae0] block mb-1">
                      Infelizmente não poderei
                    </span>
                    <span className="text-xs text-[#b8aaa0] block leading-relaxed">
                      Estarei em pensamento desejando bênçãos e vida eterna ao casal.
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Step 2: Personal Info (Guest Name, Email, Phone) */}
            <div className="pt-4 border-t border-[#c5a059]/20">
              <h3 className="text-xs font-cinzel uppercase tracking-[0.2em] text-[#e8d08d] mb-4">
                Dados do Convidado
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Nome do Convidado */}
                <div>
                  <label className="block text-xs font-cinzel text-[#d4c6b8] mb-2 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#c5a059]" />
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.guestName}
                    onChange={e => {
                      setFormData(prev => ({ ...prev, guestName: e.target.value }));
                      if (errors.guestName) setErrors(prev => ({ ...prev, guestName: '' }));
                    }}
                    placeholder="Ex: Isabella Blackwood"
                    className={`w-full px-4 py-3 rounded-xl bg-[#0d070b] border ${
                      errors.guestName ? 'border-red-500' : 'border-[#c5a059]/30 focus:border-[#c5a059]'
                    } text-[#f4eae0] placeholder-[#6d5f57] text-sm focus:outline-none transition-all`}
                  />
                  {errors.guestName && (
                    <span className="text-[11px] text-red-400 mt-1 block font-sans">
                      {errors.guestName}
                    </span>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-cinzel text-[#d4c6b8] mb-2 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#c5a059]" />
                    E-mail *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => {
                      setFormData(prev => ({ ...prev, email: e.target.value }));
                      if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                    }}
                    placeholder="seu.email@exemplo.com"
                    className={`w-full px-4 py-3 rounded-xl bg-[#0d070b] border ${
                      errors.email ? 'border-red-500' : 'border-[#c5a059]/30 focus:border-[#c5a059]'
                    } text-[#f4eae0] placeholder-[#6d5f57] text-sm focus:outline-none transition-all`}
                  />
                  {errors.email && (
                    <span className="text-[11px] text-red-400 mt-1 block font-sans">
                      {errors.email}
                    </span>
                  )}
                </div>

                {/* Telefone / WhatsApp */}
                <div>
                  <label className="block text-xs font-cinzel text-[#d4c6b8] mb-2 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#c5a059]" />
                    Telefone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e => handlePhoneChange(e.target.value)}
                    placeholder="(11) 98765-4321"
                    className={`w-full px-4 py-3 rounded-xl bg-[#0d070b] border ${
                      errors.phone ? 'border-red-500' : 'border-[#c5a059]/30 focus:border-[#c5a059]'
                    } text-[#f4eae0] placeholder-[#6d5f57] text-sm focus:outline-none transition-all`}
                  />
                  {errors.phone && (
                    <span className="text-[11px] text-red-400 mt-1 block font-sans">
                      {errors.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Step 3: Main Course Selection (If Confirmed) */}
            {formData.attendanceStatus === 'confirmed' && (
              <div className="pt-4 border-t border-[#c5a059]/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-xs font-cinzel uppercase tracking-[0.2em] text-[#e8d08d] flex items-center gap-2">
                      <Utensils className="w-4 h-4 text-[#c5a059]" />
                      Escolha do seu Prato Principal *
                    </h3>
                    <p className="text-xs text-[#a6988f]">
                      Selecione o prato principal que o buffet servirá para você durante o banquete.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {MAIN_DISHES.map((dish) => {
                    const isChecked = (formData.mainDishId || selectedDishId) === dish.id;

                    return (
                      <label
                        key={dish.id}
                        className={`block p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-gradient-to-r from-[#2a0e19] to-[#150910] border-[#c5a059] shadow-[0_0_20px_rgba(197,160,89,0.2)]'
                            : 'bg-[#0d070b] border-[#c5a059]/20 hover:border-[#c5a059]/50'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <input
                            type="radio"
                            name="mainDishId"
                            value={dish.id}
                            checked={isChecked}
                            onChange={() => {
                              setFormData(prev => ({ ...prev, mainDishId: dish.id }));
                              onSelectDish(dish.id);
                              if (errors.mainDishId) setErrors(prev => ({ ...prev, mainDishId: '' }));
                            }}
                            className="mt-1 accent-[#c5a059] w-4 h-4 cursor-pointer"
                          />

                          <div className="flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                              <span className="font-cinzel text-base font-bold text-[#f4eae0]">
                                {dish.name}
                              </span>
                              {dish.badge && (
                                <span className="text-[10px] font-cinzel uppercase px-2 py-0.5 rounded bg-[#2c1421] border border-[#84172c] text-[#ff9fb2]">
                                  {dish.badge}
                                </span>
                              )}
                            </div>

                            <p className="text-xs sm:text-sm text-[#b8aaa0] leading-relaxed mb-2 font-cormorant">
                              {dish.shortDesc}
                            </p>

                            <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-[#8e8178]">
                              <span className="text-[#e8d08d] font-cinzel">Harmonização:</span> {dish.pairing}
                            </div>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>

                {errors.mainDishId && (
                  <span className="text-[11px] text-red-400 mt-2 block font-sans">
                    {errors.mainDishId}
                  </span>
                )}
              </div>
            )}

            {/* Step 4: Companions (If Confirmed) */}
            {formData.attendanceStatus === 'confirmed' && (
              <div className="pt-4 border-t border-[#c5a059]/20">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xs font-cinzel uppercase tracking-[0.2em] text-[#e8d08d] flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#c5a059]" />
                      Irá Levar Acompanhante?
                    </h3>
                    <p className="text-xs text-[#a6988f]">
                      Você pode registrar quem estará ao seu lado e escolher a refeição deles.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!formData.hasCompanions) {
                        setFormData(prev => ({
                          ...prev,
                          hasCompanions: true,
                          companionsCount: 1,
                          companions: [{ name: '', dishId: MAIN_DISHES[0].id, dietaryNotes: '' }]
                        }));
                      } else {
                        handleAddCompanion();
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-cinzel text-xs text-[#e8d08d] bg-[#1e101b] border border-[#c5a059]/40 hover:border-[#c5a059] transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> Adicionar Acompanhante
                  </button>
                </div>

                {formData.companions.length > 0 && (
                  <div className="space-y-4 mt-3">
                    {formData.companions.map((comp, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-[#0d070b] border border-[#c5a059]/25 relative"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-cinzel text-xs font-semibold text-[#e8d08d]">
                            Acompanhante 0{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveCompanion(idx)}
                            className="text-[#a6988f] hover:text-red-400 transition-colors p-1"
                            title="Remover acompanhante"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[11px] font-cinzel text-[#d4c6b8] mb-1">
                              Nome do Acompanhante *
                            </label>
                            <input
                              type="text"
                              value={comp.name}
                              onChange={e => handleCompanionFieldChange(idx, 'name', e.target.value)}
                              placeholder="Nome e Sobrenome"
                              className="w-full px-3 py-2 rounded-lg bg-[#140b12] border border-[#c5a059]/30 text-sm text-[#f4eae0] focus:outline-none focus:border-[#c5a059]"
                            />
                            {errors[`companion_${idx}`] && (
                              <span className="text-[10px] text-red-400 mt-1 block">
                                {errors[`companion_${idx}`]}
                              </span>
                            )}
                          </div>

                          <div>
                            <label className="block text-[11px] font-cinzel text-[#d4c6b8] mb-1">
                              Prato Principal do Acompanhante
                            </label>
                            <select
                              value={comp.dishId}
                              onChange={e => handleCompanionFieldChange(idx, 'dishId', e.target.value)}
                              className="w-full px-3 py-2 rounded-lg bg-[#140b12] border border-[#c5a059]/30 text-sm text-[#f4eae0] focus:outline-none focus:border-[#c5a059]"
                            >
                              {MAIN_DISHES.map(d => (
                                <option key={d.id} value={d.id}>
                                  {d.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 5: Dietary Preferences & Allergies */}
            {formData.attendanceStatus === 'confirmed' && (
              <div className="pt-4 border-t border-[#c5a059]/20">
                <h3 className="text-xs font-cinzel uppercase tracking-[0.2em] text-[#e8d08d] mb-2">
                  Restrições Alimentares & Alergias
                </h3>
                <p className="text-xs text-[#a6988f] mb-4">
                  Marque se houver alguma necessidade para que o chef adapte o menu com antecedência.
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {DIETARY_OPTIONS.map(opt => {
                    const isSelected = formData.dietaryTags.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => toggleDietaryTag(opt.id)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                          isSelected
                            ? 'bg-[#84172c] border-[#ff7e93] text-white'
                            : 'bg-[#10080f] border-[#c5a059]/25 text-[#a6988f] hover:border-[#c5a059]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>

                <input
                  type="text"
                  value={formData.dietaryRestrictions}
                  onChange={e => setFormData(prev => ({ ...prev, dietaryRestrictions: e.target.value }))}
                  placeholder="Alguma outra alergia severa ou observação para a cozinha? (Opcional)"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0d070b] border border-[#c5a059]/30 text-[#f4eae0] text-xs focus:outline-none focus:border-[#c5a059]"
                />
              </div>
            )}

            {/* Step 6: Message to Felipe & Evelyn */}
            <div className="pt-4 border-t border-[#c5a059]/20">
              <label className="block text-xs font-cinzel uppercase tracking-[0.2em] text-[#e8d08d] mb-2 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#c5a059]" />
                Mensagem aos Noivos (Opcional)
              </label>
              <textarea
                rows={3}
                value={formData.message}
                onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Escreva seus votos, carinho ou recado para Evelyn e Felipe nesta data inesquecível..."
                className="w-full px-4 py-3 rounded-xl bg-[#0d070b] border border-[#c5a059]/30 text-[#f4eae0] placeholder-[#6d5f57] text-sm focus:outline-none focus:border-[#c5a059] resize-none"
              />
            </div>

            {/* Error banner if any */}
            {errors.form && (
              <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/50 text-xs text-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errors.form}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl font-cinzel text-sm sm:text-base font-bold uppercase tracking-[0.2em] text-white bg-gradient-to-r from-[#84172c] via-[#560d1e] to-[#25040d] border border-[#c5a059] shadow-[0_0_30px_rgba(132,23,44,0.6)] hover:shadow-[0_0_40px_rgba(197,160,89,0.7)] hover:border-[#f3df9b] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-[#e8d08d]" />
                    <span>Gravando no Livro dos Noivos...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-[#e8d08d] group-hover:translate-x-1 transition-transform" />
                    <span>
                      {formData.attendanceStatus === 'confirmed'
                        ? 'Confirmar Presença e Escolha de Prato'
                        : 'Enviar Notificação aos Noivos'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
