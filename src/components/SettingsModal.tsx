import React, { useState } from 'react';
import { PRESET_CAFES } from '../services/sheetsService';
import { X, Sliders, Palette, FileSpreadsheet, Check, RefreshCw } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePreset: string;
  onSelectPreset: (key: string) => void;
  customSheetUrl: string;
  onSaveSheetUrl: (url: string) => void;
  currentHex: string;
  onUpdateHex: (hex: string) => void;
  isLoading: boolean;
  dataSource: 'preset' | 'google-sheets';
  fetchError?: string;
}

export function SettingsModal({
  isOpen,
  onClose,
  activePreset,
  onSelectPreset,
  customSheetUrl,
  onSaveSheetUrl,
  currentHex,
  onUpdateHex,
  isLoading,
  dataSource,
  fetchError,
}: SettingsModalProps) {
  const [sheetInput, setSheetInput] = useState(customSheetUrl);
  const [hexInput, setHexInput] = useState(currentHex);

  if (!isOpen) return null;

  const handleApplySheet = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSheetUrl(sheetInput);
  };

  const handleColorChange = (newHex: string) => {
    setHexInput(newHex);
    onUpdateHex(newHex);
  };

  const quickColors = [
    { name: 'Bronze Gold', hex: '#8B5A2B' },
    { name: 'Forest Emerald', hex: '#1E3A2F' },
    { name: 'Burgundy Crimson', hex: '#9B2C2C' },
    { name: 'Midnight Navy', hex: '#1E293B' },
    { name: 'Warm Terracotta', hex: '#C05621' },
    { name: 'Rosewood', hex: '#831843' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Pengaturan Branding & Data Google Sheets"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
    >
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-stone-700" />
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Pengaturan Mesin Branding & Data
              </h2>
              <p className="text-xs text-stone-500">Cafetap Architecture Demo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup pengaturan"
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 space-y-6 overflow-y-auto">
          {/* Preset Cafes */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
              1. Pilih Preset Kafe (Sample Data)
            </label>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(PRESET_CAFES).map(([key, item]) => {
                const isSelected = activePreset === key && dataSource === 'preset';
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => onSelectPreset(key)}
                    className={`flex items-center justify-between p-3 rounded-2xl border text-left transition ${
                      isSelected
                        ? 'border-stone-900 bg-stone-50 ring-2 ring-stone-900/10'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-4 h-4 rounded-full border border-white shadow-xs shrink-0"
                        style={{ backgroundColor: item.branding.hex_warna_utama }}
                      />
                      <div>
                        <span className="text-sm font-bold text-stone-900 block">
                          {item.branding.nama_kafe}
                        </span>
                        <span className="text-[11px] text-stone-500 block">
                          {item.branding.tagline}
                        </span>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-stone-900 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Color Engine */}
          <div className="space-y-2 pt-2 border-t border-stone-100">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                2. Mesin Warna Dinamis (hex_warna_utama)
              </label>
              <span className="text-xs font-mono font-semibold text-stone-500">
                {currentHex}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="color"
                value={hexInput}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-10 h-10 rounded-xl cursor-pointer border border-stone-200 p-0.5"
                title="Pilih warna utama kafe"
              />
              <div className="flex flex-wrap gap-1.5 flex-1">
                {quickColors.map((col) => (
                  <button
                    key={col.hex}
                    type="button"
                    onClick={() => handleColorChange(col.hex)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                      currentHex.toLowerCase() === col.hex.toLowerCase()
                        ? 'border-stone-900 text-stone-900 font-bold bg-stone-100'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <span
                      className="inline-block w-2 h-2 rounded-full mr-1.5 align-middle"
                      style={{ backgroundColor: col.hex }}
                    />
                    {col.name}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-[11px] text-stone-500">
              Warna ini langsung disuntikkan ke variabel CSS <code className="bg-stone-100 px-1 py-0.5 rounded">--primary-color</code> untuk mewarnai tombol, badge, dan tab.
            </p>
          </div>

          {/* Google Sheets Connector */}
          <div className="space-y-2 pt-2 border-t border-stone-100">
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center justify-between">
              <span>3. Integrasi Google Sheets</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  dataSource === 'google-sheets'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-stone-100 text-stone-600'
                }`}
              >
                {dataSource === 'google-sheets' ? 'Google Sheets Aktif' : 'Sample Preset'}
              </span>
            </label>

            <form onSubmit={handleApplySheet} className="space-y-2">
              <input
                type="text"
                value={sheetInput}
                onChange={(e) => setSheetInput(e.target.value)}
                placeholder="Spreadsheet ID atau URL Publik..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:border-stone-400 focus:outline-hidden"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  {isLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                  )}
                  <span>Muat dari Google Sheets</span>
                </button>
                {customSheetUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setSheetInput('');
                      onSaveSheetUrl('');
                    }}
                    className="py-2 px-3 rounded-xl bg-stone-100 text-stone-700 text-xs font-semibold hover:bg-stone-200"
                  >
                    Reset
                  </button>
                )}
              </div>
            </form>

            {fetchError && (
              <p className="text-[11px] text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                ⚠️ {fetchError}. Kembali menggunakan data preset yang aman.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}
