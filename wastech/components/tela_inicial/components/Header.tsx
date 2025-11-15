// dashboard/components/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  return (
    <header className="bg-white text-green-600 border-b border-gray-200 shadow-sm">
      {/* Desktop Header */}
      <div className="hidden md:flex items-center justify-between p-4">
        {/* Logo */}
        <div className="flex items-center">
          <img 
            src="/Imagens/logoverde.jpeg" 
            alt="WASTECH Logo" 
            className="h-16 md:h-20"
          />
        </div>

        {/* Contact Info - Desktop */}
        <div className="hidden lg:flex items-center space-x-6">
          <div className="flex items-center space-x-3 bg-green-50 px-4 py-2 rounded-lg">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
            </svg>
            <span className="font-medium">(88) 93423-4323</span>
          </div>

          <div className="flex items-center space-x-3 bg-green-50 px-4 py-2 rounded-lg">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
            </svg>
            <span className="font-medium">wastech@gmail.com</span>
          </div>
        </div>

        {/* Right Section - Desktop */}
        <div className="flex items-center space-x-4">
          <button className="hidden lg:flex items-center space-x-2 bg-green-50 hover:bg-green-100 px-4 py-2 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
            </svg>
            <span className="font-medium">Notificações</span>
          </button>

          {/* Botões de Autenticação */}
          <div className="flex items-center space-x-3">
            <Link to="/login">
              <button className="bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-300 font-medium">
                Login
              </button>
            </Link>
            
            <Link to="/cadastro">
              <button className="border border-green-800 text-green-800 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors duration-300 font-medium">
                Cadastrar
              </button>
            </Link>
          </div>

          {/* Ajuda */}
          <Link to="/suporte" className="hidden lg:flex items-center space-x-2 text-green-600 hover:text-green-700 px-3 py-2 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
            </svg>
            <span className="font-medium">Ajuda</span>
          </Link>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4">
        <div className="flex items-center">
          <img 
            src="/Imagens/logoverde.jpeg" 
            alt="WASTECH Logo" 
            className="h-12"
          />
        </div>

        <div className="flex items-center space-x-3">
          {/* Botões Mobile */}
          <div className="flex items-center space-x-2">
            <Link to="/login">
              <button className="bg-green-800 text-white px-3 py-2 rounded-lg text-sm font-medium">
                Login
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="p-2 rounded-lg bg-green-50 text-green-600">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};