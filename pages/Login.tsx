
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MockService } from '../services/mockService';
import { Button } from '../components/ui/Button';
import { Mail, Lock, ArrowRight, CheckCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await MockService.login(email, password);
      login(user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Falha no login');
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
                    Bem-vindo de volta
                  </h2>
                  <p className="mt-2 text-sm text-slate-400">
                    Não tem uma conta?{' '}
                    <Link to="/register" className="font-medium text-violet-400 hover:text-violet-300 transition-colors">
                      Teste grátis por 30 dias
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
                    <div className="flex items-center justify-between mb-1">
                        <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                          Senha
                        </label>
                        <a href="#" className="text-xs text-violet-400 hover:text-violet-300">Esqueceu a senha?</a>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-slate-500" />
                        </div>
                        <input
                          id="password"
                          name="password"
                          type="password"
                          autoComplete="current-password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl bg-[#0F172A] text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent sm:text-sm transition-all"
                          placeholder="••••••••"
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
                  {loading ? 'Entrando...' : 'Acessar Painel'} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>

              {/* Demo Credentials Helper */}
              <div className="mt-8 pt-6 border-t border-slate-800">
                  <p className="text-xs text-slate-500 text-center uppercase tracking-wider font-semibold mb-4">Acesso de Demonstração</p>
                  <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => { setEmail('demo@rexcart.com'); setPassword('demo'); }}
                        className="p-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl text-left transition-all group"
                      >
                          <p className="text-xs text-violet-400 font-bold mb-1 group-hover:text-violet-300">Cliente</p>
                          <p className="text-xs text-slate-400">demo@rexcart.com</p>
                          <p className="text-[10px] text-slate-600 mt-1">Senha: demo</p>
                      </button>
                      <button 
                        onClick={() => { setEmail('admin@rexcart.com'); setPassword('admin'); }}
                        className="p-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl text-left transition-all group"
                      >
                          <p className="text-xs text-orange-400 font-bold mb-1 group-hover:text-orange-300">Admin</p>
                          <p className="text-xs text-slate-400">admin@rexcart.com</p>
                          <p className="text-[10px] text-slate-600 mt-1">Senha: admin</p>
                      </button>
                  </div>
              </div>
          </div>
      </div>

      {/* Right Side - Visuals (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 bg-[#0F172A] relative overflow-hidden items-center justify-center p-12">
          {/* Background Effects */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10 max-w-lg">
              <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 backdrop-blur-sm text-white text-sm">
                  <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
                  Sistema Online e Operando 100%
              </div>
              <h1 className="text-4xl font-extrabold text-white mb-6 leading-tight">
                  A ferramenta essencial para o seu varejo.
              </h1>
              <ul className="space-y-4 mb-10">
                  {[
                      'Crie cartazes de oferta em segundos',
                      'Padronize a comunicação visual',
                      'Imprima em qualquer formato (A3, A4, A5)',
                      'Acesso de qualquer lugar'
                  ].map((item, i) => (
                      <li key={i} className="flex items-center text-slate-300 text-lg">
                          <CheckCircle className="text-violet-500 mr-3 h-6 w-6" />
                          {item}
                      </li>
                  ))}
              </ul>

              {/* Testimonial Card */}
              <div className="bg-[#1E293B]/60 backdrop-blur-md border border-slate-700 p-6 rounded-2xl">
                  <p className="text-slate-300 italic mb-4">"O RexCart mudou a operação do meu supermercado. Antes levávamos horas para trocar preços, agora fazemos em minutos."</p>
                  <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold">
                          RJ
                      </div>
                      <div>
                          <p className="text-white font-bold text-sm">Ricardo Jorge</p>
                          <p className="text-slate-500 text-xs">Proprietário, Supermercado Bom Preço</p>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};
