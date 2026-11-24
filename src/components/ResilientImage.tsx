import { useState } from 'react';
import { LampCeiling } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export function ResilientImage({
  src,
  alt,
  className = 'w-full h-full object-cover',
  fallbackTitle,
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#191815] via-[#121214] to-[#0A0A0B] border border-[#E6C76C]/20 p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="w-12 h-12 rounded-full bg-[#E6C76C]/10 border border-[#E6C76C]/30 flex items-center justify-center mb-3 text-[#E6C76C]">
          <LampCeiling className="w-6 h-6" />
        </div>
        {fallbackTitle && (
          <p className="text-sm font-medium text-[#E6C76C] max-w-[18ch] leading-snug">
            {fallbackTitle}
          </p>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
      loading="lazy"
    />
  );
}
