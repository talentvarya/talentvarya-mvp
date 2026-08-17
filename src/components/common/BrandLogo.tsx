import React from 'react';
import { TalentVaryaEmblem } from './TalentVaryaEmblem';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showIcon?: boolean;
  theme?: 'light' | 'dark' | 'auto';
  subText?: string;
  className?: string;
  casing?: 'TalentVarya' | 'Talentvarya';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showIcon = true,
  theme = 'light',
  subText,
  className = '',
  casing = 'TalentVarya'
}) => {
  const emblemSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9 sm:w-10 sm:h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-3xl sm:text-4xl',
    '2xl': 'text-4xl sm:text-5xl'
  };

  // Navy blue color matching the logo (#041e42)
  const talentColor = theme === 'dark' ? 'text-blue-400' : 'text-[#041e42]';
  // Green color matching the logo (#00a651)
  const varyaColor = theme === 'dark' ? 'text-[#10b981]' : 'text-[#00a651]';

  const varyaText = casing === 'Talentvarya' ? 'varya' : 'Varya';

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {showIcon && (
        <div className="relative flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
          {/* For dark themes, give a subtle clean backdrop so the dark navy figure is crisp */}
          {theme === 'dark' ? (
            <div className="p-1 rounded-2xl bg-white/95 shadow-sm">
              <TalentVaryaEmblem className={emblemSizes[size]} />
            </div>
          ) : (
            <TalentVaryaEmblem className={emblemSizes[size]} />
          )}
        </div>
      )}
      <div className="flex flex-col text-left leading-none">
        <span className={`${textSizes[size]} font-black tracking-tight flex items-center`}>
          <span className={talentColor}>Talent</span>
          <span className={varyaColor}>{varyaText}</span>
        </span>
        {subText && (
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mt-1">
            {subText}
          </span>
        )}
      </div>
    </div>
  );
};
