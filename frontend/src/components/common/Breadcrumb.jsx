import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { COLORS } from '../../utils/constants';

const Breadcrumb = ({ pageName }) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pb-6">
      <h2 className="text-xl font-semibold" style={{ color: COLORS.primary }}>
        {pageName}
      </h2>
      <nav>
        <ol className="flex items-center gap-1.5">
          <li>
            <Link to="/" className="inline-flex items-center gap-1.5 text-sm" style={{ color: COLORS.primary }}>
              Home
              <svg className="stroke-current" width="17" height="16" viewBox="0 0 17 16" fill="none">
                <path d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366" stroke={COLORS.primary} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </li>
          {pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;
            return (
              <li key={name} className="text-sm" style={{ color: COLORS.primary }}>
                {isLast ? (
                  <span>{name.charAt(0).toUpperCase() + name.slice(1)}</span>
                ) : (
                  <Link to={routeTo}>{name.charAt(0).toUpperCase() + name.slice(1)}</Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;