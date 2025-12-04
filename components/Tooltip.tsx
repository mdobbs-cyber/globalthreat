import React, { useState } from 'react';
import { Theme } from '../types';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  theme: Theme;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, theme, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Styles based on theme
  const tooltipStyle = {
    backgroundColor: theme.colors.panelBg,
    borderColor: theme.colors.accent,
    color: theme.colors.textPrimary,
    boxShadow: `0 0 10px ${theme.colors.accent}22`,
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div 
      className="relative flex items-center justify-center w-fit"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <div 
          className={`absolute z-50 px-2 py-1 text-[10px] font-mono rounded border backdrop-blur-md whitespace-nowrap pointer-events-none transition-all duration-200 ${positionClasses[position]} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}
          style={tooltipStyle}
      >
        {content}
      </div>
    </div>
  );
};

export default Tooltip;