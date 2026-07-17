import React from 'react';
import { COLORS } from '../../utils/constants';

const Card = ({ 
  children, 
  className = '',
  hoverable = false,
  noPadding = false
}) => {
  return (
    <div 
      className={`
        rounded-2xl border transition-shadow
        ${noPadding ? '' : 'p-5 lg:p-6'}
        ${hoverable ? 'hover:shadow-lg' : ''}
        ${className}
      `}
      style={{
        borderColor: COLORS.secondary,
        backgroundColor: '#FFFFFF'
      }}
    >
      {children}
    </div>
  );
};

export default Card;