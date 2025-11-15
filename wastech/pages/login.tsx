import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import { Link } from "react-router-dom";

function Login() {
  // ========== ESTADOS DO COMPONENTE ==========
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string, isSuccess: boolean } | null>(null);

  // ========== CONFIGURAÇÕES ==========
  const errorMessages: { [key: string]: string } = {
    "auth/invalid-email": "E-mail inválido",
    "auth/user-not-found": "E-mail não cadastrado",
    "auth/wrong-password": "Senha incorreta",
    "auth/too-many-requests": "Muitas tentativas. Tente novamente em alguns minutos.",
    "auth/invalid-login-credentials": "Credenciais inválidas. Verifique seu e-mail e senha."
  };

  // ========== FUNÇÕES ==========
  const showMessage = (text: string, isSuccess = false) => {
    setMessage({ text, isSuccess });
    setTimeout(() => setMessage(null), 5000);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      showMessage('Preencha todos os campos');
      return;
    }

    setLoading(true);

    try {
      console.log("🔐 Tentando login com:", email);
      
      // ✅ LOGIN SIMPLIFICADO - SEM VERIFICAÇÃO DO FIRESTORE
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log("✅ Login bem-sucedido:", user.uid);
      
      // SALVAR EMAIL SE "LEMBRAR-ME"
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      
      // ✅ REDIRECIONAMENTO DIRETO
      showMessage('Login realizado com sucesso!', true);
      
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
      
    } catch (error: unknown) {
      console.error("Erro no login:", error);
      const errorCode = (error as { code?: string })?.code;
      const errorMessage = errorMessages[errorCode || ''] || "Erro ao fazer login. Tente novamente.";
      showMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ========== EFFECTS ==========
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('from') === 'reset') {
      showMessage('Senha redefinida com sucesso! Faça login com sua nova senha.', true);
    }
  }, []);

  // ========== RENDERIZAÇÃO ==========
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center p-5">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          
          {/* LADO ESQUERDO - LOGO */}
          <div className="flex-1 bg-gradient-to-br from-green-400 to-green-900 flex items-center justify-center p-10 md:min-h-[550px]">
            <img 
              src="/Imagens/logobranca.png" 
              alt="Logo Wastech" 
              className="max-w-full h-auto max-h-48 md:max-h-80 transition-transform duration-500 hover:scale-105"
            />
          </div>

          {/* LADO DIREITO - FORMULÁRIO */}
          <div className="flex-1 p-10 flex flex-col justify-center">
            <div className="login-form">
              
              {/* MENSAGENS DE FEEDBACK */}
              {message && (
                <div className={`p-4 mb-6 rounded-lg ${
                  message.isSuccess 
                    ? 'bg-green-100 text-green-700 border border-green-300' 
                    : 'bg-red-100 text-red-700 border border-red-300'
                }`}>
                  {message.text}
                </div>
              )}

              {/* CABEÇALHO */}
              <div className="mb-8">
                <h1 className="text-2xl font-medium text-gray-800 mb-2">Bem-vindo de volta</h1>
                <p className="text-gray-500 font-light text-sm">Entre com sua conta para continuar</p>
              </div>

              {/* FORMULÁRIO */}
              <form onSubmit={handleLogin} className="space-y-6">
                
                {/* CAMPO EMAIL */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-mail
                  </label>
                  <div className="relative">
                    {/* Ícone de email (Heroicons) */}
                    <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-300"
                      placeholder="seu.email@exemplo.com"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* CAMPO SENHA */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Senha
                  </label>
                  <div className="relative">
                    {/* Ícone de cadeado (Heroicons) */}
                    <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-300"
                      placeholder="••••••••"
                      required
                      disabled={loading}
                    />
                    {/* Botão mostrar/ocultar senha */}
                    <button 
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      disabled={loading}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {showPassword ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        )}
                      </svg>
                    </button>
                  </div>
                </div>

                {/* OPÇÕES */}
                <div className="flex justify-between items-center text-sm">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-green-500 rounded focus:ring-green-400"
                      disabled={loading}
                    />
                    <span className="text-gray-600">Lembrar-me</span>
                  </label>
                  
                  <div>
                    <Link to='/recuperar-senha' className="text-green-700 hover:text-green-500 hover:underline transition-colors duration-300">
                      Esqueceu a senha?
                    </Link>
                  </div>
                </div>

                {/* BOTÃO ENTRAR */}
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-400 to-green-700 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </button>

                {/* LINK PARA CADASTRO */}
                <div className="text-center text-gray-500 text-sm mt-6">
                  Não tem uma conta?{" "}
                  <Link to='/cadastro' className="text-green-500 font-medium hover:text-green-600 hover:underline transition-colors duration-300">
                    Cadastre-se
                  </Link> 
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;