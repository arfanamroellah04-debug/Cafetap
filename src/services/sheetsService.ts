import { CafeBranding, MenuItem } from '../types/cafe';
import { parseCSVRows } from '../utils/rules';

export interface CafeDataset {
  id: string;
  name: string;
  branding: CafeBranding;
  menu: MenuItem[];
}

export const PRESET_CAFES: Record<string, CafeDataset> = {
  lamour: {
    id: 'lamour',
    name: "L'Amour Artisan Roastery",
    branding: {
      nama_kafe: "L'Amour Artisan Roastery",
      tagline: 'Specialty Coffee, Viennoiserie & Modern Brunch',
      deskripsi: 'Roastery modern dan patisserie kontemporer dengan biji kopi arabika pilihan single-origin dan hidangan artisan lezat.',
      url_logo: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=240&q=80',
      url_cover: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
      hex_warna_utama: '#8B5A2B', // Rich Warm Bronze
      nomor_whatsapp: '6281234567890',
      url_instagram: 'https://instagram.com/lamour.roastery',
      url_tiktok: 'https://tiktok.com/@lamour.roastery',
      url_review_gmaps: 'https://maps.google.com/?cid=1234567890',
      alamat: 'Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan',
      jam_operasional: 'Senin - Minggu: 07:30 - 22:00',
      pajak_persen: 10,
      layanan_persen: 5,
    },
    menu: [
      {
        id: 'lamour-1',
        kategori: 'Signature Coffee',
        nama_menu: 'Spanish Brûlée Latte',
        deskripsi: 'Double ristretto dengan sweet condensed milk, microfoam creamy, dan taburan gula tebu caramelized torch.',
        harga: 46000,
        url_gambar: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80',
        status_tersedia: true,
        is_best_seller: true,
        is_chef_pick: true,
        dietary: ['halal'],
        kalori: 240,
      },
      {
        id: 'lamour-2',
        kategori: 'Signature Coffee',
        nama_menu: 'Pistachio Cloud Cold Brew',
        deskripsi: 'Slow-steeped 18-hour cold brew Arabica Flores dengan topping velvet cold foam pistachio asli.',
        harga: 49000,
        url_gambar: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80',
        status_tersedia: true,
        is_best_seller: true,
        dietary: ['halal', 'vegetarian'],
        kalori: 190,
      },
      {
        id: 'lamour-3',
        kategori: 'Signature Coffee',
        nama_menu: 'Smoked Vanilla Flat White',
        deskripsi: 'Espresso blend Ethiopia & Gayo dengan infus madagascar vanilla pod dan silky steamed oat milk.',
        harga: 44000,
        url_gambar: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=600&q=80',
        status_tersedia: true,
        dietary: ['halal', 'vegan'],
        kalori: 160,
      },
      {
        id: 'lamour-4',
        kategori: 'Signature Coffee',
        nama_menu: 'Cascara Citrus Tonic',
        deskripsi: 'Seduhan kulit buah kopi cascara organik berpadu yuzu jepang segar, bunga telang, dan premium sparkling tonic.',
        harga: 42000,
        url_gambar: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
        status_tersedia: true,
        is_new: true,
        dietary: ['halal', 'vegan'],
        kalori: 110,
      },
      {
        id: 'lamour-5',
        kategori: 'Artisan Pastry',
        nama_menu: 'Truffle & Gruyère Croissant',
        deskripsi: 'Viennoiserie 72 lapis dengan french butter AOP, isian keju Gruyère leleh dan black truffle oil aroma.',
        harga: 48000,
        url_gambar: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
        status_tersedia: true,
        is_best_seller: true,
        is_chef_pick: true,
        dietary: ['halal', 'vegetarian'],
        kalori: 360,
      },
      {
        id: 'lamour-6',
        kategori: 'Artisan Pastry',
        nama_menu: 'Almond Frangipane Pain Au Chocolat',
        deskripsi: 'Pastry mentega renyah dengan isian cokelat Valrhona ganda, krim almond frangipane dan toasted sliced almonds.',
        harga: 45000,
        url_gambar: 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?auto=format&fit=crop&w=600&q=80',
        status_tersedia: true,
        dietary: ['halal', 'vegetarian'],
        kalori: 410,
      },
      {
        id: 'lamour-7',
        kategori: 'Artisan Pastry',
        nama_menu: 'Matcha Uji Kouign-Amann',
        deskripsi: 'Pastry tradisional Brittany berkulit karamel renyah dengan taburan matcha murni ceremonial grade dari Uji, Kyoto.',
        harga: 39000,
        url_gambar: 'https://images.unsplash.com/photo-1621236378699-8597fee6a162?auto=format&fit=crop&w=600&q=80',
        status_tersedia: false, // Intentionally sold out to demonstrate status_tersedia handling!
        dietary: ['halal', 'vegetarian'],
        kalori: 330,
      },
      {
        id: 'lamour-8',
        kategori: 'Main Course',
        nama_menu: 'Wagyu Beef Truffle Burger',
        deskripsi: 'Patty Wagyu MB7 juicy 150g, brioche bun bakar, caramelized onion jam, cheddar leleh, dan truffle aioli kentang renyah.',
        harga: 98000,
        url_gambar: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
        status_tersedia: true,
        is_best_seller: true,
        dietary: ['halal'],
        kalori: 680,
      },
      {
        id: 'lamour-9',
        kategori: 'Main Course',
        nama_menu: 'Smoked Salmon Benedict Sourdough',
        deskripsi: 'Artisan sourdough panggang, poached eggs omega-3, norwegian smoked salmon, avocado salsa, dan saus hollandaise kunyit.',
        harga: 85000,
        url_gambar: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=600&q=80',
        status_tersedia: true,
        is_chef_pick: true,
        dietary: ['halal'],
        kalori: 520,
      },
      {
        id: 'lamour-10',
        kategori: 'Main Course',
        nama_menu: 'Creamy Porcini & Truffle Tagliatelle',
        deskripsi: 'Pasta tagliatelle segar hand-crafted berbalut saus jamur porcini liar, parmesan reggiano 24 bulan dan parutan truffle.',
        harga: 89000,
        url_gambar: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281788?auto=format&fit=crop&w=600&q=80',
        status_tersedia: true,
        dietary: ['halal', 'vegetarian'],
        kalori: 540,
      },
      {
        id: 'lamour-11',
        kategori: 'Mocktails & Tea',
        nama_menu: 'Kyoto Yuzu Lavender Fizz',
        deskripsi: 'Perasan yuzu jepang segar, sirup bunga lavender organik, butterfly pea flower tea, dan rosemary panggang harum.',
        harga: 45000,
        url_gambar: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
        status_tersedia: true,
        is_best_seller: true,
        dietary: ['halal', 'vegan'],
        kalori: 95,
      },
      {
        id: 'lamour-12',
        kategori: 'Mocktails & Tea',
        nama_menu: 'Royal Hibiscus Peach Cold Infusion',
        deskripsi: 'Infus bunga rosella merah menyegarkan dipadu irisan peach manis dan sparkling botanical water.',
        harga: 42000,
        url_gambar: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&w=600&q=80',
        status_tersedia: true,
        dietary: ['halal', 'vegan'],
        kalori: 80,
      },
      {
        id: 'lamour-13',
        kategori: 'Sweet Treats',
        nama_menu: 'Burnt Basque Pistachio Cheesecake',
        deskripsi: 'Kue keju khas San Sebastian dengan tekstur molten tengah lumer, pasta pistachio murni, dan saus raspberry asam segar.',
        harga: 52000,
        url_gambar: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80',
        status_tersedia: true,
        is_best_seller: true,
        dietary: ['halal', 'vegetarian'],
        kalori: 390,
      },
      {
        id: 'lamour-14',
        kategori: 'Sweet Treats',
        nama_menu: 'Artisan Espresso Tiramisu Coupe',
        deskripsi: 'Ladyfinger savoiardi rendaman single-origin espresso L’Amour, sabayon mascarpone italia, dan taburan dark cocoa Valrhona.',
        harga: 48000,
        url_gambar: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80',
        status_tersedia: true,
        dietary: ['halal', 'vegetarian'],
        kalori: 340,
      },
    ],
  },
  aura: {
    id: 'aura',
    name: 'Aura Botanical Eatery',
    branding: {
      nama_kafe: 'Aura Botanical Eatery',
      tagline: 'Farm-to-Table, Plant-Forward & Conscious Dining',
      deskripsi: 'Oase kuliner hijau di jantung kota dengan sajian sehat premium, minuman adaptogen, dan kopi single estate.',
      url_logo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=240&q=80',
      url_cover: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      hex_warna_utama: '#1E3A2F', // Forest Emerald Green
      nomor_whatsapp: '6281398765432',
      url_instagram: 'https://instagram.com/aurabotanical',
      url_tiktok: '', // Demonstrates auto-hide when empty!
      url_review_gmaps: 'https://maps.google.com/?cid=9876543210',
      alamat: 'Jl. Wijaya II No. 88, Kebayoran Baru, Jakarta Selatan',
      jam_operasional: 'Senin - Minggu: 08:00 - 21:00',
      pajak_persen: 10,
      layanan_persen: 5,
    },
    menu: [
      {
        id: 'aura-1',
        kategori: 'Signature Coffee',
        nama_menu: 'Golden Turmeric Coconut Latte',
        deskripsi: 'Kunyit organik dingin, sari jahe merah, black pepper oil, espresso dan santan kelapa creamy rendah kalori.',
        harga: 44000,
        url_gambar: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
        status_tersedia: true,
        is_best_seller: true,
        dietary: ['halal', 'vegan'],
      },
      {
        id: 'aura-2',
        kategori: 'Main Course',
        nama_menu: 'Wild Salmon Quinoa Bowl',
        deskripsi: 'Salmon panggang rempah, tricolor quinoa, edamame, alpukat hass, dan tahini ginger dressing.',
        harga: 92000,
        url_gambar: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
        status_tersedia: true,
        is_chef_pick: true,
        dietary: ['halal', 'gluten_free'],
      },
      {
        id: 'aura-3',
        kategori: 'Mocktails & Tea',
        nama_menu: 'Chlorophyll Mint Tonic',
        deskripsi: 'Extract daun mint segar, spirulina organik, perasan jeruk nipis, dan sparkling water beroksigen.',
        harga: 40000,
        url_gambar: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
        status_tersedia: true,
        dietary: ['halal', 'vegan'],
      },
    ],
  },
  velvet: {
    id: 'velvet',
    name: 'Velvet Midnight Lounge',
    branding: {
      nama_kafe: 'Velvet Midnight Lounge',
      tagline: 'Evening Bistro, Decadent Desserts & Pour-Overs',
      deskripsi: 'Atmosfer temaram mewah dengan pilihan dessert gourmet, specialty tea, dan sajian makan malam modern.',
      url_logo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=240&q=80',
      url_cover: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80',
      hex_warna_utama: '#9B2C2C', // Deep Crimson Burgundy
      nomor_whatsapp: '6287712349999',
      url_instagram: 'https://instagram.com/velvetmidnight',
      url_tiktok: 'https://tiktok.com/@velvetmidnight',
      url_review_gmaps: 'https://maps.google.com/?cid=555666777',
      alamat: 'Gunawarman St No. 29, Jakarta Selatan',
      jam_operasional: 'Selasa - Minggu: 16:00 - 01:00',
      pajak_persen: 10,
      layanan_persen: 7,
    },
    menu: [
      {
        id: 'velvet-1',
        kategori: 'Desserts',
        nama_menu: 'Ruby Berry Mille-Feuille',
        deskripsi: 'Lapis puff pastry renyah, krim diplomat vanila Madagaskar, dan gelée buah berry segar.',
        harga: 58000,
        url_gambar: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
        status_tersedia: true,
        is_best_seller: true,
        dietary: ['halal', 'vegetarian'],
      },
      {
        id: 'velvet-2',
        kategori: 'Signature Coffee',
        nama_menu: 'Smoked Oak Geisha Pour Over',
        deskripsi: 'Biji kopi langka Panama Geisha diseduh manual dengan aroma bunga melati, bergamot, dan aftertaste aprikot.',
        harga: 75000,
        url_gambar: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80',
        status_tersedia: true,
        is_chef_pick: true,
        dietary: ['halal', 'vegan'],
      },
    ],
  },
};

/**
 * Fetch and parse data from Google Sheets or fall back to preset
 */
export async function fetchCafeData(options: {
  sheetUrlOrId?: string;
  presetKey?: string;
}): Promise<{
  branding: CafeBranding;
  menu: MenuItem[];
  source: 'preset' | 'google-sheets';
  error?: string;
}> {
  const defaultPreset = PRESET_CAFES[options.presetKey || 'lamour'] || PRESET_CAFES.lamour;

  if (!options.sheetUrlOrId || options.sheetUrlOrId.trim() === '') {
    return {
      branding: defaultPreset.branding,
      menu: defaultPreset.menu,
      source: 'preset',
    };
  }

  try {
    let sheetId = options.sheetUrlOrId.trim();
    // Extract ID if full Google Sheets URL provided
    const match = sheetId.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
      sheetId = match[1];
    }

    // Attempt to fetch as CSV or gviz JSON
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(csvUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Gagal memuat Google Sheets (HTTP ${response.status})`);
    }

    const csvText = await response.text();
    const rows = parseCSVRows(csvText);

    if (rows.length < 2) {
      throw new Error('Data Google Sheets kosong atau format tidak sesuai');
    }

    // Check header row (case insensitive)
    const headers = rows[0].map(h => h.toLowerCase().trim());
    const colMap: Record<string, number> = {};
    headers.forEach((h, idx) => {
      colMap[h] = idx;
    });

    const parsedMenu: MenuItem[] = [];

    // Check if this sheet is menu items or contains branding
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length === 0 || !row[0]) continue;

      const nama = row[colMap['nama_menu'] ?? colMap['nama'] ?? 1] || `Menu #${i}`;
      const kategori = row[colMap['kategori'] ?? 0] || 'Menu Utama';
      const hargaRaw = row[colMap['harga'] ?? 2] || '0';
      const harga = parseInt(hargaRaw.replace(/[^0-9]/g, ''), 10) || 0;
      const urlGambar = row[colMap['url_gambar'] ?? colMap['gambar'] ?? 3] || 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80';
      const statusRaw = (row[colMap['status_tersedia'] ?? colMap['status'] ?? 4] || 'true').toLowerCase();
      const statusTersedia = statusRaw !== 'false' && statusRaw !== 'habis' && statusRaw !== '0';

      parsedMenu.push({
        id: `sheet-item-${i}`,
        kategori,
        nama_menu: nama,
        harga,
        url_gambar: urlGambar,
        status_tersedia: statusTersedia,
        deskripsi: row[colMap['deskripsi'] ?? 5] || undefined,
      });
    }

    if (parsedMenu.length === 0) {
      throw new Error('Tidak ada item menu yang valid di Google Sheets');
    }

    return {
      branding: defaultPreset.branding,
      menu: parsedMenu,
      source: 'google-sheets',
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error saat menghubungi Google Sheets';
    return {
      branding: defaultPreset.branding,
      menu: defaultPreset.menu,
      source: 'preset',
      error: message,
    };
  }
}
