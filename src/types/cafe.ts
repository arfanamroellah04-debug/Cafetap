export interface CafeBranding {
  nama_kafe: string;
  tagline?: string;
  deskripsi?: string;
  url_logo: string;
  url_cover?: string;
  hex_warna_utama: string;
  nomor_whatsapp: string;
  url_instagram: string;
  url_tiktok: string;
  url_review_gmaps: string;
  alamat?: string;
  jam_operasional?: string;
  pajak_persen?: number;
  layanan_persen?: number;
}

export interface MenuItem {
  id: string;
  kategori: string;
  nama_menu: string;
  deskripsi?: string;
  harga: number;
  url_gambar: string;
  status_tersedia: boolean;
  is_best_seller?: boolean;
  is_chef_pick?: boolean;
  is_new?: boolean;
  dietary?: ('halal' | 'vegan' | 'vegetarian' | 'gluten_free')[];
  kalori?: number;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
  selectedOptions?: { name: string; extraPrice: number }[];
}

export interface OrderDetails {
  tableNumber: string;
  customerName: string;
  customerPhone?: string;
  orderType: 'dine-in' | 'takeaway';
  generalNotes?: string;
}

export interface CartCalculation {
  subtotal: number;
  tax: number;
  service: number;
  total: number;
  totalItems: number;
}
