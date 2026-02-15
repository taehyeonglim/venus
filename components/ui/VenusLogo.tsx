
import React from 'react';

export const VenusLogo = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <path d="M20 70 Q10 20 50 10 Q90 20 80 70" fill="none" stroke="#FFB7C5" strokeWidth="3"/>
    <path d="M20 70 L50 80 L80 70" fill="none" stroke="#FFB7C5" strokeWidth="3"/>
    <path d="M50 80 V10 M35 75 L50 10 L65 75" fill="none" stroke="#FFB7C5" strokeWidth="1"/>
    <circle cx="50" cy="65" r="10" fill="#9FE2BF" stroke="#fff" strokeWidth="2"/>
  </svg>
);
