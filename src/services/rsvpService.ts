import { RSVPFormData, RSVPRecord } from '../types/wedding';
import { getSupabaseClient } from '../lib/supabase';
import { MAIN_DISHES } from '../data/dishes';

const LOCAL_STORAGE_KEY = 'wedding_rsvps_felipe_evelyn';

// Pre-seeded demo records for initial experience
const INITIAL_DEMO_RECORDS: RSVPRecord[] = [
  {
    id: 'demo-1',
    guestName: 'Isabella Blackwood',
    email: 'isabella.blackwood@email.com',
    phone: '(11) 98765-4321',
    attendanceStatus: 'confirmed',
    mainDishId: 'filet-mignon-porto',
    dietaryRestrictions: '',
    dietaryTags: [],
    hasCompanions: true,
    companionsCount: 1,
    companions: [
      {
        name: 'Damian Blackwood',
        dishId: 'confit-pato-amarenas',
        dietaryNotes: ''
      }
    ],
    message: 'Não poderíamos faltar a esta união sob a luz do luar! Que a noite seja lendária.',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    syncedWithSupabase: false
  },
  {
    id: 'demo-2',
    guestName: 'Victor Von Raven',
    email: 'victor.raven@email.com',
    phone: '(11) 99123-8899',
    attendanceStatus: 'confirmed',
    mainDishId: 'salmao-ervas-negras',
    dietaryRestrictions: 'Sem lactose na redução',
    dietaryTags: ['sem-lactose'],
    hasCompanions: false,
    companionsCount: 0,
    companions: [],
    message: 'Vida longa ao casal mais elegante e autêntico deste mundo. Brindaremos com vinho tinto!',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    syncedWithSupabase: false
  },
  {
    id: 'demo-3',
    guestName: 'Clara Delamare',
    email: 'clara.delamare@email.com',
    phone: '(11) 97654-1122',
    attendanceStatus: 'confirmed',
    mainDishId: 'risotto-tartufo-nero',
    dietaryRestrictions: 'Vegetariana estrita',
    dietaryTags: ['vegetariano'],
    hasCompanions: false,
    companionsCount: 0,
    companions: [],
    message: 'Evelyn e Felipe, ansiosa para testemunhar esse amor tão sublime e único!',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    syncedWithSupabase: false
  }
];

export function getLocalRSVPs(): RSVPRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      // Initialize with demo records
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_RECORDS));
      return INITIAL_DEMO_RECORDS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Erro ao ler RSVPs do localStorage:', err);
    return INITIAL_DEMO_RECORDS;
  }
}

export function saveLocalRSVPs(records: RSVPRecord[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    console.error('Erro ao salvar RSVPs no localStorage:', err);
  }
}

export async function submitRSVP(formData: RSVPFormData): Promise<{ success: boolean; record: RSVPRecord; message: string; supabaseSynced: boolean }> {
  const newRecord: RSVPRecord = {
    ...formData,
    id: 'rsvp-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    createdAt: new Date().toISOString(),
    syncedWithSupabase: false
  };

  let supabaseSynced = false;
  const client = getSupabaseClient();

  if (client) {
    try {
      // Find dish name
      const mainDish = MAIN_DISHES.find(d => d.id === formData.mainDishId);
      const mainDishName = mainDish ? mainDish.name : formData.mainDishId;

      const { data, error } = await client.from('rsvps').insert([
        {
          guest_name: formData.guestName,
          email: formData.email,
          phone: formData.phone,
          attendance_status: formData.attendanceStatus,
          main_dish: formData.attendanceStatus === 'confirmed' ? mainDishName : null,
          dietary_restrictions: formData.dietaryRestrictions || null,
          dietary_tags: formData.dietaryTags,
          has_companions: formData.hasCompanions,
          companions_count: formData.hasCompanions ? formData.companionsCount : 0,
          companions: formData.hasCompanions ? formData.companions : [],
          message: formData.message || null
        }
      ]).select();

      if (error) {
        console.warn('Aviso do Supabase ao inserir (salvando localmente):', error.message);
      } else {
        supabaseSynced = true;
        if (data && data[0]?.id) {
          newRecord.id = data[0].id;
        }
      }
    } catch (err: any) {
      console.warn('Erro de rede ou conexão com Supabase:', err.message);
    }
  }

  newRecord.syncedWithSupabase = supabaseSynced;

  // Always persist locally as well so no RSVP is ever lost
  const localList = getLocalRSVPs();
  // Filter out any duplicate email if existing
  const updatedList = [newRecord, ...localList.filter(r => r.email.toLowerCase() !== formData.email.toLowerCase())];
  saveLocalRSVPs(updatedList);

  return {
    success: true,
    record: newRecord,
    supabaseSynced,
    message: supabaseSynced
      ? 'Presença confirmada e sincronizada com sucesso com o Supabase!'
      : 'Presença confirmada com sucesso no sistema local!'
  };
}

export async function fetchAllRSVPs(): Promise<{ records: RSVPRecord[]; fromSupabase: boolean }> {
  const client = getSupabaseClient();
  const localRecords = getLocalRSVPs();

  if (!client) {
    return { records: localRecords, fromSupabase: false };
  }

  try {
    const { data, error } = await client
      .from('rsvps')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.warn('Não foi possível ler do Supabase:', error?.message);
      return { records: localRecords, fromSupabase: false };
    }

    // Map supabase fields back to RSVPRecord
    const supabaseRecords: RSVPRecord[] = data.map((item: any) => {
      // Find matching dish ID from name or fallback
      const matchingDish = MAIN_DISHES.find(d => d.name === item.main_dish || d.id === item.main_dish);
      const dishId = matchingDish ? matchingDish.id : (item.main_dish || '');

      return {
        id: item.id,
        guestName: item.guest_name,
        email: item.email,
        phone: item.phone,
        attendanceStatus: item.attendance_status as 'confirmed' | 'declined',
        mainDishId: dishId,
        dietaryRestrictions: item.dietary_restrictions || '',
        dietaryTags: item.dietary_tags || [],
        hasCompanions: item.has_companions || false,
        companionsCount: item.companions_count || 0,
        companions: item.companions || [],
        message: item.message || '',
        createdAt: item.created_at,
        syncedWithSupabase: true
      };
    });

    return { records: supabaseRecords, fromSupabase: true };
  } catch (err) {
    console.warn('Erro ao consultar Supabase, retornando local:', err);
    return { records: localRecords, fromSupabase: false };
  }
}

export async function deleteRSVP(id: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('rsvps').delete().eq('id', id);
    } catch (err) {
      console.warn('Falha ao excluir no Supabase:', err);
    }
  }

  const local = getLocalRSVPs();
  const updated = local.filter(r => r.id !== id);
  saveLocalRSVPs(updated);
  return true;
}

export function exportRSVPsToCSV(records: RSVPRecord[]): string {
  const headers = [
    'Nome do Convidado',
    'Email',
    'Telefone',
    'Status Presenca',
    'Prato Principal',
    'Acompanhantes',
    'Nomes Acompanhantes',
    'Restricoes Alimentares',
    'Tags Alimentares',
    'Mensagem aos Noivos',
    'Data de Confirmacao'
  ];

  const rows = records.map(r => {
    const dish = MAIN_DISHES.find(d => d.id === r.mainDishId);
    const dishName = dish ? dish.name : (r.mainDishId || 'Nenhum');
    const companionNames = r.companions && r.companions.length > 0 
      ? r.companions.map(c => `${c.name} (${MAIN_DISHES.find(d => d.id === c.dishId)?.name || 'N/A'})`).join('; ')
      : 'Nenhum';

    return [
      `"${r.guestName.replace(/"/g, '""')}"`,
      `"${r.email.replace(/"/g, '""')}"`,
      `"${r.phone.replace(/"/g, '""')}"`,
      `"${r.attendanceStatus === 'confirmed' ? 'Confirmado' : 'Recusado'}"`,
      `"${dishName.replace(/"/g, '""')}"`,
      r.companionsCount || 0,
      `"${companionNames.replace(/"/g, '""')}"`,
      `"${(r.dietaryRestrictions || '').replace(/"/g, '""')}"`,
      `"${(r.dietaryTags || []).join(', ')}"`,
      `"${(r.message || '').replace(/"/g, '""')}"`,
      `"${new Date(r.createdAt).toLocaleString('pt-BR')}"`
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}
