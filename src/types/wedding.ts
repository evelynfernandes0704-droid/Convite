export interface Dish {
  id: string;
  name: string;
  category: 'carne' | 'peixe' | 'vegetariano' | 'ave' | 'vegano';
  shortDesc: string;
  detailedDesc: string;
  ingredients: string[];
  pairing: string;
  badge?: string;
  dietaryTags: string[];
  chefNote?: string;
  iconName: string;
}

export interface Companion {
  name: string;
  dishId: string;
  dietaryNotes?: string;
}

export interface RSVPFormData {
  guestName: string;
  email: string;
  phone: string;
  attendanceStatus: 'confirmed' | 'declined';
  mainDishId: string;
  dietaryRestrictions: string;
  dietaryTags: string[];
  hasCompanions: boolean;
  companionsCount: number;
  companions: Companion[];
  message: string;
}

export interface RSVPRecord extends RSVPFormData {
  id: string;
  createdAt: string;
  syncedWithSupabase?: boolean;
}

export interface SupabaseConfigStatus {
  isConfigured: boolean;
  url?: string;
  hasAnonKey?: boolean;
  source: 'env' | 'custom' | 'local_fallback';
  message: string;
}
