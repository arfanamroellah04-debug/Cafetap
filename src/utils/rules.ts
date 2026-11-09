import { CafeBranding, CartItem, OrderDetails, CartCalculation, MenuItem } from '../types/cafe';

/**
 * Format a numeric amount to Indonesian Rupiah representation (e.g. Rp 48.000)
 */
export function formatRupiah(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return 'Rp 0';
  }
  const rounded = Math.round(amount);
  const formatted = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `Rp ${formatted}`;
}

/**
 * Standardize phone number for WhatsApp API (e.g. 08123456789 -> 628123456789)
 */
export function cleanPhoneNumber(phone: string): string {
  if (!phone) return '';
  // Remove spaces, hyphens, plus signs, brackets, dots
  let cleaned = phone.replace(/[\s\-\+\(\)\.]/g, '');
  
  // If starts with '08', replace '0' with '62'
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  }
  
  // If starts with '8', prepend '62'
  if (cleaned.startsWith('8')) {
    cleaned = '62' + cleaned;
  }
  
  return cleaned;
}

/**
 * Calculate totals for cart items including tax & optional service charge
 */
export function calculateCartTotals(
  items: CartItem[],
  taxPercent: number = 0,
  servicePercent: number = 0
): CartCalculation {
  let subtotal = 0;
  let totalItems = 0;

  for (const item of items) {
    const optionsTotal = item.selectedOptions?.reduce((sum, opt) => sum + opt.extraPrice, 0) || 0;
    const itemUnitPrice = item.menuItem.harga + optionsTotal;
    subtotal += itemUnitPrice * item.quantity;
    totalItems += item.quantity;
  }

  const tax = Math.round((subtotal * (taxPercent || 0)) / 100);
  const service = Math.round((subtotal * (servicePercent || 0)) / 100);
  const total = subtotal + tax + service;

  return {
    subtotal,
    tax,
    service,
    total,
    totalItems,
  };
}

/**
 * Build professional order message string for WhatsApp
 */
export function buildWhatsAppMessage(params: {
  branding: CafeBranding;
  cart: CartItem[];
  order: OrderDetails;
  totals: CartCalculation;
}): string {
  const { branding, cart, order, totals } = params;
  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const orderTypeLabel = order.orderType === 'dine-in' ? '🍽️ DINE IN' : '🛍️ TAKE AWAY';
  const tableInfo = order.tableNumber ? `📍 *Meja:* No. ${order.tableNumber}` : '📍 *Meja:* -';
  const customerName = order.customerName ? `👤 *Nama Pemesan:* ${order.customerName}` : '👤 *Nama Pemesan:* Tamu Meja';

  let itemsText = '';
  cart.forEach((item, index) => {
    const optionsExtra = item.selectedOptions?.reduce((sum, opt) => sum + opt.extraPrice, 0) || 0;
    const unitPrice = item.menuItem.harga + optionsExtra;
    const lineTotal = unitPrice * item.quantity;
    
    itemsText += `${index + 1}. *${item.menuItem.nama_menu}* (${item.quantity}x)\n`;
    itemsText += `   Harga: ${formatRupiah(unitPrice)} × ${item.quantity} = ${formatRupiah(lineTotal)}\n`;
    
    if (item.selectedOptions && item.selectedOptions.length > 0) {
      const opts = item.selectedOptions.map(o => o.name).join(', ');
      itemsText += `   Opsi: ${opts}\n`;
    }
    
    if (item.notes && item.notes.trim() !== '') {
      itemsText += `   Catatan: _"${item.notes.trim()}"_\n`;
    }
    itemsText += '\n';
  });

  let totalsBreakdown = `*Subtotal:* ${formatRupiah(totals.subtotal)}\n`;
  if (totals.service > 0) {
    totalsBreakdown += `*Service (${branding.layanan_persen || 0}%):* ${formatRupiah(totals.service)}\n`;
  }
  if (totals.tax > 0) {
    totalsBreakdown += `*Pajak/PB1 (${branding.pajak_persen || 0}%):* ${formatRupiah(totals.tax)}\n`;
  }
  totalsBreakdown += `*TOTAL PEMBAYARAN:* ${formatRupiah(totals.total)}`;

  const generalNotesSection = order.generalNotes && order.generalNotes.trim() !== ''
    ? `\n📝 *Catatan Tambahan:*\n_${order.generalNotes.trim()}_\n`
    : '';

  const message = 
`Halo *${branding.nama_kafe}*, saya ingin memesan menu via *Cafetap*:

${orderTypeLabel}
${tableInfo}
${customerName}
🕒 *Waktu Pesanan:* ${dateStr}, ${timeStr} WIB

━━━━━━━━━━━━━━━━━━━━
📋 *RINCIAN PESANAN (${totals.totalItems} item)*
━━━━━━━━━━━━━━━━━━━━
${itemsText.trim()}

━━━━━━━━━━━━━━━━━━━━
💳 *RINGKASAN BIAYA*
━━━━━━━━━━━━━━━━━━━━
${totalsBreakdown}
${generalNotesSection}
Mohon konfirmasi ketersediaan dan proses pesanan kami. Terima kasih! 🙏✨`;

  return message;
}

/**
 * Generate the WhatsApp URL with encodeURIComponent
 */
export function buildWhatsAppOrderUrl(params: {
  branding: CafeBranding;
  cart: CartItem[];
  order: OrderDetails;
}): string {
  const totals = calculateCartTotals(
    params.cart,
    params.branding.pajak_persen || 0,
    params.branding.layanan_persen || 0
  );
  const rawMessage = buildWhatsAppMessage({ ...params, totals });
  const encodedText = encodeURIComponent(rawMessage);
  const targetPhone = cleanPhoneNumber(params.branding.nomor_whatsapp);
  return `https://wa.me/${targetPhone}?text=${encodedText}`;
}

/**
 * Convert Hex Color to RGB object
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  if (!hex) return null;
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  if (clean.length !== 6) return null;

  const num = parseInt(clean, 16);
  if (isNaN(num)) return null;

  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/**
 * Determine contrast text color ('#ffffff' or '#111827') based on background luminance
 */
export function getContrastTextColor(hexColor: string): string {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return '#ffffff';
  // Luminance calculation
  const luma = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
  return luma > 165 ? '#111827' : '#ffffff';
}

/**
 * Injects dynamic primary color into document root CSS variables
 */
export function applyDynamicBranding(hexColor: string): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const validHex = /^#[0-9A-Fa-f]{6}$/.test(hexColor) ? hexColor : '#8B5A2B';
  const rgb = hexToRgb(validHex) || { r: 139, g: 90, b: 43 };
  
  root.style.setProperty('--primary-color', validHex);
  root.style.setProperty('--primary-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
  root.style.setProperty('--primary-contrast', getContrastTextColor(validHex));
}

/**
 * Simple CSV line parser that handles quoted commas
 */
export function parseCSVRows(csvText: string): string[][] {
  const lines = csvText.trim().split(/\r\n|\n|\r/);
  const result: string[][] = [];

  for (const line of lines) {
    if (!line.trim()) continue;
    const row: string[] = [];
    let insideQuotes = false;
    let entry = '';

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (insideQuotes && line[i + 1] === '"') {
          entry += '"';
          i++; // skip escaped quote
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === ',' && !insideQuotes) {
        row.push(entry.trim());
        entry = '';
      } else {
        entry += char;
      }
    }
    row.push(entry.trim());
    result.push(row);
  }

  return result;
}

/**
 * Export MenuItem array into Google Sheets-compatible CSV format
 */
export function exportMenuToCSV(menu: MenuItem[]): string {
  const headers = ['kategori', 'nama_menu', 'harga', 'url_gambar', 'status_tersedia', 'deskripsi', 'is_best_seller', 'is_chef_pick', 'dietary'];
  const lines = [headers.join(',')];

  for (const item of menu) {
    const safeKategori = `"${(item.kategori || '').replace(/"/g, '""')}"`;
    const safeNama = `"${(item.nama_menu || '').replace(/"/g, '""')}"`;
    const harga = item.harga || 0;
    const urlGambar = `"${(item.url_gambar || '').replace(/"/g, '""')}"`;
    const status = item.status_tersedia ? 'true' : 'false';
    const deskripsi = `"${(item.deskripsi || '').replace(/"/g, '""')}"`;
    const bestSeller = item.is_best_seller ? 'true' : 'false';
    const chefPick = item.is_chef_pick ? 'true' : 'false';
    const dietary = `"${(item.dietary || []).join(';')}"`;

    lines.push([safeKategori, safeNama, harga, urlGambar, status, deskripsi, bestSeller, chefPick, dietary].join(','));
  }

  return lines.join('\n');
}

/**
 * Build NFC Table URL for a given table number
 */
export function generateTableUrl(baseUrl: string, tableNumber: string): string {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const cleanTable = encodeURIComponent(tableNumber.trim());
  return `${cleanBase}/?meja=${cleanTable}`;
}

/**
 * Default administrative password for Cafetap CMS
 */
export const DEFAULT_ADMIN_PASSWORD = 'admincafetap';

/**
 * Verify CMS login password
 */
export function verifyAdminPassword(input: string, storedPassword?: string | null): boolean {
  if (!input) return false;
  const targetPassword = storedPassword && storedPassword.trim() ? storedPassword : DEFAULT_ADMIN_PASSWORD;
  return input.trim() === targetPassword;
}

/**
 * Validate password change inputs
 */
export function validateNewPassword(
  currentPass: string,
  newPass: string,
  confirmPass: string,
  storedPass?: string | null
): { isValid: boolean; error?: string } {
  const effectiveStored = storedPass && storedPass.trim() ? storedPass : DEFAULT_ADMIN_PASSWORD;

  if (!verifyAdminPassword(currentPass, effectiveStored)) {
    return { isValid: false, error: 'Sandi saat ini tidak sesuai. Mohon periksa kembali.' };
  }

  if (!newPass || newPass.trim().length < 4) {
    return { isValid: false, error: 'Sandi baru minimal terdiri dari 4 karakter.' };
  }

  if (newPass.trim() !== confirmPass.trim()) {
    return { isValid: false, error: 'Konfirmasi sandi baru tidak cocok.' };
  }

  if (newPass.trim() === effectiveStored) {
    return { isValid: false, error: 'Sandi baru tidak boleh sama dengan sandi saat ini.' };
  }

  return { isValid: true };
}

