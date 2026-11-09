import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatRupiah,
  cleanPhoneNumber,
  calculateCartTotals,
  buildWhatsAppMessage,
  buildWhatsAppOrderUrl,
  hexToRgb,
  getContrastTextColor,
  parseCSVRows,
  exportMenuToCSV,
  generateTableUrl,
  DEFAULT_ADMIN_PASSWORD,
  verifyAdminPassword,
  validateNewPassword,
} from './rules';
import { CafeBranding, CartItem, OrderDetails, MenuItem } from '../types/cafe';

const mockBranding: CafeBranding = {
  nama_kafe: "L'Amour Artisan Cafe",
  tagline: 'Artisanal Coffee & Contemporary Patisserie',
  url_logo: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200',
  hex_warna_utama: '#8B5A2B',
  nomor_whatsapp: '0812-3456-7890',
  url_instagram: 'https://instagram.com/lamourcafe',
  url_tiktok: 'https://tiktok.com/@lamourcafe',
  url_review_gmaps: 'https://maps.app.goo.gl/exampleReview',
  pajak_persen: 10,
  layanan_persen: 5,
};

const mockItem1: MenuItem = {
  id: 'item-1',
  kategori: 'Signature Coffee',
  nama_menu: 'Spanish Latte Brulee',
  harga: 42000,
  url_gambar: 'https://example.com/latte.jpg',
  status_tersedia: true,
};

const mockItem2: MenuItem = {
  id: 'item-2',
  kategori: 'Artisan Pastry',
  nama_menu: 'Almond Croissant',
  harga: 38000,
  url_gambar: 'https://example.com/croissant.jpg',
  status_tersedia: true,
};

test('formatRupiah properly formats amounts to IDR style', () => {
  assert.equal(formatRupiah(0), 'Rp 0');
  assert.equal(formatRupiah(42000), 'Rp 42.000');
  assert.equal(formatRupiah(1500000), 'Rp 1.500.000');
  assert.equal(formatRupiah(NaN), 'Rp 0');
});

test('cleanPhoneNumber normalizes various Indonesian phone formats', () => {
  assert.equal(cleanPhoneNumber('0812-3456-7890'), '6281234567890');
  assert.equal(cleanPhoneNumber('+62 812 3456 7890'), '6281234567890');
  assert.equal(cleanPhoneNumber('6281234567890'), '6281234567890');
  assert.equal(cleanPhoneNumber('085712341234'), '6285712341234');
  assert.equal(cleanPhoneNumber('812334455'), '62812334455');
  assert.equal(cleanPhoneNumber(''), '');
});

test('calculateCartTotals calculates subtotal, taxes, and service correctly', () => {
  const cart: CartItem[] = [
    {
      menuItem: mockItem1,
      quantity: 2, // 42000 * 2 = 84000
    },
    {
      menuItem: mockItem2,
      quantity: 1, // 38000
      selectedOptions: [{ name: 'Warm toasted', extraPrice: 2000 }], // 40000
      notes: 'Please cut in half',
    },
  ];

  // Subtotal = 84000 + 40000 = 124000
  // Tax (10%) = 12400
  // Service (5%) = 6200
  // Total = 124000 + 12400 + 6200 = 142600
  // TotalItems = 3
  const totals = calculateCartTotals(cart, 10, 5);
  assert.equal(totals.subtotal, 124000);
  assert.equal(totals.tax, 12400);
  assert.equal(totals.service, 6200);
  assert.equal(totals.total, 142600);
  assert.equal(totals.totalItems, 3);
});

test('calculateCartTotals handles empty cart gracefully', () => {
  const totals = calculateCartTotals([], 10, 5);
  assert.equal(totals.subtotal, 0);
  assert.equal(totals.tax, 0);
  assert.equal(totals.service, 0);
  assert.equal(totals.total, 0);
  assert.equal(totals.totalItems, 0);
});

test('buildWhatsAppOrderUrl creates a valid wa.me link with encoded text', () => {
  const cart: CartItem[] = [
    {
      menuItem: mockItem1,
      quantity: 1,
      notes: 'Less sugar, oat milk',
    },
  ];

  const order: OrderDetails = {
    tableNumber: '14',
    customerName: 'Dimas Wicaksono',
    orderType: 'dine-in',
    generalNotes: 'Near the window please',
  };

  const url = buildWhatsAppOrderUrl({
    branding: mockBranding,
    cart,
    order,
  });

  assert.ok(url.startsWith('https://wa.me/6281234567890?text='));
  
  const encodedText = url.replace('https://wa.me/6281234567890?text=', '');
  const decodedText = decodeURIComponent(encodedText);
  
  assert.ok(decodedText.includes("L'Amour Artisan Cafe"));
  assert.ok(decodedText.includes('Meja:* No. 14'));
  assert.ok(decodedText.includes('Dimas Wicaksono'));
  assert.ok(decodedText.includes('Spanish Latte Brulee'));
  assert.ok(decodedText.includes('Less sugar, oat milk'));
  assert.ok(decodedText.includes('Near the window please'));
  assert.ok(decodedText.includes('DINE IN'));
});

test('hexToRgb and getContrastTextColor determine colors correctly', () => {
  const white = hexToRgb('#ffffff');
  assert.deepEqual(white, { r: 255, g: 255, b: 255 });
  assert.equal(getContrastTextColor('#ffffff'), '#111827');

  const black = hexToRgb('#000000');
  assert.deepEqual(black, { r: 0, g: 0, b: 0 });
  assert.equal(getContrastTextColor('#000000'), '#ffffff');

  const gold = hexToRgb('#8B5A2B');
  assert.deepEqual(gold, { r: 139, g: 90, b: 43 });
});

test('parseCSVRows handles quotes and commas correctly', () => {
  const sample = `Category,Name,Price\n"Coffee, Hot","Latte, Vanilla",35000\nTea,Earl Grey,28000`;
  const rows = parseCSVRows(sample);
  assert.equal(rows.length, 3);
  assert.equal(rows[1][0], 'Coffee, Hot');
  assert.equal(rows[1][1], 'Latte, Vanilla');
  assert.equal(rows[1][2], '35000');
});

test('exportMenuToCSV converts menu array into valid CSV', () => {
  const csv = exportMenuToCSV([mockItem1, mockItem2]);
  assert.ok(csv.includes('kategori,nama_menu,harga'));
  assert.ok(csv.includes('"Signature Coffee","Spanish Latte Brulee",42000'));
  assert.ok(csv.includes('"Artisan Pastry","Almond Croissant",38000'));
});

test('generateTableUrl builds correct URL with query parameter', () => {
  const url = generateTableUrl('https://cafetap.app', '08');
  assert.equal(url, 'https://cafetap.app/?meja=08');

  const urlWithSlash = generateTableUrl('https://cafetap.app/', 'VIP 1');
  assert.equal(urlWithSlash, 'https://cafetap.app/?meja=VIP%201');
});

test('verifyAdminPassword validates default and custom passwords', () => {
  assert.equal(verifyAdminPassword('admincafetap'), true);
  assert.equal(verifyAdminPassword('wrongpassword'), false);
  assert.equal(verifyAdminPassword(''), false);

  // Custom password
  assert.equal(verifyAdminPassword('rahasia123', 'rahasia123'), true);
  assert.equal(verifyAdminPassword('admincafetap', 'rahasia123'), false);
});

test('validateNewPassword validates password change requirements', () => {
  // Correct change
  const valid = validateNewPassword('admincafetap', 'barubaru', 'barubaru');
  assert.equal(valid.isValid, true);

  // Incorrect current password
  const wrongCurrent = validateNewPassword('salah', 'barubaru', 'barubaru');
  assert.equal(wrongCurrent.isValid, false);
  assert.ok(wrongCurrent.error?.includes('tidak sesuai'));

  // Too short
  const tooShort = validateNewPassword('admincafetap', '12', '12');
  assert.equal(tooShort.isValid, false);
  assert.ok(tooShort.error?.includes('minimal'));

  // Mismatch confirmation
  const mismatch = validateNewPassword('admincafetap', 'baru1234', 'beda1234');
  assert.equal(mismatch.isValid, false);
  assert.ok(mismatch.error?.includes('tidak cocok'));

  // Same as old password
  const same = validateNewPassword('admincafetap', 'admincafetap', 'admincafetap');
  assert.equal(same.isValid, false);
  assert.ok(same.error?.includes('tidak boleh sama'));
});


