import React from 'react';
import { FloatingText } from '../types/game';

interface ParticlesOverlayProps {
  floatingTexts: FloatingText[];
}

export const ParticlesOverlay: React.FC<ParticlesOverlayProps> = ({ floatingTexts }) => {
  if (floatingTexts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {floatingTexts.map(item => (
        <div
          key={item.id}
          className="absolute font-display font-black text-lg sm:text-xl drop-shadow-md animate-float-up whitespace-nowrap"
          style={{
            left: `${item.x}px`,
            top: `${item.y}px`,
            color: item.color,
            transform: item.scale ? `scale(${item.scale})` : undefined,
          }}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
};
