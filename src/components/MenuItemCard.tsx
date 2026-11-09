import React from 'react';
import { MenuItem } from '../types/cafe';
import { formatRupiah } from '../utils/rules';
import { Plus, Check, Award, Flame, Sparkles } from 'lucide-react';

interface MenuItemCardProps {
  item: MenuItem;
  cartQuantity: number;
  onOpenDetail: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem, e: React.MouseEvent) => void;
}

export function MenuItemCard({
  item,
  cartQuantity,
  onOpenDetail,
  onQuickAdd,
}: MenuItemCardProps) {
  const isAvailable = item.status_tersedia;

  return (
    <article
      onClick={() => isAvailable && onOpenDetail(item)}
      className={`group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-stone-200/80 luxury-shadow-sm transition-all duration-300 ${
        isAvailable
          ? 'hover:luxury-shadow-md hover:border-stone-300 cursor-pointer'
          : 'opacity-65 grayscale-30 cursor-not-allowed'
      }`}
    >
      {/* Image container */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-stone-100">
        <img
          src={item.url_gambar}
          alt={item.nama_menu}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isAvailable ? 'group-hover:scale-105' : ''
          }`}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Overlay badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
          {item.is_best_seller && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-xs">
              <Flame className="w-3 h-3" />
              Favorit
            </span>
          )}
          {item.is_chef_pick && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-900 text-white shadow-xs">
              <Award className="w-3 h-3 text-amber-300" />
              Chef's Pick
            </span>
          )}
          {item.is_new && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-xs">
              <Sparkles className="w-3 h-3" />
              Baru
            </span>
          )}
        </div>

        {/* Sold out badge */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[2px] flex items-center justify-center p-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white tracking-wider uppercase shadow-md">
              Habis / Sold Out
            </span>
          </div>
        )}

        {/* In-cart count badge */}
        {cartQuantity > 0 && (
          <div
            className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md"
            style={{ backgroundColor: 'var(--primary-color)' }}
          >
            {cartQuantity}
          </div>
        )}
      </div>

      {/* Item info */}
      <div className="flex flex-col flex-1 p-3.5 sm:p-4">
        <div className="flex-1 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm sm:text-base font-bold text-stone-900 leading-snug line-clamp-1 group-hover:text-amber-950 transition">
              {item.nama_menu}
            </h3>
          </div>

          {item.deskripsi && (
            <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
              {item.deskripsi}
            </p>
          )}
        </div>

        {/* Bottom row: Price & Quick Action */}
        <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-xs text-stone-400 block -mb-0.5 font-normal">Harga</span>
            <span className="text-sm sm:text-base font-extrabold text-stone-900">
              {formatRupiah(item.harga)}
            </span>
          </div>

          {isAvailable ? (
            <button
              onClick={(e) => onQuickAdd(item, e)}
              aria-label={`Tambah ${item.nama_menu} ke keranjang`}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition transform active:scale-92 text-white shadow-xs"
              style={{
                backgroundColor: 'var(--primary-color)',
                color: 'var(--primary-contrast)',
              }}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Tambah</span>
            </button>
          ) : (
            <span className="text-xs font-medium text-stone-400 italic">
              Tidak Tersedia
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
