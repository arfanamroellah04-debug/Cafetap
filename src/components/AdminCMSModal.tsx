import React, { useState, useRef } from 'react';
import { CafeBranding, MenuItem } from '../types/cafe';
import { formatRupiah, exportMenuToCSV, generateTableUrl } from '../utils/rules';
import {
  X,
  LayoutDashboard,
  Utensils,
  Palette,
  FileSpreadsheet,
  QrCode,
  Plus,
  Edit2,
  Trash2,
  Check,
  RotateCcw,
  Download,
  Copy,
  ExternalLink,
  Flame,
  Award,
  Sparkles,
  Search,
  CheckCircle,
  ShieldCheck,
  Lock,
  LogOut,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { validateNewPassword, DEFAULT_ADMIN_PASSWORD } from '../utils/rules';

interface AdminCMSModalProps {
  isOpen: boolean;
  onClose: () => void;
  branding: CafeBranding;
  onUpdateBranding: (updated: CafeBranding) => void;
  menu: MenuItem[];
  onUpdateMenu: (updated: MenuItem[]) => void;
  onResetToDefault: () => void;
  appUrl: string;
  storedPassword?: string | null;
  onUpdatePassword: (newPass: string) => void;
  onLogout: () => void;
}

export function AdminCMSModal({
  isOpen,
  onClose,
  branding,
  onUpdateBranding,
  menu,
  onUpdateMenu,
  onResetToDefault,
  appUrl,
  storedPassword,
  onUpdatePassword,
  onLogout,
}: AdminCMSModalProps) {
  const [activeTab, setActiveTab] = useState<'menu' | 'branding' | 'sheets' | 'nfc' | 'security'>('menu');
  const [menuSearch, setMenuSearch] = useState('');
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  // Security password change state
  const [currentPassInput, setCurrentPassInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [confirmPassInput, setConfirmPassInput] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Horizontal scroll ref & helper for CMS tab bar
  const tabScrollRef = useRef<HTMLDivElement>(null);

  const scrollTabsLeft = () => {
    if (tabScrollRef.current) {
      tabScrollRef.current.scrollBy({ left: -220, behavior: 'smooth' });
    }
  };

  const scrollTabsRight = () => {
    if (tabScrollRef.current) {
      tabScrollRef.current.scrollBy({ left: 240, behavior: 'smooth' });
    }
  };

  // Editing or adding menu item state
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form item state
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formPrice, setFormPrice] = useState<number>(0);
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formAvailable, setFormAvailable] = useState(true);
  const [formIsBestSeller, setFormIsBestSeller] = useState(false);
  const [formIsChefPick, setFormIsChefPick] = useState(false);
  const [formIsNew, setFormIsNew] = useState(false);
  const [formDietary, setFormDietary] = useState<string[]>([]);

  // Branding form state
  const [brandState, setBrandState] = useState<CafeBranding>(branding);

  // NFC Table generator state
  const [testTableNum, setTestTableNum] = useState('01');

  if (!isOpen) return null;

  // Filter menu
  const filteredMenu = menu.filter((item) => {
    const q = menuSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      item.nama_menu.toLowerCase().includes(q) ||
      item.kategori.toLowerCase().includes(q) ||
      (item.deskripsi && item.deskripsi.toLowerCase().includes(q))
    );
  });

  const categories = Array.from(new Set(menu.map((m) => m.kategori)));

  // Start adding
  const handleStartAdd = () => {
    setEditingItem(null);
    setIsAddingNew(true);
    setFormName('');
    setFormCategory(categories[0] || 'Kopi');
    setFormPrice(35000);
    setFormImageUrl('https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600');
    setFormDesc('');
    setFormAvailable(true);
    setFormIsBestSeller(false);
    setFormIsChefPick(false);
    setFormIsNew(true);
    setFormDietary(['halal']);
  };

  // Start editing
  const handleStartEdit = (item: MenuItem) => {
    setEditingItem(item);
    setIsAddingNew(false);
    setFormName(item.nama_menu);
    setFormCategory(item.kategori);
    setFormPrice(item.harga);
    setFormImageUrl(item.url_gambar);
    setFormDesc(item.deskripsi || '');
    setFormAvailable(item.status_tersedia);
    setFormIsBestSeller(Boolean(item.is_best_seller));
    setFormIsChefPick(Boolean(item.is_chef_pick));
    setFormIsNew(Boolean(item.is_new));
    setFormDietary(item.dietary || []);
  };

  // Save Item
  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (isAddingNew) {
      const newItem: MenuItem = {
        id: `custom-item-${Date.now()}`,
        kategori: formCategory.trim() || 'Menu Utama',
        nama_menu: formName.trim(),
        harga: Number(formPrice) || 0,
        url_gambar: formImageUrl.trim() || 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600',
        status_tersedia: formAvailable,
        deskripsi: formDesc.trim() || undefined,
        is_best_seller: formIsBestSeller,
        is_chef_pick: formIsChefPick,
        is_new: formIsNew,
        dietary: formDietary as any,
      };
      onUpdateMenu([newItem, ...menu]);
    } else if (editingItem) {
      const updatedList = menu.map((m) =>
        m.id === editingItem.id
          ? {
              ...m,
              kategori: formCategory.trim() || 'Menu Utama',
              nama_menu: formName.trim(),
              harga: Number(formPrice) || 0,
              url_gambar: formImageUrl.trim() || m.url_gambar,
              status_tersedia: formAvailable,
              deskripsi: formDesc.trim() || undefined,
              is_best_seller: formIsBestSeller,
              is_chef_pick: formIsChefPick,
              is_new: formIsNew,
              dietary: formDietary as any,
            }
          : m
      );
      onUpdateMenu(updatedList);
    }

    setEditingItem(null);
    setIsAddingNew(false);
  };

  // Delete Item
  const handleDeleteItem = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus menu ini?')) {
      onUpdateMenu(menu.filter((m) => m.id !== id));
    }
  };

  // Quick toggle availability switch
  const handleToggleAvailability = (id: string) => {
    onUpdateMenu(
      menu.map((m) => (m.id === id ? { ...m, status_tersedia: !m.status_tersedia } : m))
    );
  };

  // Save Branding
  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateBranding(brandState);
    setCopySuccess('Branding berhasil disimpan!');
    setTimeout(() => setCopySuccess(null), 2500);
  };

  // Export CSV
  const handleDownloadCSV = () => {
    const csvContent = exportMenuToCSV(menu);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${branding.nama_kafe.toLowerCase().replace(/\s+/g, '_')}_menu.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(`Tersalin: ${label}`);
    setTimeout(() => setCopySuccess(null), 2500);
  };

  const generatedNfcUrl = generateTableUrl(
    typeof window !== 'undefined' ? window.location.origin : appUrl,
    testTableNum
  );

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateNewPassword(
      currentPassInput,
      newPassInput,
      confirmPassInput,
      storedPassword
    );

    if (!validation.isValid) {
      setPasswordError(validation.error || 'Gagal mengubah kata sandi.');
      setPasswordSuccess('');
      return;
    }

    onUpdatePassword(newPassInput.trim());
    setPasswordError('');
    setPasswordSuccess('Kata sandi CMS berhasil diperbarui!');
    setCurrentPassInput('');
    setNewPassInput('');
    setConfirmPassInput('');
  };

  const handleResetPassword = () => {
    if (confirm('Kembalikan kata sandi ke bawaan default ("admincafetap")?')) {
      onUpdatePassword(DEFAULT_ADMIN_PASSWORD);
      setPasswordError('');
      setPasswordSuccess('Kata sandi berhasil dikembalikan ke bawaan default ("admincafetap").');
      setCurrentPassInput('');
      setNewPassInput('');
      setConfirmPassInput('');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Panel Kelola Konten & CMS Cafetap"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-900/70 backdrop-blur-xs transition-opacity animate-in fade-in"
    >
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-stone-200 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 font-bold">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight">Cafetap Studio (CMS)</h2>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500 text-stone-950">
                  Admin Portal
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Kelola menu makanan & minuman, identitas branding, dan stiker NFC
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onLogout}
              className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition"
              title="Kunci CMS & Keluar"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kunci & Keluar</span>
            </button>

            <button
              onClick={onClose}
              aria-label="Tutup panel CMS"
              className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation with VISIBLE Horizontal Scrollbar and Left/Right Navigation */}
        <div className="border-b border-stone-200 bg-stone-100/95 px-2 sm:px-4 pt-2.5 pb-2.5">
          <div className="flex items-center gap-1.5">
            {/* Scroll Left Button */}
            <button
              type="button"
              onClick={scrollTabsLeft}
              aria-label="Geser tab menu ke kiri"
              className="p-2 sm:px-2.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 hover:text-stone-900 shadow-2xs shrink-0 transition flex items-center gap-1 font-bold text-xs"
              title="Geser tab ke kiri"
            >
              <ChevronLeft className="w-4 h-4 text-stone-700" />
              <span className="hidden md:inline">Kiri</span>
            </button>

            {/* Scrollable Container with VISIBLE Custom Horizontal Scrollbar */}
            <div
              ref={tabScrollRef}
              tabIndex={0}
              aria-label="Daftar tab menu CMS (dapat digulir ke samping)"
              className="flex items-center gap-2 overflow-x-scroll custom-horizontal-scrollbar scroll-smooth pb-2.5 pt-0.5 px-1 flex-1 select-none"
            >
              {/* Tab 1: Kelola Menu */}
              <button
                onClick={() => {
                  setActiveTab('menu');
                  setEditingItem(null);
                  setIsAddingNew(false);
                }}
                className={`shrink-0 whitespace-nowrap flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 shadow-2xs ${
                  activeTab === 'menu'
                    ? 'bg-stone-900 text-white shadow-sm ring-1 ring-stone-900'
                    : 'bg-white hover:bg-stone-50 text-stone-700 hover:text-stone-950 border border-stone-200/90'
                }`}
              >
                <Utensils className={`w-4 h-4 shrink-0 ${activeTab === 'menu' ? 'text-amber-400' : 'text-stone-500'}`} />
                <span className="whitespace-nowrap">Kelola Menu</span>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-md font-extrabold ${
                    activeTab === 'menu'
                      ? 'bg-white/20 text-white'
                      : 'bg-stone-100 text-stone-800 border border-stone-200'
                  }`}
                >
                  {menu.length}
                </span>
              </button>

              {/* Tab 2: Branding & Sosmed */}
              <button
                onClick={() => {
                  setActiveTab('branding');
                  setEditingItem(null);
                  setIsAddingNew(false);
                }}
                className={`shrink-0 whitespace-nowrap flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 shadow-2xs ${
                  activeTab === 'branding'
                    ? 'bg-stone-900 text-white shadow-sm ring-1 ring-stone-900'
                    : 'bg-white hover:bg-stone-50 text-stone-700 hover:text-stone-950 border border-stone-200/90'
                }`}
              >
                <Palette className={`w-4 h-4 shrink-0 ${activeTab === 'branding' ? 'text-amber-400' : 'text-stone-500'}`} />
                <span className="whitespace-nowrap">Branding & Sosmed</span>
              </button>

              {/* Tab 3: Google Sheets & Template */}
              <button
                onClick={() => {
                  setActiveTab('sheets');
                  setEditingItem(null);
                  setIsAddingNew(false);
                }}
                className={`shrink-0 whitespace-nowrap flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 shadow-2xs ${
                  activeTab === 'sheets'
                    ? 'bg-stone-900 text-white shadow-sm ring-1 ring-stone-900'
                    : 'bg-white hover:bg-stone-50 text-stone-700 hover:text-stone-950 border border-stone-200/90'
                }`}
              >
                <FileSpreadsheet className={`w-4 h-4 shrink-0 ${activeTab === 'sheets' ? 'text-emerald-400' : 'text-emerald-600'}`} />
                <span className="whitespace-nowrap">Google Sheets & Template</span>
              </button>

              {/* Tab 4: Generator Meja & NFC */}
              <button
                onClick={() => {
                  setActiveTab('nfc');
                  setEditingItem(null);
                  setIsAddingNew(false);
                }}
                className={`shrink-0 whitespace-nowrap flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 shadow-2xs ${
                  activeTab === 'nfc'
                    ? 'bg-stone-900 text-white shadow-sm ring-1 ring-stone-900'
                    : 'bg-white hover:bg-stone-50 text-stone-700 hover:text-stone-950 border border-stone-200/90'
                }`}
              >
                <QrCode className={`w-4 h-4 shrink-0 ${activeTab === 'nfc' ? 'text-amber-400' : 'text-stone-500'}`} />
                <span className="whitespace-nowrap">Generator Meja & NFC</span>
              </button>

              {/* Tab 5: Keamanan & Sandi */}
              <button
                onClick={() => {
                  setActiveTab('security');
                  setEditingItem(null);
                  setIsAddingNew(false);
                }}
                className={`shrink-0 whitespace-nowrap flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 shadow-2xs ${
                  activeTab === 'security'
                    ? 'bg-stone-900 text-white shadow-sm ring-2 ring-amber-400'
                    : 'bg-white hover:bg-amber-50/50 text-amber-950 hover:text-stone-950 border border-amber-300'
                }`}
              >
                <ShieldCheck className={`w-4 h-4 shrink-0 ${activeTab === 'security' ? 'text-amber-400' : 'text-amber-600'}`} />
                <span className="whitespace-nowrap">Keamanan & Sandi</span>
                <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded-md bg-amber-400 text-stone-950 shadow-2xs">
                  Ganti Sandi
                </span>
              </button>
            </div>
          </div>

          {/* Visual scroll bar indicator / hint bar */}
          <div className="flex items-center justify-between text-[11px] text-stone-600 px-1 pt-1.5 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Geser baris tab ke samping kanan untuk membuka <strong>Keamanan & Ganti Sandi</strong></span>
            </span>
            <span className="text-[10px] font-semibold text-stone-500 bg-stone-200/80 px-2 py-0.5 rounded-full">
              5 Tab Menu
            </span>
          </div>
        </div>

        {/* Feedback Alert */}
        {copySuccess && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2 flex items-center justify-between text-xs text-emerald-800 font-semibold animate-in fade-in">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{copySuccess}</span>
            </div>
            <button onClick={() => setCopySuccess(null)} className="text-emerald-600">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#FAF9F7]">
          {/* TAB 1: KELOLA MENU */}
          {activeTab === 'menu' && (
            <div className="space-y-4">
              {/* Form Add / Edit Modal */}
              {(isAddingNew || editingItem) ? (
                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <h3 className="text-sm font-bold text-stone-900">
                      {isAddingNew ? 'Tambah Item Menu Baru' : `Edit Menu: ${editingItem?.nama_menu}`}
                    </h3>
                    <button
                      onClick={() => {
                        setIsAddingNew(false);
                        setEditingItem(null);
                      }}
                      className="text-xs text-stone-500 hover:text-stone-900 font-medium"
                    >
                      Batal
                    </button>
                  </div>

                  <form onSubmit={handleSaveItem} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-stone-700">
                          Nama Menu <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          placeholder="Misal: Pistachio Iced Latte"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-stone-700">
                          Kategori
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={formCategory}
                            onChange={(e) => setFormCategory(e.target.value)}
                            placeholder="Kategori (Kopi, Pastry, dll)"
                            className="flex-1 px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-stone-700">
                          Harga (IDR) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          required
                          value={formPrice}
                          onChange={(e) => setFormPrice(Number(e.target.value))}
                          placeholder="45000"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden"
                        />
                        <span className="text-[11px] text-stone-400 font-medium">
                          Tampil sebagai: {formatRupiah(formPrice)}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-stone-700">
                          URL Gambar
                        </label>
                        <input
                          type="url"
                          value={formImageUrl}
                          onChange={(e) => setFormImageUrl(e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-stone-700">
                        Deskripsi Menu
                      </label>
                      <textarea
                        value={formDesc}
                        onChange={(e) => setFormDesc(e.target.value)}
                        placeholder="Deskripsikan komposisi, asal biji kopi, rasa..."
                        rows={2}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden resize-none"
                      />
                    </div>

                    {/* Toggles & Badges */}
                    <div className="flex flex-wrap gap-4 pt-2 border-t border-stone-100 text-xs">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formAvailable}
                          onChange={(e) => setFormAvailable(e.target.checked)}
                          className="rounded text-stone-900 focus:ring-0"
                        />
                        <span className="font-bold text-stone-800">
                          Status Tersedia (In Stock)
                        </span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formIsBestSeller}
                          onChange={(e) => setFormIsBestSeller(e.target.checked)}
                          className="rounded text-amber-500 focus:ring-0"
                        />
                        <span className="font-semibold text-amber-800">🔥 Favorit / Best Seller</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formIsChefPick}
                          onChange={(e) => setFormIsChefPick(e.target.checked)}
                          className="rounded text-stone-900 focus:ring-0"
                        />
                        <span className="font-semibold text-stone-800">👑 Chef's Pick</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formIsNew}
                          onChange={(e) => setFormIsNew(e.target.checked)}
                          className="rounded text-emerald-600 focus:ring-0"
                        />
                        <span className="font-semibold text-emerald-800">✨ Baru (New)</span>
                      </label>
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingNew(false);
                          setEditingItem(null);
                        }}
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 transition"
                      >
                        {isAddingNew ? 'Simpan Menu Baru' : 'Perbarui Menu'}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <>
                  {/* Action Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={menuSearch}
                        onChange={(e) => setMenuSearch(e.target.value)}
                        placeholder="Cari menu untuk diedit..."
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-hidden"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleStartAdd}
                        className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah Menu</span>
                      </button>

                      <button
                        onClick={handleDownloadCSV}
                        className="px-3 py-2 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition"
                        title="Unduh format spreadsheet CSV"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Unduh CSV</span>
                      </button>
                    </div>
                  </div>

                  {/* Table of Menu Items */}
                  <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
                    <div className="divide-y divide-stone-100">
                      {filteredMenu.map((item) => (
                        <div
                          key={item.id}
                          className="p-3 sm:p-4 flex items-center justify-between gap-3 hover:bg-stone-50/70 transition"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={item.url_gambar}
                              alt={item.nama_menu}
                              className="w-12 h-12 rounded-xl object-cover shrink-0 bg-stone-100"
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                                  {item.nama_menu}
                                </h4>
                                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-600 font-semibold">
                                  {item.kategori}
                                </span>
                                {item.is_best_seller && (
                                  <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800 font-bold">
                                    Favorit
                                  </span>
                                )}
                              </div>
                              <p className="text-xs font-extrabold text-stone-700 mt-0.5">
                                {formatRupiah(item.harga)}
                              </p>
                            </div>
                          </div>

                          {/* Quick controls: Availability Toggle + Edit + Delete */}
                          <div className="flex items-center gap-2 shrink-0">
                            {/* Stock status button */}
                            <button
                              type="button"
                              onClick={() => handleToggleAvailability(item.id)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                                item.status_tersedia
                                  ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                  : 'bg-red-50 text-red-600 hover:bg-red-100'
                              }`}
                              title="Klik untuk ubah status ketersediaan"
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  item.status_tersedia ? 'bg-emerald-500' : 'bg-red-500'
                                }`}
                              />
                              <span>{item.status_tersedia ? 'Tersedia' : 'Habis'}</span>
                            </button>

                            <button
                              onClick={() => handleStartEdit(item)}
                              aria-label={`Edit ${item.nama_menu}`}
                              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition"
                              title="Edit menu"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              aria-label={`Hapus ${item.nama_menu}`}
                              className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition"
                              title="Hapus menu"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 2: BRANDING & SOSIAL MEDIA */}
          {activeTab === 'branding' && (
            <form onSubmit={handleSaveBranding} className="space-y-5 bg-white p-5 rounded-2xl border border-stone-200">
              <div className="border-b border-stone-100 pb-3">
                <h3 className="text-sm font-bold text-stone-900">Pengaturan Identitas & Sosial Media</h3>
                <p className="text-xs text-stone-500">
                  Ubah nama kafe, warna aksen, dan tautan media sosial yang tampil pada aplikasi pelanggan.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-700">Nama Kafe</label>
                  <input
                    type="text"
                    required
                    value={brandState.nama_kafe}
                    onChange={(e) => setBrandState({ ...brandState, nama_kafe: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-700">Tagline Kafe</label>
                  <input
                    type="text"
                    value={brandState.tagline || ''}
                    onChange={(e) => setBrandState({ ...brandState, tagline: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-700">URL Logo (Bulat)</label>
                  <input
                    type="url"
                    value={brandState.url_logo}
                    onChange={(e) => setBrandState({ ...brandState, url_logo: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-700">Warna Utama (hex_warna_utama)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={brandState.hex_warna_utama}
                      onChange={(e) => setBrandState({ ...brandState, hex_warna_utama: e.target.value })}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-stone-200 p-0.5"
                    />
                    <input
                      type="text"
                      value={brandState.hex_warna_utama}
                      onChange={(e) => setBrandState({ ...brandState, hex_warna_utama: e.target.value })}
                      className="flex-1 px-3 py-2 text-xs font-mono rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-700">Nomor WhatsApp Checkout</label>
                  <input
                    type="text"
                    value={brandState.nomor_whatsapp}
                    onChange={(e) => setBrandState({ ...brandState, nomor_whatsapp: e.target.value })}
                    placeholder="Contoh: 08123456789 atau 628123456789"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-700">URL Ulasan Google Maps Bintang 5</label>
                  <input
                    type="url"
                    value={brandState.url_review_gmaps}
                    onChange={(e) => setBrandState({ ...brandState, url_review_gmaps: e.target.value })}
                    placeholder="https://maps.google.com/..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-700">URL Instagram (Kosongkan jika tidak ada)</label>
                  <input
                    type="text"
                    value={brandState.url_instagram}
                    onChange={(e) => setBrandState({ ...brandState, url_instagram: e.target.value })}
                    placeholder="https://instagram.com/..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-700">URL TikTok (Kosongkan jika tidak ada)</label>
                  <input
                    type="text"
                    value={brandState.url_tiktok}
                    onChange={(e) => setBrandState({ ...brandState, url_tiktok: e.target.value })}
                    placeholder="https://tiktok.com/@..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-700">Pajak Restoran / PB1 (%)</label>
                  <input
                    type="number"
                    value={brandState.pajak_persen || 0}
                    onChange={(e) => setBrandState({ ...brandState, pajak_persen: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-700">Biaya Layanan / Service Charge (%)</label>
                  <input
                    type="number"
                    value={brandState.layanan_persen || 0}
                    onChange={(e) => setBrandState({ ...brandState, layanan_persen: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-700">Alamat Kafe</label>
                <input
                  type="text"
                  value={brandState.alamat || ''}
                  onChange={(e) => setBrandState({ ...brandState, alamat: e.target.value })}
                  placeholder="Jl. Senopati No. 42, Jakarta Selatan"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={onResetToDefault}
                  className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1 font-semibold"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Kembalikan ke Preset Default</span>
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 transition shadow-xs"
                >
                  Simpan Perubahan Branding
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: GOOGLE SHEETS & TEMPLATE */}
          {activeTab === 'sheets' && (
            <div className="space-y-5 bg-white p-5 rounded-2xl border border-stone-200">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Arsitektur Google Sheets sebagai CMS</h3>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  Cafetap bekerja secara <strong>Zero-Backend</strong>. Pemilik kafe cukup membuat satu Google Sheets dan mempublikasikannya ke web (*File &gt; Share &gt; Publish to web*). Aplikasi ini akan langsung membaca data menu dan branding secara otomatis!
                </p>
              </div>

              {/* Template Columns */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Format Kolom Spreadsheet
                  </span>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        'kategori,nama_menu,harga,url_gambar,status_tersedia,deskripsi,is_best_seller,is_chef_pick,dietary',
                        'Header Kolom'
                      )
                    }
                    className="text-[11px] text-stone-700 font-semibold flex items-center gap-1 hover:text-stone-900"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Salin Header Kolom</span>
                  </button>
                </div>

                <div className="bg-stone-900 text-stone-200 p-3 rounded-xl font-mono text-[11px] overflow-x-auto">
                  kategori, nama_menu, harga, url_gambar, status_tersedia, deskripsi, is_best_seller, is_chef_pick, dietary
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleDownloadCSV}
                  className="p-3.5 rounded-xl border border-stone-200 hover:border-stone-300 bg-stone-50 hover:bg-stone-100 flex items-center justify-between text-left transition"
                >
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">Unduh Template CSV</span>
                    <span className="text-[11px] text-stone-500 block">
                      Buka langsung di Google Sheets atau Excel
                    </span>
                  </div>
                  <Download className="w-4 h-4 text-stone-700 shrink-0" />
                </button>

                <button
                  onClick={() =>
                    copyToClipboard(
                      exportMenuToCSV(menu),
                      'Seluruh Data Menu (CSV)'
                    )
                  }
                  className="p-3.5 rounded-xl border border-stone-200 hover:border-stone-300 bg-stone-50 hover:bg-stone-100 flex items-center justify-between text-left transition"
                >
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">Salin Data Menu Saat Ini</span>
                    <span className="text-[11px] text-stone-500 block">
                      Tinggal paste ke Google Sheets Anda
                    </span>
                  </div>
                  <Copy className="w-4 h-4 text-stone-700 shrink-0" />
                </button>
              </div>

              {/* Instructions */}
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-2">
                <h4 className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  Langkah Menghubungkan Google Sheets ke Cafetap:
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-amber-950/80">
                  <li>Buat Spreadsheet di Google Sheets dan paste format kolom di atas.</li>
                  <li>Buka menu <strong>File &gt; Share &gt; Publish to web</strong>.</li>
                  <li>Pilih format <strong>Comma-separated values (.csv)</strong> atau <strong>Web page</strong> lalu klik <em>Publish</em>.</li>
                  <li>Salin Spreadsheet ID atau tautan publiknya dan masukkan pada menu <em>Pengaturan Kafe</em>.</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 4: GENERATOR MEJA & NFC */}
          {activeTab === 'nfc' && (
            <div className="space-y-5 bg-white p-5 rounded-2xl border border-stone-200">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Generator Tautan & Tag Kartu NFC</h3>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  Tulis URL meja ini ke dalam stiker kartu NFC meja Anda menggunakan aplikasi seperti <em>NFC Tools</em> (Android / iOS). Saat pelanggan menempelkan smartphone, menu akan langsung terbuka dengan nomor meja terisi otomatis!
                </p>
              </div>

              {/* Generator input */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
                <div className="flex items-center gap-3">
                  <label htmlFor="test-table" className="text-xs font-bold text-stone-700">
                    Pilih Nomor Meja:
                  </label>
                  <input
                    id="test-table"
                    type="text"
                    value={testTableNum}
                    onChange={(e) => setTestTableNum(e.target.value)}
                    className="w-24 px-3 py-1.5 text-xs font-bold rounded-lg border border-stone-200 bg-white"
                  />
                  <div className="flex gap-1">
                    {['01', '02', '05', '10', 'VIP 1'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTestTableNum(t)}
                        className="px-2 py-1 text-[11px] font-semibold rounded-md bg-white border border-stone-200 hover:bg-stone-100"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-stone-500">Tautan NFC untuk Meja Ini:</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={generatedNfcUrl}
                      className="flex-1 px-3 py-2 text-xs font-mono rounded-xl border border-stone-200 bg-white text-stone-800"
                    />
                    <button
                      type="button"
                      onClick={() => copyToClipboard(generatedNfcUrl, `URL Meja ${testTableNum}`)}
                      className="px-3 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold flex items-center gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin</span>
                    </button>
                    <a
                      href={generatedNfcUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700"
                      title="Tes buka tautan"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Grid of Preset Tables */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Daftar Cepat Tautan Meja 01 s/d 12
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Array.from({ length: 12 }, (_, i) => {
                    const tbl = String(i + 1).padStart(2, '0');
                    const url = generateTableUrl(
                      typeof window !== 'undefined' ? window.location.origin : appUrl,
                      tbl
                    );
                    return (
                      <button
                        key={tbl}
                        onClick={() => copyToClipboard(url, `Meja ${tbl}`)}
                        className="p-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-left transition flex items-center justify-between"
                      >
                        <div>
                          <span className="text-xs font-bold text-stone-900 block">Meja {tbl}</span>
                          <span className="text-[10px] text-stone-400 font-mono block truncate">?meja={tbl}</span>
                        </div>
                        <Copy className="w-3.5 h-3.5 text-stone-400" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: KEAMANAN & UBAH SANDI */}
          {activeTab === 'security' && (
            <div className="space-y-5 bg-white p-5 rounded-2xl border border-stone-200">
              <div className="border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-500" />
                  <h3 className="text-sm font-bold text-stone-900">Keamanan Akses CMS & Ganti Kata Sandi</h3>
                </div>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  Ganti kata sandi bawaan untuk memastikan hanya pengelola, kasir, atau pemilik kafe yang memiliki wewenang untuk mengubah data menu, harga, ketersediaan stok, dan identitas kafe.
                </p>
              </div>

              {/* Password feedback messages */}
              {passwordError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2 font-medium animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{passwordError}</span>
                </div>
              )}

              {passwordSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-medium animate-in fade-in">
                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-700">
                    Kata Sandi Saat Ini <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type={showCurrentPass ? 'text' : 'password'}
                      required
                      value={currentPassInput}
                      onChange={(e) => {
                        setCurrentPassInput(e.target.value);
                        setPasswordError('');
                      }}
                      placeholder="Masukkan sandi saat ini..."
                      className="w-full pl-3 pr-10 py-2.5 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="absolute right-3 p-1 text-stone-400 hover:text-stone-700"
                    >
                      {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-700">
                    Kata Sandi Baru <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      required
                      value={newPassInput}
                      onChange={(e) => {
                        setNewPassInput(e.target.value);
                        setPasswordError('');
                      }}
                      placeholder="Minimal 4 karakter..."
                      className="w-full pl-3 pr-10 py-2.5 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3 p-1 text-stone-400 hover:text-stone-700"
                    >
                      {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-700">
                    Konfirmasi Kata Sandi Baru <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassInput}
                    onChange={(e) => {
                      setConfirmPassInput(e.target.value);
                      setPasswordError('');
                    }}
                    placeholder="Ketik ulang sandi baru..."
                    className="w-full px-3 py-2.5 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={handleResetPassword}
                    className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1 font-semibold"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset ke Sandi Bawaan ({DEFAULT_ADMIN_PASSWORD})</span>
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 transition shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Simpan Sandi Baru</span>
                  </button>
                </div>
              </form>

              {/* Safety notice */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 space-y-1.5">
                <span className="font-bold text-stone-900 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-stone-700" />
                  Tips Keamanan Kafe:
                </span>
                <p className="leading-relaxed">
                  Sandi ini tersimpan pada perangkat browser kasir/manajer kafe. Jika Anda membuka menu dari smartphone pelanggan atau kartu NFC meja, pelanggan tidak dapat melihat isi CMS tanpa mengetahui kata sandi ini.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-white flex items-center justify-between">
          <p className="text-[11px] text-stone-500">
            Perubahan menu dan ketersediaan langsung tersimpan dan aktif pada tampilan pelanggan.
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition"
          >
            Tutup Studio
          </button>
        </div>
      </div>
    </div>
  );
}
