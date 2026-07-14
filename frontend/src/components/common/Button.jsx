import React from 'react';
import { COLORS } from '../../utils/constants';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  onClick,
  disabled = false,
  type = 'button'
}) => {
  const variants = {
    primary: {
      bg: COLORS.primary,
      hoverBg: COLORS.primaryDark,
      text: "white",
      border: COLORS.primaryDark
    },
    secondary: {
      bg: COLORS.secondary,
      hoverBg: COLORS.secondaryLight,
      text: COLORS.primary,
      border: COLORS.secondary
    }
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const variantStyle = variants[variant] || variants.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2 rounded-lg border font-medium transition-colors
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      style={{
        backgroundColor: variantStyle.bg,
        color: variantStyle.text,
        borderColor: variantStyle.border
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = variantStyle.hoverBg;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = variantStyle.bg;
        }
      }}
    >
      {children}
    </button>
  );
};

export default Button;