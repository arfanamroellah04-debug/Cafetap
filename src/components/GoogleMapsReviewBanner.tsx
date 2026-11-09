import React from 'react';
import { Star, ExternalLink, Sparkles } from 'lucide-react';
import { GoogleIcon } from './Icons';

interface GoogleMapsReviewBannerProps {
  reviewUrl: string;
  cafeName: string;
}

export function GoogleMapsReviewBanner({ reviewUrl, cafeName }: GoogleMapsReviewBannerProps) {
  if (!reviewUrl || reviewUrl.trim() === '') return null;

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/10 via-stone-50 to-amber-500/5 border border-amber-200/80 p-4 sm:p-5 shadow-sm transition hover:shadow-md">
      {/* Decorative accent orb */}
      <div
        className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-20 blur-xl pointer-events-none"
        style={{ backgroundColor: 'var(--primary-color)' }}
      />

      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left copy & stars */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-amber-700 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Dukungan Anda Sangat Berarti</span>
          </div>

          <div className="flex items-center gap-1 text-amber-400">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400 drop-shadow-xs" />
            ))}
            <span className="ml-1.5 text-xs font-bold text-stone-700">5.0 • Google Maps Review</span>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight leading-snug">
            Suka dengan pelayanan & hidangan di {cafeName}?
          </h2>
          <p className="text-xs text-stone-600 max-w-md leading-relaxed">
            Tinggalkan ulasan bintang 5 Anda di Google Maps. Kami sangat berterima kasih atas setiap apresiasi dari Anda!
          </p>
        </div>

        {/* Action Button */}
        <div className="shrink-0 flex items-center">
          <a
            href={reviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Beri ulasan bintang 5 untuk ${cafeName} di Google Maps`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-stone-900 bg-white hover:bg-stone-50 border border-stone-300 shadow-sm hover:shadow transition transform active:scale-98"
          >
            <GoogleIcon className="w-4 h-4" />
            <span className="font-bold">Beri Ulasan Bintang 5</span>
            <ExternalLink className="w-3.5 h-3.5 text-stone-400 ml-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
