import React from 'react';
import { COLORS } from '../../utils/constants';

const Loader = ({ 
  variant = 'spinner', 
  size = 'md', 
  fullScreen = false,
  text = 'Loading...',
  className = ''
}) => {
  const colors = COLORS;

  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const spinnerSizes = {
    sm: 'w-6 h-6 border-2',
    md: 'w-12 h-12 border-4',
    lg: 'w-16 h-16 border-4',
    xl: 'w-24 h-24 border-4'
  };

  const renderLoader = () => {
    switch (variant) {
      case 'spinner':
        return (
          <div className="flex flex-col items-center gap-4">
            <div
              className={`${spinnerSizes[size]} rounded-full animate-spin`}
              style={{
                borderColor: colors.secondary,
                borderTopColor: colors.primary
              }}
            ></div>
            {text && <p className="text-sm font-medium" style={{ color: colors.textSecondary }}>{text}</p>}
          </div>
        );

      case 'dots':
        return (
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`${sizes[size]} rounded-full animate-bounce`}
                  style={{
                    backgroundColor: colors.primary,
                    animationDelay: `${i * 0.15}s`
                  }}
                ></div>
              ))}
            </div>
            {text && <p className="text-sm font-medium" style={{ color: colors.textSecondary }}>{text}</p>}
          </div>
        );

      case 'pulse':
        return (
          <div className="flex flex-col items-center gap-4">
            <div
              className={`${sizes[size]} rounded-full animate-pulse`}
              style={{ backgroundColor: colors.primary }}
            ></div>
            {text && <p className="text-sm font-medium" style={{ color: colors.textSecondary }}>{text}</p>}
          </div>
        );

      case 'bar':
        return (
          <div className="flex flex-col items-center gap-4 w-full max-w-xs">
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: colors.secondary }}>
              <div
                className="h-full rounded-full animate-progress"
                style={{
                  backgroundColor: colors.primary,
                  width: '100%'
                }}
              ></div>
            </div>
            {text && <p className="text-sm font-medium" style={{ color: colors.textSecondary }}>{text}</p>}
          </div>
        );

      case 'skeleton':
        return (
          <div className={`space-y-4 w-full ${className}`}>
            <div className="flex items-center gap-4">
              <div
                className={`${sizes[size]} rounded-full animate-pulse`}
                style={{ backgroundColor: colors.secondary }}
              ></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 rounded animate-pulse w-3/4" style={{ backgroundColor: colors.secondary }}></div>
                <div className="h-3 rounded animate-pulse w-1/2" style={{ backgroundColor: colors.secondary }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 rounded animate-pulse w-full" style={{ backgroundColor: colors.secondary }}></div>
              <div className="h-3 rounded animate-pulse w-5/6" style={{ backgroundColor: colors.secondary }}></div>
              <div className="h-3 rounded animate-pulse w-4/6" style={{ backgroundColor: colors.secondary }}></div>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center gap-4">
            <div
              className={`${spinnerSizes[size]} rounded-full animate-spin`}
              style={{
                borderColor: colors.secondary,
                borderTopColor: colors.primary
              }}
            ></div>
            {text && <p className="text-sm font-medium" style={{ color: colors.textSecondary }}>{text}</p>}
          </div>
        );
    }
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.8)' }}>
        {renderLoader()}
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center p-4 ${className}`}>
      {renderLoader()}
    </div>
  );
};

export default Loader;