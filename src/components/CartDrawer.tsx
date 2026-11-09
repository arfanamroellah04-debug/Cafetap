import React, { useState } from 'react';
import { CafeBranding, CartItem, OrderDetails } from '../types/cafe';
import { formatRupiah, calculateCartTotals, buildWhatsAppOrderUrl } from '../utils/rules';
import { WhatsAppIcon } from './Icons';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  UtensilsCrossed,
  Package,
  AlertCircle,
  FileText,
} from 'lucide-react';

interface CartDrawerProps {
  branding: CafeBranding;
  cart: CartItem[];
  tableNumber: string;
  onTableChange: (table: string) => void;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onUpdateQuantity: (itemId: string, newQty: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
}

export function CartDrawer({
  branding,
  cart,
  tableNumber,
  onTableChange,
  isOpen,
  onOpen,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  const [customerName, setCustomerName] = useState('');
  const [orderType, setOrderType] = useState<'dine-in' | 'takeaway'>('dine-in');
  const [generalNotes, setGeneralNotes] = useState('');
  const [tableError, setTableError] = useState(false);

  const totals = calculateCartTotals(cart, branding.pajak_persen || 0, branding.layanan_persen || 0);

  const handleCheckout = () => {
    if (!tableNumber || tableNumber.trim() === '') {
      setTableError(true);
      return;
    }
    setTableError(false);

    const order: OrderDetails = {
      tableNumber: tableNumber.trim(),
      customerName: customerName.trim() || `Tamu Meja ${tableNumber.trim()}`,
      orderType,
      generalNotes,
    };

    const targetUrl = buildWhatsAppOrderUrl({
      branding,
      cart,
      order,
    });

    // Redirect to WhatsApp
    window.location.href = targetUrl;
  };

  // If cart is empty and closed, nothing shown
  if (cart.length === 0 && !isOpen) {
    return null;
  }

  return (
    <>
      {/* Floating Action Button (FAB) at Bottom */}
      {!isOpen && cart.length > 0 && (
        <aside
          aria-label="Keranjang pesanan melayang"
          className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:right-6 sm:w-96 z-40 transition-all animate-in slide-in-from-bottom duration-300"
        >
          <button
            onClick={onOpen}
            aria-label={`Buka keranjang belanja, ${totals.totalItems} item total ${formatRupiah(totals.total)}`}
            className="w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl text-white shadow-xl hover:shadow-2xl transition transform active:scale-98"
            style={{
              backgroundColor: 'var(--primary-color)',
              color: 'var(--primary-contrast)',
            }}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-bold text-sm">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <span className="absolute -top-1.5 -right-1.5 bg-stone-900 text-white text-[11px] font-extrabold px-1.5 py-0.5 rounded-full border border-white">
                  {totals.totalItems}
                </span>
              </div>
              <div className="text-left">
                <span className="text-xs uppercase font-medium tracking-wide opacity-80 block">
                  Pesanan Anda
                </span>
                <span className="text-sm font-bold block">
                  {formatRupiah(totals.total)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm bg-white/15 px-3 py-1.5 rounded-xl">
              <span>Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </aside>
      )}

      {/* Full Bottom Sheet / Drawer */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Keranjang Belanja dan Checkout"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        >
          <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[94vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                  style={{ backgroundColor: 'var(--primary-color)' }}
                >
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-stone-900">
                    Keranjang Pesanan ({totals.totalItems})
                  </h2>
                  <p className="text-xs text-stone-500">{branding.nama_kafe}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {cart.length > 0 && (
                  <button
                    onClick={onClearCart}
                    className="text-xs text-stone-400 hover:text-red-600 transition font-medium px-2 py-1"
                    title="Kosongkan keranjang"
                  >
                    Kosongkan
                  </button>
                )}
                <button
                  onClick={onClose}
                  aria-label="Tutup keranjang"
                  className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="overflow-y-auto flex-1 p-4 sm:p-5 space-y-5">
              {cart.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                    <ShoppingBag className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-bold text-stone-800">
                    Keranjang masih kosong
                  </h3>
                  <p className="text-xs text-stone-500 max-w-xs mx-auto">
                    Silakan pilih menu kopi atau hidangan lezat kami untuk mulai memesan.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-2 px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-xs"
                    style={{ backgroundColor: 'var(--primary-color)' }}
                  >
                    Jelajahi Menu
                  </button>
                </div>
              ) : (
                <>
                  {/* Table & Customer Section */}
                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
                    {/* Order Type Toggle */}
                    <div className="grid grid-cols-2 gap-1.5 p-1 bg-stone-200/60 rounded-xl text-xs font-semibold">
                      <button
                        type="button"
                        onClick={() => setOrderType('dine-in')}
                        className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition ${
                          orderType === 'dine-in'
                            ? 'bg-white text-stone-900 shadow-xs'
                            : 'text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        <UtensilsCrossed className="w-3.5 h-3.5" />
                        <span>Makan di Sini (Dine In)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setOrderType('takeaway')}
                        className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition ${
                          orderType === 'takeaway'
                            ? 'bg-white text-stone-900 shadow-xs'
                            : 'text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        <Package className="w-3.5 h-3.5" />
                        <span>Bawa Pulang (Takeaway)</span>
                      </button>
                    </div>

                    {/* Table Number input */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="table-number"
                          className="block text-xs font-bold text-stone-700"
                        >
                          Nomor Meja <span className="text-red-500">*</span>
                        </label>
                        <span className="text-[11px] text-stone-400">
                          (Sesuai stiker NFC meja)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          id="table-number"
                          type="text"
                          value={tableNumber}
                          onChange={(e) => {
                            onTableChange(e.target.value);
                            if (e.target.value.trim()) setTableError(false);
                          }}
                          placeholder="Contoh: 04"
                          className={`flex-1 px-3 py-2 text-sm rounded-xl border bg-white focus:outline-hidden transition ${
                            tableError
                              ? 'border-red-500 ring-2 ring-red-100'
                              : 'border-stone-200 focus:border-stone-400'
                          }`}
                        />
                        {/* Quick preset chips */}
                        {['01', '04', '08', '12'].map((tbl) => (
                          <button
                            key={tbl}
                            type="button"
                            onClick={() => {
                              onTableChange(tbl);
                              setTableError(false);
                            }}
                            className="px-2.5 py-2 text-xs font-semibold rounded-xl bg-white border border-stone-200 hover:bg-stone-100 text-stone-700"
                          >
                            {tbl}
                          </button>
                        ))}
                      </div>
                      {tableError && (
                        <p className="flex items-center gap-1 text-[11px] text-red-600 font-medium mt-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Mohon masukkan nomor meja Anda sebelum memesan.
                        </p>
                      )}
                    </div>

                    {/* Customer Name input */}
                    <div className="space-y-1">
                      <label
                        htmlFor="customer-name"
                        className="block text-xs font-bold text-stone-700"
                      >
                        Nama Pemesan (Opsional)
                      </label>
                      <input
                        id="customer-name"
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Contoh: Sarah / Dimas"
                        className="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 bg-white focus:border-stone-400 focus:outline-hidden transition text-stone-800 placeholder-stone-400"
                      />
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                      Daftar Pesanan
                    </h3>
                    <div className="divide-y divide-stone-100 border-y border-stone-100">
                      {cart.map((item) => {
                        const lineTotal = item.menuItem.harga * item.quantity;
                        return (
                          <div key={item.menuItem.id} className="py-3 flex items-start gap-3">
                            <img
                              src={item.menuItem.url_gambar}
                              alt={item.menuItem.nama_menu}
                              className="w-14 h-14 rounded-xl object-cover shrink-0 bg-stone-100"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-1">
                                <h4 className="text-sm font-bold text-stone-900 truncate">
                                  {item.menuItem.nama_menu}
                                </h4>
                                <button
                                  onClick={() => onRemoveItem(item.menuItem.id)}
                                  aria-label={`Hapus ${item.menuItem.nama_menu}`}
                                  className="text-stone-300 hover:text-red-500 p-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <p className="text-xs text-stone-500 font-semibold mt-0.5">
                                {formatRupiah(item.menuItem.harga)} × {item.quantity} ={' '}
                                <span className="text-stone-900 font-bold">
                                  {formatRupiah(lineTotal)}
                                </span>
                              </p>

                              {item.notes && (
                                <p className="text-[11px] text-amber-800 bg-amber-50 rounded-md px-2 py-0.5 mt-1 inline-block">
                                  📝 {item.notes}
                                </p>
                              )}

                              {/* Quantity adjuster */}
                              <div className="flex items-center gap-2 mt-2">
                                <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50 p-0.5">
                                  <button
                                    onClick={() =>
                                      onUpdateQuantity(item.menuItem.id, item.quantity - 1)
                                    }
                                    aria-label="Kurang satu"
                                    className="p-1 rounded text-stone-600 hover:bg-stone-200 transition"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="w-6 text-center text-xs font-bold text-stone-900">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() =>
                                      onUpdateQuantity(item.menuItem.id, item.quantity + 1)
                                    }
                                    aria-label="Tambah satu"
                                    className="p-1 rounded text-stone-600 hover:bg-stone-200 transition"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* General order notes */}
                  <div className="space-y-1">
                    <label
                      htmlFor="general-notes"
                      className="flex items-center gap-1.5 text-xs font-bold text-stone-700"
                    >
                      <FileText className="w-3.5 h-3.5 text-stone-400" />
                      Catatan Tambahan untuk Kasir / Dapur
                    </label>
                    <textarea
                      id="general-notes"
                      value={generalNotes}
                      onChange={(e) => setGeneralNotes(e.target.value)}
                      placeholder="Contoh: Tolong sajikan minuman dingin dulu..."
                      rows={2}
                      className="w-full p-2.5 text-xs rounded-xl border border-stone-200 bg-white focus:border-stone-400 focus:outline-hidden text-stone-800 placeholder-stone-400 resize-none"
                    />
                  </div>

                  {/* Cost Breakdown */}
                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2 text-xs">
                    <div className="flex justify-between text-stone-600">
                      <span>Subtotal ({totals.totalItems} item)</span>
                      <span>{formatRupiah(totals.subtotal)}</span>
                    </div>

                    {totals.service > 0 && (
                      <div className="flex justify-between text-stone-600">
                        <span>Layanan ({branding.layanan_persen}%)</span>
                        <span>{formatRupiah(totals.service)}</span>
                      </div>
                    )}

                    {totals.tax > 0 && (
                      <div className="flex justify-between text-stone-600">
                        <span>Pajak Restoran / PB1 ({branding.pajak_persen}%)</span>
                        <span>{formatRupiah(totals.tax)}</span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-stone-200 flex justify-between font-extrabold text-sm text-stone-900">
                      <span>Total Pembayaran</span>
                      <span className="text-base">{formatRupiah(totals.total)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer Checkout Action */}
            {cart.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-stone-200 bg-white">
                <button
                  onClick={handleCheckout}
                  className="w-full py-3.5 px-5 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition transform active:scale-98 bg-[#25D366] hover:bg-[#20ba59]"
                >
                  <WhatsAppIcon className="w-5 h-5 fill-white" />
                  <span>Kirim Pesanan ke WhatsApp ({formatRupiah(totals.total)})</span>
                </button>
                <p className="text-[11px] text-center text-stone-400 mt-2">
                  Pesanan akan langsung diteruskan ke nomor resmi {branding.nama_kafe} via WhatsApp.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
