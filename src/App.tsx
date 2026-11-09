import React, { useState, useEffect, useMemo } from 'react';
import { CafeBranding, MenuItem, CartItem } from './types/cafe';
import { fetchCafeData, PRESET_CAFES } from './services/sheetsService';
import { applyDynamicBranding } from './utils/rules';
import { Header } from './components/Header';
import { GoogleMapsReviewBanner } from './components/GoogleMapsReviewBanner';
import { CategoryNav } from './components/CategoryNav';
import { MenuItemCard } from './components/MenuItemCard';
import { MenuItemModal } from './components/MenuItemModal';
import { CartDrawer } from './components/CartDrawer';
import { SocialFooter } from './components/SocialFooter';
import { SkeletonLoader } from './components/SkeletonLoader';
import { SettingsModal } from './components/SettingsModal';
import { TableModal } from './components/TableModal';
import { AdminCMSModal } from './components/AdminCMSModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { DEFAULT_ADMIN_PASSWORD } from './utils/rules';
import { Search, Sparkles } from 'lucide-react';

export default function App() {
  // Read initial table from NFC URL parameter (?meja=... or ?table=...) or localStorage
  const [tableNumber, setTableNumber] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlTable = params.get('meja') || params.get('table');
      if (urlTable) {
        localStorage.setItem('cafetap_table', urlTable);
        return urlTable;
      }
      return localStorage.getItem('cafetap_table') || '04';
    }
    return '04';
  });

  // Active preset & Google Sheets URL
  const [activePreset, setActivePreset] = useState<string>('lamour');
  const [customSheetUrl, setCustomSheetUrl] = useState<string>('');
  const [dataSource, setDataSource] = useState<'preset' | 'google-sheets'>('preset');
  const [fetchError, setFetchError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Core Data
  const [branding, setBranding] = useState<CafeBranding>(PRESET_CAFES.lamour.branding);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(PRESET_CAFES.lamour.menu);

  // Cart state persisted to localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('cafetap_cart');
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  // UI state
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedDietary, setSelectedDietary] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDetailItem, setSelectedDetailItem] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState<boolean>(false);
  const [isCMSOpen, setIsCMSOpen] = useState<boolean>(false);

  // Security & Admin Authentication State
  const [adminPassword, setAdminPassword] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('cafetap_admin_password') || DEFAULT_ADMIN_PASSWORD;
    }
    return DEFAULT_ADMIN_PASSWORD;
  });
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const handleUpdatePassword = (newPass: string) => {
    setAdminPassword(newPass);
    try {
      localStorage.setItem('cafetap_admin_password', newPass);
    } catch {
      // Ignore
    }
  };

  const handleOpenCMSRequest = () => {
    if (isAdminAuthenticated) {
      setIsCMSOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleLogoutCMS = () => {
    setIsAdminAuthenticated(false);
    setIsCMSOpen(false);
  };

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cafetap_cart', JSON.stringify(cart));
    } catch {
      // Ignore storage errors
    }
  }, [cart]);

  // Load data and inject dynamic branding
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetchCafeData({
      presetKey: activePreset,
      sheetUrlOrId: customSheetUrl,
    }).then((res) => {
      if (!isMounted) return;

      // Check if user has saved custom edits in localStorage
      let initialBranding = res.branding;
      let initialMenu = res.menu;

      try {
        const savedBranding = localStorage.getItem('cafetap_custom_branding');
        if (savedBranding) {
          initialBranding = JSON.parse(savedBranding);
        }
        const savedMenu = localStorage.getItem('cafetap_custom_menu');
        if (savedMenu) {
          initialMenu = JSON.parse(savedMenu);
        }
      } catch {
        // Ignore JSON parse errors
      }

      setBranding(initialBranding);
      setMenuItems(initialMenu);
      setDataSource(res.source);
      setFetchError(res.error);

      // Inject dynamic CSS variable (--primary-color)
      applyDynamicBranding(initialBranding.hex_warna_utama);

      // Simulate a brief elegant loading shimmer
      setTimeout(() => {
        if (isMounted) setIsLoading(false);
      }, 350);
    });

    return () => {
      isMounted = false;
    };
  }, [activePreset, customSheetUrl]);

  // Save menu updates from CMS
  const handleUpdateMenuFromCMS = (updatedMenu: MenuItem[]) => {
    setMenuItems(updatedMenu);
    try {
      localStorage.setItem('cafetap_custom_menu', JSON.stringify(updatedMenu));
    } catch {
      // Ignore
    }
  };

  // Save branding updates from CMS
  const handleUpdateBrandingFromCMS = (updatedBranding: CafeBranding) => {
    setBranding(updatedBranding);
    applyDynamicBranding(updatedBranding.hex_warna_utama);
    try {
      localStorage.setItem('cafetap_custom_branding', JSON.stringify(updatedBranding));
    } catch {
      // Ignore
    }
  };

  // Reset to default presets
  const handleResetToDefault = () => {
    try {
      localStorage.removeItem('cafetap_custom_menu');
      localStorage.removeItem('cafetap_custom_branding');
    } catch {
      // Ignore
    }
    const preset = PRESET_CAFES[activePreset] || PRESET_CAFES.lamour;
    setBranding(preset.branding);
    setMenuItems(preset.menu);
    applyDynamicBranding(preset.branding.hex_warna_utama);
  };

  // Re-inject branding if hex is changed manually in settings
  const handleUpdateHex = (hex: string) => {
    const updated = {
      ...branding,
      hex_warna_utama: hex,
    };
    handleUpdateBrandingFromCMS(updated);
  };

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    menuItems.forEach((m) => {
      if (m.kategori) set.add(m.kategori);
    });
    return Array.from(set);
  }, [menuItems]);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: menuItems.length };
    categories.forEach((c) => {
      counts[c] = menuItems.filter((m) => m.kategori === c).length;
    });
    return counts;
  }, [categories, menuItems]);

  // Filtered menu items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Category match
      if (activeCategory !== 'all' && item.kategori !== activeCategory) {
        return false;
      }

      // Dietary filter
      if (selectedDietary !== 'all') {
        if (!item.dietary || !item.dietary.includes(selectedDietary as any)) {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = item.nama_menu.toLowerCase().includes(q);
        const matchesDesc = item.deskripsi?.toLowerCase().includes(q) || false;
        const matchesCat = item.kategori.toLowerCase().includes(q);
        return matchesName || matchesDesc || matchesCat;
      }

      return true;
    });
  }, [menuItems, activeCategory, selectedDietary, searchQuery]);

  // Cart operations
  const handleQuickAdd = (item: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.status_tersedia) return;

    setCart((prev) => {
      const existingIndex = prev.findIndex((c) => c.menuItem.id === item.id && !c.notes);
      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex] = {
          ...copy[existingIndex],
          quantity: copy[existingIndex].quantity + 1,
        };
        return copy;
      }
      return [...prev, { menuItem: item, quantity: 1 }];
    });
  };

  const handleAddToCartWithNotes = (item: MenuItem, quantity: number, notes: string) => {
    setCart((prev) => {
      const cleanNotes = notes.trim();
      const existingIndex = prev.findIndex(
        (c) => c.menuItem.id === item.id && (c.notes || '') === cleanNotes
      );
      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex] = {
          ...copy[existingIndex],
          quantity: copy[existingIndex].quantity + quantity,
        };
        return copy;
      }
      return [...prev, { menuItem: item, quantity, notes: cleanNotes || undefined }];
    });
  };

  const handleUpdateQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((c) => (c.menuItem.id === itemId ? { ...c, quantity: newQty } : c))
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCart((prev) => prev.filter((c) => c.menuItem.id !== itemId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleTableChange = (newTable: string) => {
    setTableNumber(newTable);
    try {
      localStorage.setItem('cafetap_table', newTable);
    } catch {
      // Ignore
    }
  };

  // In-cart quantity map
  const cartQuantities = useMemo(() => {
    const map: Record<string, number> = {};
    cart.forEach((c) => {
      map[c.menuItem.id] = (map[c.menuItem.id] || 0) + c.quantity;
    });
    return map;
  }, [cart]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col selection:bg-amber-200">
      {/* Dynamic Header */}
      <Header
        branding={branding}
        tableNumber={tableNumber}
        onTableClick={() => setIsTableModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenCMS={handleOpenCMSRequest}
      />

      {/* Main Content Layout */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-4 sm:px-6 space-y-5">
        {/* Google Maps 5-Star Review Banner (Key Selling Point) */}
        <GoogleMapsReviewBanner
          reviewUrl={branding.url_review_gmaps}
          cafeName={branding.nama_kafe}
        />

        {/* Loading state or Menu List */}
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <div className="space-y-4">
            {/* Horizontal Category Navigation Bar */}
            <div className="sticky top-[102px] sm:top-[110px] z-20 bg-[#FAF8F5]/95 backdrop-blur-sm -mx-4 px-4 sm:mx-0 sm:px-0 py-1 transition-all">
              <CategoryNav
                categories={categories}
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
                categoryCounts={categoryCounts}
                selectedDietary={selectedDietary}
                onSelectDietary={setSelectedDietary}
              />
            </div>

            {/* Menu Item Grid */}
            {filteredItems.length === 0 ? (
              <div className="py-16 text-center space-y-3 bg-white rounded-3xl border border-stone-200/80 p-8 shadow-xs">
                <div className="w-12 h-12 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-stone-800">
                  Tidak Ada Menu yang Ditemukan
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Coba gunakan kata kunci lain atau pilih kategori yang berbeda.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                    setSelectedDietary('all');
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-xs"
                  style={{ backgroundColor: 'var(--primary-color)' }}
                >
                  Tampilkan Semua Menu
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-5">
                {filteredItems.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    cartQuantity={cartQuantities[item.id] || 0}
                    onOpenDetail={setSelectedDetailItem}
                    onQuickAdd={handleQuickAdd}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Item Customization & Notes Modal */}
      <MenuItemModal
        item={selectedDetailItem}
        isOpen={Boolean(selectedDetailItem)}
        onClose={() => setSelectedDetailItem(null)}
        onAddToCart={handleAddToCartWithNotes}
      />

      {/* Cart Bottom Sheet & Floating Action Button (FAB) */}
      <CartDrawer
        branding={branding}
        cart={cart}
        tableNumber={tableNumber}
        onTableChange={handleTableChange}
        isOpen={isCartOpen}
        onOpen={() => setIsCartOpen(true)}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Social Footer (Conditional Social Links & Info) */}
      <SocialFooter branding={branding} />

      {/* Settings Modal (Presets & Google Sheets & Theme testing) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        activePreset={activePreset}
        onSelectPreset={(key) => {
          setActivePreset(key);
          setCustomSheetUrl('');
        }}
        customSheetUrl={customSheetUrl}
        onSaveSheetUrl={(url) => setCustomSheetUrl(url)}
        currentHex={branding.hex_warna_utama}
        onUpdateHex={handleUpdateHex}
        isLoading={isLoading}
        dataSource={dataSource}
        fetchError={fetchError}
      />

      {/* Table Selector / NFC Tap Modal */}
      <TableModal
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
        currentTable={tableNumber}
        onSelectTable={handleTableChange}
      />

      {/* Admin Authentication Lock Modal */}
      <AdminAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          setIsAdminAuthenticated(true);
          setIsAuthModalOpen(false);
          setIsCMSOpen(true);
        }}
        storedPassword={adminPassword}
      />

      {/* Admin CMS Modal for Editing Menu, Stock & Branding */}
      <AdminCMSModal
        isOpen={isCMSOpen}
        onClose={() => setIsCMSOpen(false)}
        branding={branding}
        onUpdateBranding={handleUpdateBrandingFromCMS}
        menu={menuItems}
        onUpdateMenu={handleUpdateMenuFromCMS}
        onResetToDefault={handleResetToDefault}
        appUrl={typeof window !== 'undefined' ? window.location.origin : 'https://cafetap.app'}
        storedPassword={adminPassword}
        onUpdatePassword={handleUpdatePassword}
        onLogout={handleLogoutCMS}
      />
    </div>
  );
}
