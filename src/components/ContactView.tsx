import { useState } from 'react';
import {
  Clock,
  ExternalLink,
  MapPin,
  MessageCircle,
  Pencil,
  Phone,
  Check,
} from 'lucide-react';
import { Language, ShopSettings } from '../types';
import { UI_COPY } from '../data/translations';
import { sanitizePhoneDigits } from '../utils/format';

interface ContactViewProps {
  shopSettings: ShopSettings;
  lang: Language;
  isAdmin: boolean;
  onUpdateShopSettings: (next: ShopSettings) => Promise<void>;
}

export function ContactView({
  shopSettings,
  lang,
  isAdmin,
  onUpdateShopSettings,
}: ContactViewProps) {
  const t = UI_COPY[lang];
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  const [draft, setDraft] = useState<ShopSettings>(shopSettings);

  const startEditing = () => {
    setDraft(shopSettings);
    setEditing(true);
    setSavedNotice(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onUpdateShopSettings(draft);
      setEditing(false);
      setSavedNotice(true);
      window.setTimeout(() => setSavedNotice(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const cleanWhatsapp = sanitizePhoneDigits(shopSettings.whatsapp);
  const whatsappUrl = `https://wa.me/${cleanWhatsapp.startsWith('91') ? cleanWhatsapp : `91${cleanWhatsapp}`}`;

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4 pb-6 border-b border-white/10 mb-8">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#F5F2EB]">
            {t.contact.title}
          </h1>
          <p className="text-sm text-[#B5AEA2] mt-1.5">{t.contact.subtitle}</p>
        </div>

        {isAdmin && !editing && (
          <button
            type="button"
            onClick={startEditing}
            className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-lg border border-[#D4AF37]/40 text-xs sm:text-sm font-medium text-[#E6C76C] hover:bg-[#D4AF37]/10 transition-colors"
          >
            <Pencil className="w-4 h-4" />
            <span>{t.contact.editPlaceholderBtn}</span>
          </button>
        )}
      </div>

      {savedNotice && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/35 text-sm text-emerald-300 flex items-center gap-2.5">
          <Check className="w-4 h-4 shrink-0" />
          <span>{t.contact.savedToast}</span>
        </div>
      )}

      {editing ? (
        <form
          onSubmit={handleSave}
          className="bg-[#131316] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-5"
        >
          <p className="text-xs text-[#B5AEA2]">{t.contact.editableHint}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#D0C9BD] mb-1.5">
                {t.contact.addressLabel} (English)
              </label>
              <textarea
                rows={2}
                maxLength={400}
                value={draft.address.en}
                onChange={(e) =>
                  setDraft({ ...draft, address: { ...draft.address, en: e.target.value } })
                }
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#0E0E10] border border-white/15 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#D0C9BD] mb-1.5">
                {t.contact.addressLabel} (हिन्दी)
              </label>
              <textarea
                rows={2}
                maxLength={400}
                value={draft.address.hi}
                onChange={(e) =>
                  setDraft({ ...draft, address: { ...draft.address, hi: e.target.value } })
                }
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#0E0E10] border border-white/15 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#D0C9BD] mb-1.5">
                {t.contact.hoursLabel} (English)
              </label>
              <input
                type="text"
                maxLength={200}
                value={draft.openingHours.en}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    openingHours: { ...draft.openingHours, en: e.target.value },
                  })
                }
                className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#0E0E10] border border-white/15 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#D0C9BD] mb-1.5">
                {t.contact.hoursLabel} (हिन्दी)
              </label>
              <input
                type="text"
                maxLength={200}
                value={draft.openingHours.hi}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    openingHours: { ...draft.openingHours, hi: e.target.value },
                  })
                }
                className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#0E0E10] border border-white/15 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#D0C9BD] mb-1.5">
                {t.contact.phoneLabel}
              </label>
              <input
                type="text"
                maxLength={30}
                value={draft.phone}
                onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#0E0E10] border border-white/15 text-sm text-[#F5F2EB] font-mono-tabular focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#D0C9BD] mb-1.5">
                {t.contact.whatsappLabel}
              </label>
              <input
                type="text"
                maxLength={30}
                value={draft.whatsapp}
                onChange={(e) => setDraft({ ...draft, whatsapp: e.target.value })}
                className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#0E0E10] border border-white/15 text-sm text-[#F5F2EB] font-mono-tabular focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#D0C9BD] mb-1.5">
              Google Maps URL
            </label>
            <input
              type="url"
              maxLength={500}
              value={draft.mapUrl}
              onChange={(e) => setDraft({ ...draft, mapUrl: e.target.value })}
              className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-[#0E0E10] border border-white/15 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="min-h-[46px] px-6 py-2.5 rounded-lg bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0A0B] text-sm font-semibold transition-colors disabled:opacity-60"
            >
              {t.contact.saveDetailsBtn}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="min-h-[46px] px-5 py-2.5 rounded-lg border border-white/15 text-sm font-medium text-[#C8C1B4] hover:text-[#F5F2EB] transition-colors"
            >
              {t.contact.cancelEditBtn}
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Showroom Address & Hours */}
          <div className="bg-[#131316] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#E6C76C] shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xs font-semibold text-[#E6C76C] mb-1">
                  {t.contact.addressLabel}
                </h2>
                <p className="text-sm sm:text-base text-[#F5F2EB] leading-relaxed">
                  {shopSettings.address[lang]}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 pt-5 border-t border-white/10">
              <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#E6C76C] shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xs font-semibold text-[#E6C76C] mb-1">
                  {t.contact.hoursLabel}
                </h2>
                <p className="text-sm sm:text-base text-[#F5F2EB]">
                  {shopSettings.openingHours[lang]}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={shopSettings.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 min-h-[46px] w-full sm:w-auto px-5 py-2.5 rounded-lg border border-[#D4AF37]/50 text-sm font-semibold text-[#E6C76C] hover:bg-[#D4AF37]/10 transition-colors"
              >
                <span>{t.contact.openMap}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Direct Phone & WhatsApp Contact */}
          <div className="bg-[#131316] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#E6C76C] shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xs font-semibold text-[#E6C76C] mb-1">
                    {t.contact.phoneLabel}
                  </h2>
                  <p className="font-mono-tabular text-lg font-semibold text-[#F5F2EB]">
                    {shopSettings.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-5 border-t border-white/10">
                <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#E6C76C] shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xs font-semibold text-[#E6C76C] mb-1">
                    {t.contact.whatsappLabel}
                  </h2>
                  <p className="font-mono-tabular text-lg font-semibold text-[#F5F2EB]">
                    {shopSettings.whatsapp}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <a
                href={`tel:${shopSettings.phone.replace(/\s+/g, '')}`}
                className="flex-1 inline-flex items-center justify-center gap-2 min-h-[46px] px-5 py-2.5 rounded-lg bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0A0B] text-sm font-semibold transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>{t.contact.callNow}</span>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 min-h-[46px] px-5 py-2.5 rounded-lg border border-white/20 hover:border-[#D4AF37]/60 text-[#F5F2EB] text-sm font-semibold transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#E6C76C]" />
                <span>{t.contact.chatWhatsapp}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
