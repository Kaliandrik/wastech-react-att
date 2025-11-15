// dashboard/tela_inicial/components/Header.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { usePlants } from '../../hooks/usePlants'; // ✅ IMPORTAR usePlants
import { auth } from '../../firebase/config';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const { userLevel } = usePlants(); // ✅ PEGAR O NÍVEL DO HOOK
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Função de logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("✅ Usuário deslogado com sucesso!");
      navigate('/login');
    } catch (error) {
      console.error('❌ Erro ao fazer logout:', error);
    }
  };

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

          {/* Profile - Desktop */}
          <div className="relative" ref={dropdownRef}>
            <div 
              className="flex items-center space-x-3 cursor-pointer bg-green-50 hover:bg-green-100 px-3 py-2 rounded-lg transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setDropdownOpen(!dropdownOpen);
              }}
            >
              <img 
                src={user?.photoURL || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwktGunb0a4j8gZGwCIvKQiq9pf1n8bGA0QkfqzYx0jsz12RU9syffpA2SZ6svdnUovOg&usqp=CAU"} 
                alt="Usuário" 
                className="w-8 h-8 rounded-full border-2 border-green-200"
              />
              <div className="hidden lg:flex flex-col items-start">
                <span className="font-semibold text-green-700 text-sm">{user?.displayName || 'Usuário'}</span>
                <span className="flex items-center space-x-1 text-xs text-green-600">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd"/>
                  </svg>
                  {/* ✅ NÍVEL DINÂMICO */}
                  <span>Nv. {userLevel}</span>
                </span>
              </div>
              <svg className={`w-4 h-4 text-green-600 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </div>

            {/* Dropdown Menu - Desktop */}
            {dropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user?.displayName || 'Usuário'}</p>
                  <p className="text-sm text-gray-500">{user?.email || 'wastech@gmail.com'}</p>
                  {/* ✅ NÍVEL NO DROPDOWN */}
                  <p className="text-xs text-green-600 font-medium mt-1">Nível {userLevel}</p>
                </div>
                
                <a href="/profile" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-green-50 transition-colors">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                  </svg>
                  <span>Meu Perfil</span>
                </a>
                
                <a href="#configuracoes" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-green-50 transition-colors">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
                  </svg>
                  <span>Configurações</span>
                </a>
                
                <a href="#ajuda" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-green-50 transition-colors">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
                  </svg>
                  <span>Ajuda & Suporte</span>
                </a>
                
                <div className="border-t border-gray-100 my-1"></div>
                
                <button 
                  onClick={handleLogout}
                  className="w-full text-left flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"/>
                  </svg>
                  <span>Sair</span>
                </button>
              </div>
            )}
          </div>
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
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-green-50 text-green-600"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 p-4 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
              </svg>
              <span className="font-medium">(88) 93423-4323</span>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
              </svg>
              <span className="font-medium">wastech@gmail.com</span>
            </div>
          </div>

          <button className="w-full flex items-center justify-center space-x-2 bg-green-50 hover:bg-green-100 p-3 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
            </svg>
            <span className="font-medium">Notificações</span>
          </button>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <img 
                src={user?.photoURL || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwktGunb0a4j8gZGwCIvKQiq9pf1n8bGA0QkfqzYx0jsz12RU9syffpA2SZ6svdnUovOg&usqp=CAU"} 
                alt="Usuário" 
                className="w-10 h-10 rounded-full border-2 border-green-200"
              />
              <div>
                <p className="font-semibold text-green-700">{user?.displayName || 'Usuário'}</p>
                {/* ✅ NÍVEL DINÂMICO NO MOBILE */}
                <p className="text-sm text-green-600">Nv. {userLevel}</p>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 bg-red-50 hover:bg-red-100 p-3 rounded-lg transition-colors mt-3 text-red-600"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"/>
              </svg>
              <span className="font-medium">Sair</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};