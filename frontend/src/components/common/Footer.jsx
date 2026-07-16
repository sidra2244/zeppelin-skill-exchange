// components/common/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { COLORS } from '../../utils/constants';

const Footer = () => {
  const colors = COLORS;

  return (
    <footer 
      className="bg-gray-900 text-white py-4"
    
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm" style={{ color: colors.white }}>
            © {new Date().getFullYear()} SkillExchange. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;