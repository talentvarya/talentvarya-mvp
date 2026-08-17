import React from 'react';

interface TalentVaryaEmblemProps {
  className?: string;
  size?: number | string;
}

export const TalentVaryaEmblem: React.FC<TalentVaryaEmblemProps> = ({ 
  className = 'w-9 h-9',
  size 
}) => {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <svg 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      style={style}
    >
      {/* Top Left Gold / Ochre Arc */}
      <path
        d="M 45 65 A 72 72 0 0 1 140 28"
        stroke="#cca326"
        strokeWidth="15"
        strokeLinecap="round"
        fill="none"
      />

      {/* Gold Inner Accent Wedge between figures */}
      <path
        d="M 88 128 L 108 92 L 126 128 Z"
        fill="#cca326"
      />

      {/* Green Outer Ring with Rising Arrow */}
      {/* Bottom to right arc */}
      <path
        d="M 60 162 A 75 75 0 0 0 162 90 L 165 72"
        stroke="#00a651"
        strokeWidth="15"
        strokeLinecap="round"
        fill="none"
      />

      {/* Arrowhead at Top-Right */}
      <polygon
        points="145,55 178,35 186,75 168,66 156,76"
        fill="#00a651"
      />

      {/* Navy Person - Head */}
      <circle 
        cx="72" 
        cy="72" 
        r="18" 
        fill="#051d40" 
      />

      {/* Navy Person - Stylized Body & Outstretched Arm */}
      <path
        d="M 22 75 L 75 92 L 95 106 L 102 165 C 92 166 75 158 68 150 L 52 108 L 22 75 Z"
        fill="#051d40"
      />

      {/* Green Person - Head */}
      <circle 
        cx="128" 
        cy="70" 
        r="18" 
        fill="#00a651" 
      />

      {/* Green Person - Rising Body pointing toward the arrow */}
      <path
        d="M 112 104 L 148 54 L 160 62 L 124 165 C 114 166 106 148 106 138 Z"
        fill="#00a651"
      />
    </svg>
  );
};
