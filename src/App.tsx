/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GothicNavbar } from './components/GothicNavbar';
import { HeroSection } from './components/HeroSection';
import { WeddingDetails } from './components/WeddingDetails';
import { DishesSection } from './components/DishesSection';
import { RsvpForm } from './components/RsvpForm';
import { ConfirmationModal } from './components/ConfirmationModal';
import { AdminModal } from './components/AdminModal';
import { SupabaseModal } from './components/SupabaseModal';
import { GothicFooter } from './components/GothicFooter';
import { RSVPRecord, SupabaseConfigStatus } from './types/wedding';
import { getSupabaseStatus } from './lib/supabase';
import { MAIN_DISHES } from './data/dishes';

export default function App() {
  const [selectedDishId, setSelectedDishId] = useState<string>(MAIN_DISHES[0].id);
  const [confirmedRecord, setConfirmedRecord] = useState<RSVPRecord | null>(null);
  const [supabaseSynced, setSupabaseSynced] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isSupabaseOpen, setIsSupabaseOpen] = useState<boolean>(false);
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseConfigStatus>(getSupabaseStatus());

  const handleConfigChanged = () => {
    setSupabaseStatus(getSupabaseStatus());
  };

  const handleRsvpSuccess = (record: RSVPRecord, synced: boolean) => {
    setConfirmedRecord(record);
    setSupabaseSynced(synced);
  };

  return (
    <div className="min-h-screen bg-[#080507] text-[#eae3dc] font-cormorant selection:bg-[#721528] selection:text-[#f8f0ea] relative overflow-x-hidden">
      {/* Navigation Bar */}
      <GothicNavbar
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenSupabase={() => setIsSupabaseOpen(true)}
        supabaseStatus={supabaseStatus}
      />

      {/* Main Wedding Sections */}
      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Wedding Details & Dress Code */}
        <WeddingDetails />

        {/* Gourmet Main Dishes Showcase */}
        <DishesSection
          selectedDishId={selectedDishId}
          onSelectDish={(id) => setSelectedDishId(id)}
        />

        {/* RSVP Form with Guest Name, Email, Phone, Dish Selection & Companions */}
        <RsvpForm
          selectedDishId={selectedDishId}
          onSelectDish={(id) => setSelectedDishId(id)}
          onSuccess={handleRsvpSuccess}
        />
      </main>

      {/* Footer */}
      <GothicFooter
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenSupabase={() => setIsSupabaseOpen(true)}
      />

      {/* Confirmation Digital Pass Modal */}
      <ConfirmationModal
        record={confirmedRecord}
        supabaseSynced={supabaseSynced}
        onClose={() => setConfirmedRecord(null)}
      />

      {/* Bride & Groom Dashboard Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onOpenSupabaseConfig={() => {
          setIsAdminOpen(false);
          setIsSupabaseOpen(true);
        }}
      />

      {/* Supabase Integration & SQL Schema Modal */}
      <SupabaseModal
        isOpen={isSupabaseOpen}
        onClose={() => setIsSupabaseOpen(false)}
        onConfigChanged={handleConfigChanged}
      />
    </div>
  );
}
