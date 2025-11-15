import { useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { Link } from 'react-router-dom';

function Cadastro() {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
    terms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [alert, setAlert] = useState({ message: '', type: '', show: false });
  const [loading, setLoading] = useState(false);

  // Mostrar mensagens
  const showMessage = (message: string, isSuccess = false) => {
    setAlert({ message, type: isSuccess ? 'success' : 'error', show: true });
    setTimeout(() => setAlert({ message: '', type: '', show: false }), 5000);
  };

  // Validações de credenciais
  const validateCredentials = (fullname: string, email: string, password: string, confirmPassword: string) => {
    
    if (!fullname || fullname.trim().length < 5) {
      return { isValid: false, message: 'Nome completo deve ter pelo menos 5 caracteres' };
    }
    
    if (fullname.length > 100) {
      return { isValid: false, message: 'Nome completo não pode exceder 100 caracteres' };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, message: 'Por favor, insira um e-mail válido' };
    }
    
    if (email.length > 254) {
      return { isValid: false, message: 'E-mail não pode exceder 254 caracteres' };
    }
    
    if (password.length < 8) {
      return { isValid: false, message: 'A senha deve ter pelo menos 8 caracteres' };
    }
    
    if (password.length > 128) {
      return { isValid: false, message: 'Senha não pode exceder 128 caracteres' };
    }
    
    if (!/(?=.*[a-z])/.test(password)) {
      return { isValid: false, message: 'Senha deve conter pelo menos uma letra minúscula' };
    }
    
    if (!/(?=.*[A-Z])/.test(password)) {
      return { isValid: false, message: 'Senha deve conter pelo menos uma letra maiúscula' };
    }
    
    if (!/(?=.*\d)/.test(password)) {
      return { isValid: false, message: 'Senha deve conter pelo menos um número' };
    }
    
    if (password !== confirmPassword) {
      return { isValid: false, message: 'As senhas não coincidem' };
    }
    
    return { isValid: true, message: '' };
  };

  // ✅ CADASTRO CORRIGIDO - COM VERIFICAÇÃO DO DISPLAYNAME
  const registerUser = async (email: string, password: string, userData: { nome: string; email: string; localizacao: string }) => {
    try {
      console.log('🚀 Iniciando cadastro para:', email);
      
      // 1. Cria o usuário no Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log('✅ Usuário criado no Auth:', user.uid);
      
      // ✅ 2. ATUALIZA O DISPLAY NAME NO FIREBASE AUTH (COM TRY-CATCH ESPECÍFICO)
      try {
        await updateProfile(user, {
          displayName: userData.nome.trim()
        });
        console.log('✅ DisplayName salvo no Firebase Auth:', userData.nome);
        
        // ✅ VERIFICA SE O DISPLAYNAME FOI SALVO
        await user.reload(); // Recarrega os dados do usuário
        console.log('✅ DisplayName após reload:', user.displayName);
        
      } catch (profileError) {
        console.error('❌ Erro ao salvar displayName:', profileError);
        throw new Error('Erro ao salvar nome do usuário');
      }
      
      // 3. Salva dados no Firestore
      await setDoc(doc(db, 'usuarios', user.uid), {
        ...userData,
        uid: user.uid,
        emailVerified: false,
        createdAt: serverTimestamp(),
        photoURL: '',
        displayName: userData.nome // ✅ SALVA TAMBÉM NO FIRESTORE COMO BACKUP
      });
      
      console.log('✅ Dados salvos no Firestore');
      
      // 4. Envia email de verificação
      await sendEmailVerification(user);
      console.log('✅ Email de verificação enviado');
      
      return user;
    } catch (error) {
      console.error("❌ Erro completo no cadastro:", error);
      
      // Se falhou depois de criar o usuário no Auth, tenta limpar
      if (auth.currentUser) {
        try {
          await auth.currentUser.delete();
          console.log("✅ Usuário removido do Auth devido ao erro");
        } catch (deleteError) {
          console.error("❌ Erro ao remover usuário:", deleteError);
        }
      }
      
      throw error;
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const { email, password, confirmPassword, fullname, location, terms } = formData;

    // Validação dos termos
    if (!terms) {
      showMessage('Você deve aceitar os termos de uso');
      setLoading(false);
      return;
    }

    // Validação das credenciais
    const validation = validateCredentials(fullname, email, password, confirmPassword);
    if (!validation.isValid) {
      showMessage(validation.message);
      setLoading(false);
      return;
    }

    try {
      const user = await registerUser(email, password, {
        nome: fullname.trim(),
        email: email,
        localizacao: location
      });

      console.log('🎉 Cadastro finalizado! Usuário:', user.uid);
      console.log('📝 DisplayName final:', user.displayName);

      showMessage('Cadastro realizado com sucesso! Verifique seu email para confirmação.', true);
      
      // Redireciona para login após 3 segundos
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);

    } catch (error: unknown) {
      console.error("❌ Erro completo no submit:", error);

      const errorMessages: { [key: string]: string } = {
        'auth/email-already-in-use': 'Este e-mail já está em uso',
        'auth/invalid-email': 'E-mail inválido',
        'auth/weak-password': 'Senha muito fraca. Use pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas e números',
        'auth/operation-not-allowed': 'Operação não permitida',
        'permission-denied': 'Erro de permissão. Contate o suporte.',
        'Erro ao salvar nome do usuário': 'Erro ao salvar nome do usuário. Tente novamente.'
      };

      const firebaseError = error as { code?: string; message?: string };
      const errorCode = firebaseError.code || '';
      const errorMessage = firebaseError.message || '';
      
      showMessage(errorMessages[errorCode] || errorMessages[errorMessage] || 'Erro ao cadastrar usuário');
    } finally {
      setLoading(false);
    }
  };

  // Validação em tempo real
  const handleBlur = (field: string) => {
    const { fullname, password, location } = formData;

    switch (field) {
      case 'fullname':
        if (fullname && fullname.length < 5) {
          showMessage('Nome completo deve ter pelo menos 5 caracteres');
        }
        break;
      case 'password':
        if (password && password.length < 8) {
          showMessage('Senha deve ter pelo menos 8 caracteres');
        }
        break;
      case 'location':
        if (location && location.length < 3) {
          showMessage('Localização deve ter pelo menos 3 caracteres');
        }
        break;
      default:
        break;
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field: string) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex justify-center items-center p-5">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
        <div className="flex flex-col lg:flex-row">
          {/* Container da Imagem */}
          <div className="flex justify-center items-center bg-gradient-to-br from-green-400 to-green-900 p-4 lg:p-8 lg:flex-1 lg:min-h-[650px] relative">
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[size:20px_20px]"></div>
            <img  
              src="/Imagens/logoverde.png" 
              alt="Logo Wastech" 
              className="max-w-full h-auto max-h-48 lg:max-h-80 transition-transform duration-500 hover:scale-105 z-10"
            />
          </div>

          {/* Container do Formulário */}
          <div className="p-6 lg:p-12 lg:flex-1 flex flex-col justify-center">
            {/* Alert Message */}
            {alert.show && (
              <div className={`mb-6 p-4 rounded-lg flex items-center ${
                alert.type === 'success' 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                <svg className={`w-5 h-5 mr-3 ${
                  alert.type === 'success' ? 'text-green-500' : 'text-red-500'
                }`} fill="currentColor" viewBox="0 0 20 20">
                  {alert.type === 'success' ? (
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  ) : (
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  )}
                </svg>
                {alert.message}
              </div>
            )}

            <div className="text-center mb-8">
              <h1 className="text-2xl lg:text-3xl font-medium text-green-900 mb-2">
                Crie sua conta
              </h1>
              <p className="text-gray-600 font-light text-sm lg:text-base">
                Junte-se à Wastech!
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                {/* Nome Completo */}
                <div className="relative">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Seu nome
                  </label>
                  <svg className="w-5 h-5 absolute left-3 top-10 text-green-400 z-10" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                  </svg>
                  <input 
                    type="text" 
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('fullname')}
                    placeholder="Seu nome completo" 
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-green-400 focus:ring-3 focus:ring-green-100 focus:bg-white"
                  />
                </div>

                {/* E-mail */}
                <div className="relative">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    E-mail
                  </label>
                  <svg className="w-5 h-5 absolute left-3 top-10 text-green-400 z-10" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="seu.email@exemplo.com" 
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-green-400 focus:ring-3 focus:ring-green-100 focus:bg-white"
                  />
                </div>

                {/* Senha */}
                <div className="relative">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Senha
                  </label>
                  <svg className="w-5 h-5 absolute left-3 top-10 text-green-400 z-10" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                  </svg>
                  <input 
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('password')}
                    placeholder="••••••••" 
                    required
                    className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-300 rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-green-400 focus:ring-3 focus:ring-green-100 focus:bg-white"
                  />
                  <span 
                    className="absolute right-3 top-10 cursor-pointer"
                    onClick={() => togglePasswordVisibility('password')}
                  >
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      {showPassword ? (
                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd"/>
                      ) : (
                        <>
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                        </>
                      )}
                    </svg>
                  </span>
                </div>

                {/* Confirmar Senha */}
                <div className="relative">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Confirmar Senha
                  </label>
                  <svg className="w-5 h-5 absolute left-3 top-10 text-green-400 z-10" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                  </svg>
                  <input 
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••" 
                    required
                    className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-300 rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-green-400 focus:ring-3 focus:ring-green-100 focus:bg-white"
                  />
                  <span 
                    className="absolute right-3 top-10 cursor-pointer"
                    onClick={() => togglePasswordVisibility('confirmPassword')}
                  >
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      {showConfirmPassword ? (
                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd"/>
                      ) : (
                        <>
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                        </>
                      )}
                    </svg>
                  </span>
                </div>

                {/* Localização */}
                <div className="relative lg:col-span-2">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Localização
                  </label>
                  <svg className="w-5 h-5 absolute left-3 top-10 text-green-400 z-10" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                  </svg>
                  <input 
                    type="text" 
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('location')}
                    placeholder="Cidade, Estado" 
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-green-400 focus:ring-3 focus:ring-green-100 focus:bg-white"
                  />
                </div>
              </div>

              {/* Termos e Condições */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 text-sm">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    name="terms"
                    checked={formData.terms}
                    onChange={handleInputChange}
                    required
                    className="mr-2 text-green-400 focus:ring-green-300 rounded"
                  />
                  <label className="text-gray-700">
                    Concordo com os{" "}
                    <a className="text-green-900 cursor-pointer hover:text-green-400 hover:underline transition-colors duration-300">
                      Termos de Uso
                    </a>{" "}
                    e{" "}
                    <a className="text-green-900 cursor-pointer hover:text-green-400 hover:underline transition-colors duration-300">
                      Política de Privacidade
                    </a>
                  </label>
                </div>
              </div>

              {/* Botão de Cadastro */}
              <button 
                type="submit" 
                disabled={loading}
                className={`w-full bg-gradient-to-r from-green-400 to-green-900 text-white py-3 rounded-lg font-medium text-base transition-all duration-300 ${
                  loading 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 shadow-md'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Cadastrando...
                  </div>
                ) : (
                  'Criar Conta'
                )}
              </button>

              {/* Link para Login */}
              <div className="text-center mt-6 text-gray-600 text-sm">
                Já tem uma conta?{" "}
                <Link to="/login" className="text-green-400 font-medium hover:text-green-900 hover:underline transition-colors duration-300">
                  Faça login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cadastro;