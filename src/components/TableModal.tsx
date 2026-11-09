import React, { useState } from 'react';
import { X, Radio, Check } from 'lucide-react';

interface TableModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTable: string;
  onSelectTable: (table: string) => void;
}

export function TableModal({
  isOpen,
  onClose,
  currentTable,
  onSelectTable,
}: TableModalProps) {
  const [inputVal, setInputVal] = useState(currentTable);

  if (!isOpen) return null;

  const handleSave = (val: string) => {
    onSelectTable(val);
    onClose();
  };

  const quickTables = [
    '01', '02', '03', '04', '05', '06',
    '07', '08', '09', '10', '11', '12',
    'VIP 1', 'VIP 2', 'Bar 1', 'Bar 2',
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Pilih Nomor Meja NFC"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
    >
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-stone-700" />
            <div>
              <h2 className="text-sm font-bold text-stone-900">
                Identifikasi Meja (NFC Tap)
              </h2>
              <p className="text-[11px] text-stone-500">Pilih atau ubah nomor meja</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup pemilihan meja"
            className="p-1 rounded-full text-stone-400 hover:text-stone-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="custom-table-input" className="block text-xs font-bold text-stone-700">
              Input Nomor Meja Manual
            </label>
            <div className="flex gap-2">
              <input
                id="custom-table-input"
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Contoh: 07"
                className="flex-1 px-3 py-2 text-sm rounded-xl border border-stone-200 focus:border-stone-400 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => handleSave(inputVal)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 transition"
              >
                Pilih
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <span className="block text-xs font-bold text-stone-500 uppercase tracking-wider">
              Pilihan Cepat Meja
            </span>
            <div className="grid grid-cols-4 gap-2">
              {quickTables.map((tbl) => {
                const isSelected = currentTable === tbl;
                return (
                  <button
                    key={tbl}
                    type="button"
                    onClick={() => handleSave(tbl)}
                    className={`py-2 px-1 text-xs font-bold rounded-xl border transition flex items-center justify-center gap-1 ${
                      isSelected
                        ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <span>{tbl}</span>
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>

          <p className="text-[11px] text-stone-500 leading-relaxed bg-stone-50 p-2.5 rounded-xl border border-stone-200/80">
            💡 Pada penggunaan sebenarnya, pelanggan cukup menempelkan smartphone ke stiker kartu NFC di meja untuk langsung membuka menu dengan nomor meja terisi otomatis.
          </p>
        </div>
      </div>
    </div>
  );
}
