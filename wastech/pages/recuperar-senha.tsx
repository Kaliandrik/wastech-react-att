import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useNavigate, Link } from 'react-router-dom';

function RecuperarSenha() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Função de validação de e-mail (simples)
    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // Função para mostrar feedback (equivalente ao showMessage do JS puro)
    const showFeedback = (msg: string, success: boolean) => {
        setMessage(msg);
        setIsSuccess(success);
        // Limpa a mensagem após 5 segundos
        setTimeout(() => setMessage(null), 5000);
    };

    // Função principal de reset de senha (handlePasswordReset)
    const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!email.trim()) {
            showFeedback('Por favor, insira seu e-mail', false);
            return;
        }

        if (!isValidEmail(email)) {
            showFeedback('Por favor, insira um e-mail válido', false);
            return;
        }

        setIsLoading(true);
        setMessage(null); // Limpa a mensagem anterior

        try {
            // Envia o e-mail de recuperação
            await sendPasswordResetEmail(auth, email);

            showFeedback(
                'E-mail de redefinição enviado! Verifique sua caixa de entrada (Verifique o SPAM também).', 
                true
            );

            // Redireciona para a página de Login após 3 segundos
            setTimeout(() => {
                navigate('/login');
            }, 3000);

        } catch (error: any) {
            console.error("Erro completo:", error);

            const errorMessages: { [key: string]: string } = {
                'auth/invalid-email': 'E-mail inválido',
                // Por segurança, não revelamos se o e-mail existe.
                'auth/user-not-found': 'Se o e-mail estiver cadastrado, você receberá instruções de recuperação.',
                'auth/too-many-requests': 'Muitas tentativas. Tente mais tarde.'
            };

            showFeedback(
                errorMessages[error.code] || 'Se o e-mail estiver cadastrado, você receberá instruções de recuperação.',
                false
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // Container principal (bg-f4f4f4)
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            
            {/* Wrapper do conteúdo (bg-fff, br10, shadow-lg, w-900, h-100%) */}
            <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-2xl overflow-hidden max-w-4xl w-full">
                
                {/* Container da Imagem (bg-linear-to-br) */}
                <div className="flex-1 flex justify-center items-center p-8 bg-gradient-to-br from-green-400 to-green-800">
                    <img 
                        className='max-w-full h-auto' 
                        src="/Imagens/logoverde.png"
                        alt="Logo Wastech"
                    />
                </div>
                
                {/* Container do Formulário (p-40) */}
                <div className="flex-1 p-10 md:p-12 flex flex-col justify-center">
                    
                    {/* Cabeçalho */}
                    <div className="text-center mb-6">
                        <h1 className='text-3xl font-semibold text-gray-800 mb-2'>Esqueceu sua senha?</h1>
                        <p className='text-sm text-gray-500'>Informe seu e-mail para receber um link de redefinição</p>
                    </div>
                    
                    {/* Formulário (max-h-400, m-0-auto) */}
                    <div className="w-full max-w-sm mx-auto">
                        <form onSubmit={handlePasswordReset} id="forgotPasswordForm">
                            <div className="relative mb-5">
                                {/* Label e input atualizados com Tailwind */}
                                <label htmlFor="email" className='block text-sm font-medium text-gray-700 mb-1'>E-mail</label>

                                {/* Ícone (Ajuste a posição do ícone e o padding do input) */}
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                                    </svg>
                                </span>

                                <input
                                    type="email"
                                    id="email"
                                    placeholder="seu.email@exemplo.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full py-3 pr-4 pl-10 border border-gray-300 rounded-lg text-base outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300"
                                />
                            </div>

                            {/* Botão de Envio (.login-button) */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg cursor-pointer text-lg hover:bg-green-700 transition duration-300 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Enviando...' : 'Enviar'}
                            </button>

                            {/* Mensagem de feedback */}
                            {message && (
                                <div className={`mt-4 p-3 rounded-lg text-center text-sm ${isSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {message}
                                </div>
                            )}

                            {/* Link de Voltar (.signup) */}
                            <div className="text-center mt-5 text-sm text-gray-500">
                                Voltar para o <Link to="/login" className="text-green-600 font-medium hover:underline">Login</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RecuperarSenha;