import React, { useState } from 'react';
import { verifyAdminPassword, DEFAULT_ADMIN_PASSWORD } from '../utils/rules';
import { Lock, Eye, EyeOff, X, ShieldAlert, ArrowRight, KeyRound } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  storedPassword?: string | null;
}

export function AdminAuthModal({
  isOpen,
  onClose,
  onSuccess,
  storedPassword,
}: AdminAuthModalProps) {
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = verifyAdminPassword(passwordInput, storedPassword);

    if (isValid) {
      setErrorMessage('');
      setPasswordInput('');
      onSuccess();
    } else {
      setErrorMessage('Kata sandi yang Anda masukkan salah. Akses ditolak.');
    }
  };

  const handleClose = () => {
    setPasswordInput('');
    setErrorMessage('');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Kunci Akses CMS Admin"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/75 backdrop-blur-xs transition-opacity animate-in fade-in"
    >
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header Decor */}
        <div className="p-5 border-b border-stone-200 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight">Kunci Akses CMS</h2>
              <p className="text-[11px] text-stone-400">Area Terbatas Pemilik / Staf Kafe</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            aria-label="Tutup kunci CMS"
            className="p-1 rounded-full text-stone-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <p className="text-xs text-stone-600 leading-relaxed">
            Untuk mencegah pelanggan atau pihak luar mengubah menu dan harga, silakan masukkan kata sandi administrator.
          </p>

          <div className="space-y-1.5">
            <label htmlFor="admin-password-input" className="block text-xs font-bold text-stone-700">
              Kata Sandi CMS
            </label>
            <div className="relative flex items-center">
              <input
                id="admin-password-input"
                type={showPassword ? 'text' : 'password'}
                autoFocus
                required
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="Masukkan kata sandi..."
                className={`w-full pl-3 pr-10 py-2.5 text-sm rounded-xl border bg-stone-50 focus:bg-white focus:outline-hidden transition ${
                  errorMessage
                    ? 'border-red-500 ring-2 ring-red-100'
                    : 'border-stone-200 focus:border-stone-400'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 p-1 text-stone-400 hover:text-stone-700"
                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {errorMessage ? (
              <p className="flex items-center gap-1.5 text-[11px] text-red-600 font-semibold mt-1">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMessage}</span>
              </p>
            ) : (
              <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 mt-2">
                🔑 <strong>Sandi Bawaan:</strong> <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold text-amber-950">{DEFAULT_ADMIN_PASSWORD}</code>
                <p className="mt-0.5 text-stone-500 text-[10px]">
                  (Dapat Anda ganti sesuka hati di tab "Keamanan & Sandi" di dalam CMS)
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-700 font-semibold text-xs hover:bg-stone-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
            >
              <span>Masuk CMS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
