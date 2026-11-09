import React from 'react';
import { CafeBranding } from '../types/cafe';
import { Search, SlidersHorizontal, Radio, X } from 'lucide-react';

interface HeaderProps {
  branding: CafeBranding;
  tableNumber: string;
  onTableClick: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenSettings: () => void;
  onOpenCMS: () => void;
}

export function Header({
  branding,
  tableNumber,
  onTableClick,
  searchQuery,
  onSearchChange,
  onOpenSettings,
  onOpenCMS,
}: HeaderProps) {
  return (
    <header className="relative bg-white/95 backdrop-blur-md border-b border-stone-200/80 sticky top-0 z-30 transition-all">
      <div className="max-w-4xl mx-auto px-4 py-3 sm:px-6">
        {/* Top brand & table info bar */}
        <div className="flex items-center justify-between gap-3">
          {/* Logo & Cafe Identity */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <img
                src={branding.url_logo}
                alt={branding.nama_kafe}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-stone-200 shadow-sm"
                onError={(e) => {
                  // Fallback logo
                  (e.currentTarget as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=100';
                }}
              />
              <span
                className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full ring-2 ring-white"
                style={{ backgroundColor: 'var(--primary-color)' }}
                title="Status Restoran Buka"
              />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-stone-900 truncate">
                  {branding.nama_kafe}
                </h1>
              </div>
              <p className="text-xs text-stone-500 truncate font-normal">
                {branding.tagline || 'Digital Smart Menu & Order'}
              </p>
            </div>
          </div>

          {/* Right Action: NFC Table badge, CMS button & Settings */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={onOpenCMS}
              aria-label="Buka CMS Admin untuk mengedit menu dan branding"
              className="px-2.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition flex items-center gap-1 shadow-xs"
              title="Kelola Konten & Menu (CMS)"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>CMS</span>
            </button>

            <button
              onClick={onTableClick}
              aria-label={`Ubah nomor meja saat ini meja ${tableNumber || 'Belum dipilih'}`}
              className="group flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200/80 text-stone-800 text-xs font-semibold tracking-wide transition border border-stone-200/60 shadow-xs"
            >
              <span className="relative flex h-2 w-2">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ backgroundColor: 'var(--primary-color)' }}
                />
                <span
                  className="relative inline-flex rounded-full h-2 w-2"
                  style={{ backgroundColor: 'var(--primary-color)' }}
                />
              </span>
              <Radio className="w-3.5 h-3.5 text-stone-600" />
              <span>{tableNumber ? `Meja ${tableNumber}` : 'Meja'}</span>
            </button>

            <button
              onClick={onOpenSettings}
              aria-label="Pengaturan dan tema kafe"
              className="p-2 rounded-full text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition"
              title="Ganti Tema & Google Sheets"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className="mt-3 relative">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari kopi, pastry, hidangan..."
              className="w-full pl-9 pr-8 py-2 text-sm bg-stone-50 hover:bg-stone-100/70 focus:bg-white rounded-xl border border-stone-200/80 focus:border-stone-400 focus:outline-hidden transition shadow-xs text-stone-800 placeholder-stone-400"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                aria-label="Hapus pencarian"
                className="absolute right-2.5 p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
