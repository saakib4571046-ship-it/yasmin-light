import { LogIn, LogOut, ShieldAlert } from 'lucide-react';
import { Language } from '../types';

interface AuthGateCardProps {
  lang: Language;
  title: string;
  subtitle: string;
  signedInEmail?: string | null;
  isUnauthorizedAdmin?: boolean;
  loading?: boolean;
  onSignIn: () => void;
  onSignOut?: () => void;
}

export function AuthGateCard({
  lang,
  title,
  subtitle,
  signedInEmail,
  isUnauthorizedAdmin = false,
  loading = false,
  onSignIn,
  onSignOut,
}: AuthGateCardProps) {
  return (
    <div className="bg-[#131316] border border-[#D4AF37]/30 rounded-2xl p-6 sm:p-8 max-w-xl mx-auto text-center space-y-5">
      <div className="w-12 h-12 mx-auto rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#E6C76C]">
        {isUnauthorizedAdmin ? (
          <ShieldAlert className="w-6 h-6" />
        ) : (
          <LogIn className="w-6 h-6" />
        )}
      </div>

      <div className="space-y-2">
        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#F5F2EB]">
          {title}
        </h2>
        <p className="text-sm text-[#C8C1B4] leading-relaxed">{subtitle}</p>
        {signedInEmail && (
          <p className="text-xs font-mono-tabular text-[#E6C76C] pt-1">
            {signedInEmail}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
        {!signedInEmail ? (
          <button
            type="button"
            disabled={loading}
            onClick={onSignIn}
            className="inline-flex items-center justify-center gap-2 min-h-[46px] px-6 py-2.5 rounded-lg bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0A0B] text-sm font-semibold transition-colors disabled:opacity-60"
          >
            <LogIn className="w-4 h-4" />
            <span>
              {lang === 'hi' ? 'Google से साइन इन करें' : 'Sign in with Google'}
            </span>
          </button>
        ) : (
          onSignOut && (
            <button
              type="button"
              onClick={onSignOut}
              className="inline-flex items-center justify-center gap-2 min-h-[46px] px-5 py-2.5 rounded-lg border border-white/20 hover:border-[#D4AF37]/60 text-[#F5F2EB] text-sm font-medium transition-colors"
            >
              <LogOut className="w-4 h-4 text-[#E6C76C]" />
              <span>
                {lang === 'hi' ? 'अकाउंट बदलें / साइन आउट' : 'Switch Account / Sign Out'}
              </span>
            </button>
          )
        )}
      </div>
    </div>
  );
}
