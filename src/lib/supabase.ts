import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SupabaseConfigStatus } from '../types/wedding';

// Key for saving custom Supabase config in localStorage if configured by the bride/groom
const STORAGE_SUPABASE_URL = 'wedding_supabase_url';
const STORAGE_SUPABASE_KEY = 'wedding_supabase_anon_key';

let cachedClient: SupabaseClient | null = null;
let currentUrl: string = '';
let currentKey: string = '';

export function getSupabaseCredentials(): { url: string; key: string; source: 'env' | 'custom' | 'none' } {
  // Check Vite environment variables first
  const envUrl = (import.meta.env.VITE_SUPABASE_URL as string) || '';
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';

  if (envUrl && envKey) {
    return { url: envUrl, key: envKey, source: 'env' };
  }

  // Check custom configuration stored in localStorage
  if (typeof window !== 'undefined') {
    const customUrl = localStorage.getItem(STORAGE_SUPABASE_URL) || '';
    const customKey = localStorage.getItem(STORAGE_SUPABASE_KEY) || '';
    if (customUrl && customKey) {
      return { url: customUrl, key: customKey, source: 'custom' };
    }
  }

  return { url: '', key: '', source: 'none' };
}

export function saveCustomSupabaseCredentials(url: string, key: string) {
  if (typeof window !== 'undefined') {
    if (url && key) {
      localStorage.setItem(STORAGE_SUPABASE_URL, url.trim());
      localStorage.setItem(STORAGE_SUPABASE_KEY, key.trim());
    } else {
      localStorage.removeItem(STORAGE_SUPABASE_URL);
      localStorage.removeItem(STORAGE_SUPABASE_KEY);
    }
    // Invalidate cached client
    cachedClient = null;
    currentUrl = '';
    currentKey = '';
  }
}

export function getSupabaseClient(): SupabaseClient | null {
  const { url, key } = getSupabaseCredentials();

  if (!url || !key) {
    return null;
  }

  if (cachedClient && currentUrl === url && currentKey === key) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, key);
    currentUrl = url;
    currentKey = key;
    return cachedClient;
  } catch (error) {
    console.error('Falha ao inicializar o cliente Supabase:', error);
    return null;
  }
}

export function getSupabaseStatus(): SupabaseConfigStatus {
  const { url, key, source } = getSupabaseCredentials();

  if (url && key) {
    return {
      isConfigured: true,
      url,
      hasAnonKey: true,
      source: source === 'env' ? 'env' : 'custom',
      message: source === 'env' 
        ? 'Conectado via variáveis de ambiente do Supabase.' 
        : 'Conectado via configuração personalizada de Evelyn & Felipe.'
    };
  }

  return {
    isConfigured: false,
    source: 'local_fallback',
    message: 'Operando com armazenamento local persistente. Conexão com Supabase pronta para ativação.'
  };
}

export const SUPABASE_SQL_SCHEMA = `-- ========================================================
-- BANCO DE DADOS SUPABASE — CASAMENTO EVELYN & FELIPE
-- Script pronto para ser executado no Supabase SQL Editor
-- ========================================================

-- 1. Criação da tabela de confirmações de presença (RSVPs)
CREATE TABLE IF NOT EXISTS public.rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  attendance_status TEXT NOT NULL CHECK (attendance_status IN ('confirmed', 'declined')),
  main_dish TEXT,
  dietary_restrictions TEXT,
  dietary_tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  has_companions BOOLEAN DEFAULT FALSE,
  companions_count INTEGER DEFAULT 0,
  companions JSONB DEFAULT '[]'::JSONB,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- 2. Habilitar Row Level Security (RLS)
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- 3. Política: Qualquer convidado pode enviar RSVP (INSERT público)
CREATE POLICY "Permitir envio publico de RSVP"
  ON public.rsvps
  FOR INSERT
  WITH CHECK (true);

-- 4. Política: Leitura pública das confirmações
CREATE POLICY "Permitir leitura publica de RSVPs"
  ON public.rsvps
  FOR SELECT
  USING (true);

-- 5. Política: Permitir exclusão/atualização se necessário
CREATE POLICY "Permitir exclusao publica de RSVPs"
  ON public.rsvps
  FOR DELETE
  USING (true);

-- 6. Índices para consultas ultrarrápidas
CREATE INDEX IF NOT EXISTS idx_rsvps_email ON public.rsvps(email);
CREATE INDEX IF NOT EXISTS idx_rsvps_status ON public.rsvps(attendance_status);
CREATE INDEX IF NOT EXISTS idx_rsvps_dish ON public.rsvps(main_dish);
`;
