import React, { useRef } from 'react';

interface CategoryNavProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  categoryCounts: Record<string, number>;
  selectedDietary: string;
  onSelectDietary: (diet: string) => void;
}

export function CategoryNav({
  categories,
  activeCategory,
  onSelectCategory,
  categoryCounts,
  selectedDietary,
  onSelectDietary,
}: CategoryNavProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const dietaryFilters = [
    { id: 'all', label: 'Semua Menu' },
    { id: 'halal', label: '🌙 Halal' },
    { id: 'vegetarian', label: '🥗 Vegetarian' },
    { id: 'vegan', label: '🌱 Vegan' },
  ];

  return (
    <div className="space-y-2 py-2">
      {/* Category Pills horizontal swipe */}
      <div
        ref={scrollRef}
        role="tablist"
        aria-label="Kategori Menu"
        className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 -mx-4 px-4 sm:mx-0 sm:px-0"
      >
        <button
          role="tab"
          aria-selected={activeCategory === 'all'}
          onClick={() => onSelectCategory('all')}
          className={`shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 shadow-xs flex items-center gap-1.5 ${
            activeCategory === 'all'
              ? 'text-white shadow-sm'
              : 'bg-white text-stone-600 hover:bg-stone-100 hover:text-stone-900 border border-stone-200/80'
          }`}
          style={
            activeCategory === 'all'
              ? {
                  backgroundColor: 'var(--primary-color)',
                  color: 'var(--primary-contrast)',
                }
              : undefined
          }
        >
          <span>Semua</span>
          <span
            className={`text-[11px] px-1.5 py-0.2 rounded-md ${
              activeCategory === 'all' ? 'bg-white/20' : 'bg-stone-100 text-stone-500'
            }`}
          >
            {categoryCounts['all'] || 0}
          </span>
        </button>

        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          const count = categoryCounts[cat] || 0;

          return (
            <button
              key={cat}
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelectCategory(cat)}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 shadow-xs flex items-center gap-1.5 ${
                isActive
                  ? 'text-white shadow-sm'
                  : 'bg-white text-stone-600 hover:bg-stone-100 hover:text-stone-900 border border-stone-200/80'
              }`}
              style={
                isActive
                  ? {
                      backgroundColor: 'var(--primary-color)',
                      color: 'var(--primary-contrast)',
                    }
                  : undefined
              }
            >
              <span>{cat}</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-md ${
                  isActive ? 'bg-white/20' : 'bg-stone-100 text-stone-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Dietary Sub-filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-xs text-stone-500">
        <span className="shrink-0 text-[11px] uppercase tracking-wider text-stone-400 font-semibold mr-1">
          Filter:
        </span>
        {dietaryFilters.map((diet) => {
          const isSelected = selectedDietary === diet.id;
          return (
            <button
              key={diet.id}
              onClick={() => onSelectDietary(diet.id)}
              className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                isSelected
                  ? 'bg-stone-900 text-white font-semibold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70'
              }`}
            >
              {diet.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
