export type PropertyType = 'hotel' | 'pousada' | 'apartamento' | 'quarto' | 'casa';

export interface User {
  id: number;
  email: string;
  name: string;
  avatar_url?: string;
  is_host: boolean;
  created_at: string;
}

export interface Listing {
  id: number;
  host_id: number;
  host_name: string;
  title: string;
  description: string;
  property_type: PropertyType;
  city: string;
  neighborhood?: string;
  address?: string;
  price_per_night: number;
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  image_url: string;
  featured: boolean;
  active: boolean;
  created_at: string;
}

export interface Booking {
  id: number;
  listing_id: number;
  listing_title: string;
  check_in: string;
  check_out: string;
  guests: number;
  total_price: number;
  status: string;
}

export const PROPERTY_LABELS: Record<PropertyType, string> = {
  hotel: 'Hotel',
  pousada: 'Pousada',
  apartamento: 'Apartamento',
  quarto: 'Quarto',
  casa: 'Casa',
};
