// dashboard/components/Navbar.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white text-green-600 border-b border-gray-200 shadow-sm">
      {/* Desktop Nav */}
      <div className="hidden md:flex items-center justify-between p-4">
        {/* Menu Items */}
        <div className="flex items-center space-x-6">
          <Link to="/dashboard" className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all group hover:bg-green-50">
            <svg className="w-5 h-5 text-green-600 group-hover:text-green-700" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
            </svg>
            <span className="font-medium group-hover:text-green-700">Início</span>
          </Link>

          <Link to="/ferramentas" className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all group hover:bg-green-50">
            <svg className="w-5 h-5 text-green-600 group-hover:text-green-700" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd"/>
            </svg>
            <span className="font-medium group-hover:text-green-700">Ferramentas</span>
          </Link>

          <a href="#plantas" className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all group hover:bg-green-50">
            <svg className="w-5 h-5 text-green-600 group-hover:text-green-700" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd"/>
            </svg>
            <span className="font-medium group-hover:text-green-700">Plantas</span>
          </a>

          <a href="#calendario" className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all group hover:bg-green-50">
            <svg className="w-5 h-5 text-green-600 group-hover:text-green-700" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
            </svg>
            <span className="font-medium group-hover:text-green-700">Calendário</span>
          </a>

          <Link to="/profile" className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all group hover:bg-green-50">
            <svg className="w-5 h-5 text-green-600 group-hover:text-green-700" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
            </svg>
            <span className="font-medium group-hover:text-green-700">Meu Perfil</span>
          </Link>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden">
        <div className="flex items-center justify-between p-4">
          <span className="text-lg font-semibold text-green-700">Menu</span>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-green-50 text-green-600"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              {mobileMenuOpen ? (
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
              ) : (
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu Items */}
        {mobileMenuOpen && (
          <div className="px-4 pb-4 space-y-2">
            <Link 
              to="/dashboard" 
              className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg transition-all group"
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
              </svg>
              <span className="font-medium">Início</span>
            </Link>

            <Link 
              to="/ferramentas" 
              className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg transition-all group"
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd"/>
              </svg>
              <span className="font-medium">Ferramentas</span>
            </Link>

            <a 
              href="#plantas" 
              className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg transition-all group"
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd"/>
              </svg>
              <span className="font-medium">Plantas</span>
            </a>

            <a 
              href="#calendario" 
              className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg transition-all group"
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
              </svg>
              <span className="font-medium">Calendário</span>
            </a>

            <Link 
              to="/profile" 
              className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg transition-all group"
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
              </svg>
              <span className="font-medium">Meu Perfil</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};