import React from 'react';
import Link from 'next/link';

export interface HeaderProps {
  title?: string;
  onMenuToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  title = 'Rubrics Management System',
  onMenuToggle 
}) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 relative z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side */}
          <div className="flex">
            {/* Mobile menu button */}
            {onMenuToggle && (
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
                onClick={onMenuToggle}
                aria-label="Open menu"
              >
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            )}
            
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                {title}
              </Link>
            </div>

            {/* Desktop navigation */}
            {/*<nav className="hidden md:ml-6 md:flex md:space-x-4">*/}
            {/*  <Link href="/rubrics" className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100">*/}
            {/*    Rubrics*/}
            {/*  </Link>*/}
            {/*</nav>*/}
          </div>

          {/* Right side */}
          <div className="flex items-center">
            {/* User menu - can be expanded later */}
            <div className="ml-3 relative">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 mr-2">Admin</span>
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;