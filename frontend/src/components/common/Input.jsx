import React, { useState } from 'react';
import { COLORS } from '../../utils/constants';

const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium mb-1.5" style={{ color: COLORS.primary }}>
          {label}
          {required && <span className="ml-1" style={{ color: COLORS.primary }}>*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors"
        style={{
          borderColor: error ? '#EF4444' : (isFocused ? COLORS.primary : COLORS.secondary),
          color: COLORS.primaryDark
        }}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs" style={{ color: '#EF4444' }}>{error}</p>
      )}
    </div>
  );
};

export default Input;