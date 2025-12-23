
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MockService } from '../services/mockService';
import { Button } from '../components/ui/Button';
import { User, Mail, Lock, ArrowRight, CheckCircle, User as UserIcon } from 'lucide-react';
import { UserRole } from '../types';

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      // Criamos um objeto parcial de usuário. O ID será gerado pelo backend.
      const newUserProfile = {
        id: '', 
        name,
        email,
        role: UserRole.CUSTOMER,
        plan: 'FREE',
        validUntil: '',
      } as any;

      const user = await MockService.register(newUserProfile, password);
      
      // O MockService (conectado ao backend) já retorna o token e o usuário.
      // Podemos logar diretamente.
      login(user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Falha ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#020617] flex">
      
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 relative">
          <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
              <div className="text-center lg:text-left">
                  <h2 className="mt-6 text-3xl font-extrabold text-white tracking-tight">
                    Crie sua conta grátis
                  </h2>
                  <p className="mt-2 text-sm text-slate-400">
                    Já tem uma conta?{' '}
                    <Link to="/login" className="font-medium text-violet-400 hover:text-violet-300 transition-colors">
                      Faça login aqui
                    </Link>
                  </p>
              </div>

              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm flex items-center">
                    <span className="block sm:inline">{error}</span>
                  </div>
                )}
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">
                      Nome Completo
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <UserIcon className="h-5 w-5 text-slate-500" />
                        </div>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl bg-[#0F172A] text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent sm:text-sm transition-all"
                          placeholder="Seu nome ou da loja"
                        />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
                      Email
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-slate-500" />
                        </div>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl bg-[#0F172A] text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent sm:text-sm transition-all"
                          placeholder="seu@email.com"
                        />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">
                      Senha
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-slate-500" />
                        </div>
                        <input
                          id="password"
                          name="password"
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl bg-[#0F172A] text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent sm:text-sm transition-all"
                          placeholder="Mínimo 6 caracteres"
                        />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-1">
                      Confirmar Senha
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-slate-500" />
                        </div>
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl bg-[#0F172A] text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent sm:text-sm transition-all"
                          placeholder="Repita a senha"
                        />
                    </div>
                  </div>
                </div>

                <Button 
                    type="submit" 
                    fullWidth 
                    disabled={loading}
                    className="h-12 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 border-none text-white font-bold rounded-xl shadow-lg shadow-violet-500/20"
                >
                  {loading ? 'Criando conta...' : 'Começar Agora'} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                
                <p className="text-xs text-center text-slate-500">
                  Ao se cadastrar, você concorda com nossos Termos de Uso e Política de Privacidade.
                </p>
              </form>
          </div>
      </div>

      {/* Right Side - Visuals (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 bg-[#0F172A] relative overflow-hidden items-center justify-center p-12">
          {/* Background Effects */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10 max-w-lg">
              <h1 className="text-4xl font-extrabold text-white mb-6 leading-tight">
                  Junte-se a centenas de varejistas de sucesso.
              </h1>
              <ul className="space-y-6 mb-10">
                  <li className="flex items-start text-slate-300">
                      <div className="bg-violet-500/20 p-2 rounded-lg mr-4 text-violet-400">
                        <CheckCircle size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-lg">Comece Grátis</h4>
                        <p className="text-sm text-slate-400">Sem necessidade de cartão de crédito para testar.</p>
                      </div>
                  </li>
                  <li className="flex items-start text-slate-300">
                      <div className="bg-violet-500/20 p-2 rounded-lg mr-4 text-violet-400">
                        <CheckCircle size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-lg">Acesso Imediato</h4>
                        <p className="text-sm text-slate-400">Crie seu primeiro cartaz em menos de 2 minutos.</p>
                      </div>
                  </li>
                  <li className="flex items-start text-slate-300">
                      <div className="bg-violet-500/20 p-2 rounded-lg mr-4 text-violet-400">
                        <CheckCircle size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-lg">Tudo na Nuvem</h4>
                        <p className="text-sm text-slate-400">Seus preços e produtos salvos com segurança.</p>
                      </div>
                  </li>
              </ul>
          </div>
      </div>
    </div>
  );
};
