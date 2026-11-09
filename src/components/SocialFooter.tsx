import React from 'react';
import { CafeBranding } from '../types/cafe';
import { Instagram, MapPin, Clock, Star, Radio } from 'lucide-react';
import { TikTokIcon, GoogleIcon } from './Icons';

interface SocialFooterProps {
  branding: CafeBranding;
}

export function SocialFooter({ branding }: SocialFooterProps) {
  const hasInstagram = Boolean(branding.url_instagram && branding.url_instagram.trim() !== '');
  const hasTikTok = Boolean(branding.url_tiktok && branding.url_tiktok.trim() !== '');
  const hasGmaps = Boolean(branding.url_review_gmaps && branding.url_review_gmaps.trim() !== '');

  return (
    <footer className="mt-12 bg-stone-900 text-stone-300 border-t border-stone-800">
      <div className="max-w-4xl mx-auto px-4 py-10 sm:px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-stone-800">
          {/* Brand & Tagline */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <img
                src={branding.url_logo}
                alt={branding.nama_kafe}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-stone-700"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=100';
                }}
              />
              <span className="text-lg font-bold text-white tracking-tight">
                {branding.nama_kafe}
              </span>
            </div>
            {branding.deskripsi && (
              <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
                {branding.deskripsi}
              </p>
            )}
          </div>

          {/* Social Links (Conditionally rendered!) */}
          <div className="flex flex-col sm:items-end gap-2.5">
            <span className="text-xs uppercase font-semibold tracking-wider text-stone-400">
              Terhubung Bersama Kami
            </span>
            <div className="flex items-center gap-3">
              {/* Instagram: only shown if url_instagram exists */}
              {hasInstagram && (
                <a
                  href={branding.url_instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Ikuti Instagram ${branding.nama_kafe}`}
                  className="p-2.5 rounded-full bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700 transition"
                  title="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}

              {/* TikTok: only shown if url_tiktok exists */}
              {hasTikTok && (
                <a
                  href={branding.url_tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Ikuti TikTok ${branding.nama_kafe}`}
                  className="p-2.5 rounded-full bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700 transition"
                  title="TikTok"
                >
                  <TikTokIcon className="w-5 h-5" />
                </a>
              )}

              {/* Google Maps Review */}
              {hasGmaps && (
                <a
                  href={branding.url_review_gmaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Beri ulasan di Google Maps`}
                  className="p-2.5 rounded-full bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700 transition"
                  title="Google Maps Review"
                >
                  <GoogleIcon className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Operational details & Location */}
        <div className="py-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-stone-400">
          {branding.alamat && (
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
              <span>{branding.alamat}</span>
            </div>
          )}
          {branding.jam_operasional && (
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
              <span>{branding.jam_operasional}</span>
            </div>
          )}
        </div>

        {/* Bottom copyright & Cafetap badge */}
        <div className="pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} {branding.nama_kafe}. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-1.5 text-stone-400 bg-stone-800/60 px-3 py-1 rounded-full border border-stone-800">
            <Radio className="w-3.5 h-3.5 text-amber-500" />
            <span>Didukung oleh <strong className="text-stone-200">Cafetap</strong> • Smart NFC Ordering</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
