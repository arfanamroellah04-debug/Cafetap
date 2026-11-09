import React, { useState } from 'react';
import { MenuItem } from '../types/cafe';
import { formatRupiah } from '../utils/rules';
import { X, Minus, Plus, ShoppingBag, Flame, Award, Sparkles } from 'lucide-react';

interface MenuItemModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity: number, notes: string) => void;
}

export function MenuItemModal({ item, isOpen, onClose, onAddToCart }: MenuItemModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  if (!isOpen || !item) return null;

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAdd = () => {
    onAddToCart(item, quantity, notes);
    setNotes('');
    setQuantity(1);
    onClose();
  };

  const totalPrice = item.harga * quantity;

  const quickNotes = [
    'Sedikit Gula (Less Sweet)',
    'Tanpa Es (No Ice)',
    'Pisah Sambal/Saus',
    'Hangatkan (Warm/Toasted)',
    'Susu Oat (Oat Milk)',
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Rincian ${item.nama_menu}`}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
    >
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col">
        {/* Header Close button */}
        <button
          onClick={onClose}
          aria-label="Tutup rincian menu"
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-stone-900/50 text-white hover:bg-stone-900/70 backdrop-blur-xs transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1">
          {/* Hero Image */}
          <div className="relative aspect-16/10 sm:aspect-16/9 w-full bg-stone-100">
            <img
              src={item.url_gambar}
              alt={item.nama_menu}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80';
              }}
            />
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
              {item.is_best_seller && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-xs">
                  <Flame className="w-3.5 h-3.5" />
                  Favorit
                </span>
              )}
              {item.is_chef_pick && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-stone-900 text-white shadow-xs">
                  <Award className="w-3.5 h-3.5 text-amber-300" />
                  Chef's Pick
                </span>
              )}
              {item.is_new && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  Baru
                </span>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="p-5 sm:p-6 space-y-4">
            <div>
              <span className="text-xs uppercase font-semibold tracking-wider text-stone-400">
                {item.kategori}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mt-0.5">
                {item.nama_menu}
              </h2>
              <p className="text-lg font-extrabold text-stone-900 mt-1">
                {formatRupiah(item.harga)}
              </p>
            </div>

            {item.deskripsi && (
              <p className="text-sm text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
                {item.deskripsi}
              </p>
            )}

            {/* Custom Notes */}
            <div className="space-y-2 border-t border-stone-100 pt-3">
              <label htmlFor="item-notes" className="block text-xs font-bold text-stone-700">
                Catatan Khusus untuk Barista / Chef
              </label>

              {/* Quick note suggestion chips */}
              <div className="flex flex-wrap gap-1.5">
                {quickNotes.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => {
                      setNotes((prev) => (prev ? `${prev}, ${chip}` : chip));
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 transition"
                  >
                    + {chip}
                  </button>
                ))}
              </div>

              <textarea
                id="item-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Manisnya 50%, susu dipisah..."
                rows={2}
                className="w-full p-2.5 text-sm rounded-xl border border-stone-200 focus:border-stone-400 focus:outline-hidden text-stone-800 placeholder-stone-400 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Footer actions: Qty + Add to Cart Button */}
        <div className="p-4 sm:p-5 border-t border-stone-200/80 bg-stone-50/70 flex items-center justify-between gap-3">
          {/* Quantity selector */}
          <div className="flex items-center gap-2 bg-white rounded-xl border border-stone-200 p-1 shadow-xs">
            <button
              onClick={handleDecrement}
              aria-label="Kurangi jumlah"
              disabled={quantity <= 1}
              className="p-2 rounded-lg text-stone-700 hover:bg-stone-100 disabled:opacity-40 transition"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-7 text-center font-bold text-sm text-stone-900">
              {quantity}
            </span>
            <button
              onClick={handleIncrement}
              aria-label="Tambah jumlah"
              className="p-2 rounded-lg text-stone-700 hover:bg-stone-100 transition"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to cart CTA */}
          <button
            onClick={handleAdd}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-sm hover:shadow transition transform active:scale-98"
            style={{
              backgroundColor: 'var(--primary-color)',
              color: 'var(--primary-contrast)',
            }}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Tambah • {formatRupiah(totalPrice)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
