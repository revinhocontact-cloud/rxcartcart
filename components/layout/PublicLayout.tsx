
import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Printer, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

export const PublicLayout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col font-sans selection:bg-violet-500/30">
      
      {/* Navbar */}
      <header 
        className={`fixed w-full z-50 transition-all duration-300 border-b ${
          scrolled || isMenuOpen
          ? 'bg-[#020617]/90 backdrop-blur-md border-slate-800 py-3' 
          : 'bg-transparent border-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <span className="text-xl font-bold text-white tracking-tight">RexCart</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-slate-300 hover:text-white font-medium transition-colors">Home</Link>
              <Link to="/features" className="text-slate-300 hover:text-white font-medium transition-colors">Recursos</Link>
              <Link to="/pricing" className="text-slate-300 hover:text-white font-medium transition-colors">Planos</Link>
              
              <div className="flex items-center space-x-4 ml-4">
                <Link to="/login" className="text-white font-medium hover:text-violet-300 transition-colors">
                  Entrar
                </Link>
                <Link to="/register">
                  <Button className="bg-white text-slate-900 hover:bg-slate-100 border-none font-bold rounded-full px-6">
                    Testar Grátis
                  </Button>
                </Link>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="text-slate-300 hover:text-white p-2"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#0F172A] border-b border-slate-800 absolute w-full left-0 top-full shadow-2xl animate-in slide-in-from-top-5">
            <div className="px-4 py-6 space-y-4">
              <Link to="/" className="block text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800 px-4 py-3 rounded-lg">Home</Link>
              <Link to="/features" className="block text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800 px-4 py-3 rounded-lg">Recursos</Link>
              <Link to="/pricing" className="block text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800 px-4 py-3 rounded-lg">Planos</Link>
              <Link to="/login" className="block text-base font-medium text-violet-400 hover:text-violet-300 hover:bg-slate-800 px-4 py-3 rounded-lg">Fazer Login</Link>
              
              <div className="pt-4 mt-4 border-t border-slate-700">
                <Link to="/register" className="block w-full">
                   <Button fullWidth className="bg-violet-600 hover:bg-violet-500 border-none">Criar Conta Grátis</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-20">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#020617] border-t border-slate-800 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                 <span className="text-xl font-bold text-white">RexCart</span>
              </div>
              <p className="text-slate-400 max-w-sm leading-relaxed text-sm">
                A plataforma definitiva para automatizar a criação de cartazes no seu varejo. Economize tempo, padronize sua comunicação e venda mais.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-white mb-6">Produto</h3>
              <ul className="space-y-4 text-sm text-slate-400">
                <li><Link to="/features" className="hover:text-violet-400 transition-colors">Funcionalidades</Link></li>
                <li><Link to="/pricing" className="hover:text-violet-400 transition-colors">Preços</Link></li>
                <li><Link to="/login" className="hover:text-violet-400 transition-colors">Entrar</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-white mb-6">Suporte</h3>
              <ul className="space-y-4 text-sm text-slate-400">
                <li><a href="#" className="hover:text-violet-400 transition-colors">Central de Ajuda</a></li>
                <li><a href="https://wa.me/5511999999999" className="hover:text-violet-400 transition-colors">Falar no WhatsApp</a></li>
                <li><a href="#" className="hover:text-violet-400 transition-colors">Termos de Uso</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} RexCart. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6 text-sm text-slate-500">
               <a href="#" className="hover:text-white">Privacidade</a>
               <a href="#" className="hover:text-white">Legal</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
