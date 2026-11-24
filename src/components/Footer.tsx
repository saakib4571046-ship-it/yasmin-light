import { AppView, Language, ShopSettings } from '../types';
import { UI_COPY } from '../data/translations';

interface FooterProps {
  shopSettings: ShopSettings;
  lang: Language;
  onNavigate: (view: AppView) => void;
}

export function Footer({ shopSettings, lang, onNavigate }: FooterProps) {
  const t = UI_COPY[lang];

  return (
    <footer className="border-t border-white/10 bg-[#080809] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-5 space-y-2.5">
          <p className="font-display text-2xl font-semibold text-[#F5F2EB]">
            {shopSettings.shopName}
          </p>
          <p className="text-sm text-[#E6C76C]">{shopSettings.tagline[lang]}</p>
          <p className="text-xs text-[#8D867B] pt-2">
            © {new Date().getFullYear()} {shopSettings.shopName}. {t.footer.rights}
          </p>
        </div>

        <div className="md:col-span-3 space-y-2.5">
          <p className="text-xs font-semibold text-[#E6C76C]">{t.footer.quickLinks}</p>
          <ul className="space-y-2 text-sm text-[#C8C1B4]">
            <li>
              <button
                type="button"
                onClick={() => onNavigate('catalog')}
                className="hover:text-[#E6C76C] transition-colors"
              >
                {t.nav.catalog}
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onNavigate('track-order')}
                className="hover:text-[#E6C76C] transition-colors"
              >
                {t.nav.trackOrder}
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onNavigate('contact')}
                className="hover:text-[#E6C76C] transition-colors"
              >
                {t.nav.contact}
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onNavigate('admin')}
                className="hover:text-[#E6C76C] transition-colors"
              >
                {t.nav.admin}
              </button>
            </li>
          </ul>
        </div>

        <div className="md:col-span-4 space-y-2">
          <p className="text-xs font-semibold text-[#E6C76C]">{t.footer.visitUs}</p>
          <p className="text-sm text-[#C8C1B4] leading-relaxed">
            {shopSettings.address[lang]}
          </p>
          <p className="text-xs text-[#9C958A]">{shopSettings.openingHours[lang]}</p>
          <p className="font-mono-tabular text-sm text-[#F5F2EB] pt-1">
            {shopSettings.phone}
          </p>
        </div>
      </div>
    </footer>
  );
}
