
import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Printer, Users, LogOut, Package, Settings, Palette, Crown, ChevronRight, ChevronLeft, Sliders, Menu, X, Lock, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { UserRole } from '../../types';
import { Button } from '../ui/Button';

export const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, site } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  if (user.status === 'PENDING' || user.status === 'INACTIVE' || user.status === 'EXPIRED') {
      return (
          <div className="min-h-screen flex items-center justify-center bg-[#020617] p-4 font-sans">
              <div className="max-w-lg w-full bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500">
                  <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6 text-center">
                      <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                          <Lock size={32} className="text-white" />
                      </div>
                      <h1 className="text-2xl font-bold text-white">Acesso Bloqueado</h1>
                      <p className="text-white/80 text-sm mt-1">Existem pendências na sua conta</p>
                  </div>
                  <div className="p-8 text-center space-y-6">
                      <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                          <div className="flex items-center justify-center gap-2 text-orange-400 font-bold mb-2">
                              <AlertTriangle size={20} />
                              <span>Serviços Inativos</span>
                          </div>
                          <p className="text-slate-400 text-sm">
                              Seu acesso às ferramentas de criação e impressão está temporariamente suspenso.
                          </p>
                      </div>
                      <div className="space-y-3">
                          <Button fullWidth className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold" onClick={() => window.open(site.whatsapp ? `https://wa.me/${site.whatsapp.replace(/\D/g,'')}` : '#', '_blank')}>Falar com Financeiro</Button>
                          <Button variant="secondary" fullWidth onClick={handleLogout} className="bg-slate-700 hover:bg-slate-600"><LogOut size={16} className="mr-2" /> Sair</Button>
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => {
    const commonStyles = `group flex items-center ${collapsed ? 'justify-center px-2' : 'justify-between px-4'} py-3 rounded-lg transition-all duration-200 mb-1`;

    return (
      <NavLink 
        to={to} 
        onClick={() => setMobileMenuOpen(false)}
        className={({ isActive }) => 
          `${commonStyles} ${
            !isActive && 'text-slate-400 hover:bg-black/20 hover:text-white'
          }`
        }
        style={({ isActive }) => isActive ? { 
            background: `linear-gradient(to right, ${theme.primaryColor}, ${theme.primaryColor}dd)`,
            color: 'white',
            boxShadow: `0 10px 15px -3px ${theme.primaryColor + '40'}`
        } : {}}
        title={collapsed ? label : undefined}
      >
        <div className={`flex items-center ${collapsed ? '' : 'space-x-3'}`}>
          <Icon size={20} className="stroke-[1.5]" />
          {!collapsed && <span className="font-medium text-sm">{label}</span>}
        </div>
      </NavLink>
    );
  };

  const SidebarContent = () => (
    <>
      <div className={`p-6 flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center justify-center w-full">
            <span className="font-bold text-white text-xl">{collapsed ? 'RC' : (site.name || 'RexCart')}</span>
          </div>
          <div className="md:hidden absolute right-4 top-6">
            <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400 hover:text-white"><X size={24} /></button>
          </div>
      </div>
      <div className="px-3 flex-grow space-y-1 overflow-y-auto no-scrollbar">
          {!collapsed && <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-4 mt-2 mb-4">Menu Principal</div>}
          <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem to="/dashboard/create" icon={PlusCircle} label="Criar Cartaz" />
          <NavItem to="/dashboard/queue" icon={Printer} label="Fila de Impressão" />
          <NavItem to="/dashboard/products" icon={Package} label="Produtos" />
          <NavItem to="/dashboard/templates" icon={Palette} label="Templates" />
          <NavItem to="/dashboard/settings" icon={Settings} label="Configurações" />
          
          {user.role === UserRole.ADMIN && (
            <>
              {!collapsed && <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-4 mt-8 mb-4">Administração</div>}
              <NavItem to="/dashboard/admin" icon={Users} label="Usuários" />
              <NavItem to="/dashboard/admin/settings" icon={Sliders} label="Config. Sistema" />
            </>
          )}
      </div>
      <div className="p-4 space-y-4">
          <div className={`pt-4 border-t border-white/10 ${collapsed ? 'flex justify-center' : ''}`}>
            {collapsed ? (
                <button onClick={handleLogout} className="w-10 h-10 rounded-lg bg-black/20 flex items-center justify-center text-slate-400 hover:text-white hover:bg-black/40 transition-colors" title="Sair"><LogOut size={18} /></button>
            ) : (
                <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-black/20 transition-colors cursor-pointer group">
                    <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center text-slate-300 font-bold text-lg group-hover:text-white transition-colors">{user.name.charAt(0).toUpperCase()}</div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 truncate capitalize">{user.plan.toLowerCase()}</p>
                    </div>
                    <button onClick={handleLogout} className="text-slate-500 hover:text-red-400 transition-colors"><LogOut size={16} /></button>
                </div>
            )}
          </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex font-sans transition-colors duration-300" style={{ backgroundColor: theme.mode === 'dark' ? (theme.preset === 'black' ? '#000000' : '#020617') : '#F8FAFC' }}>
      <aside className={`${collapsed ? 'w-20' : 'w-72'} border-r border-white/5 hidden md:flex flex-col fixed h-full z-20 transition-all duration-300`} style={{ backgroundColor: theme.secondaryColor }}>
        <button onClick={() => setCollapsed(!collapsed)} className="absolute -right-3 top-9 border border-slate-600 text-slate-400 rounded-full p-1 hover:text-white hover:border-slate-400 transition-all z-50 shadow-lg" style={{ backgroundColor: theme.secondaryColor }}>{collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}</button>
        <SidebarContent />
      </aside>
      <div className={`md:hidden fixed inset-0 z-50 ${mobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          <div className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setMobileMenuOpen(false)} />
          <aside className={`absolute left-0 top-0 h-full w-72 shadow-2xl transition-transform duration-300 flex flex-col ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`} style={{ backgroundColor: theme.secondaryColor }}><SidebarContent /></aside>
      </div>
      <main className={`flex-1 ${collapsed ? 'md:ml-20' : 'md:ml-72'} p-4 md:p-8 overflow-y-auto h-screen transition-all duration-300`}>
        <Outlet />
      </main>
    </div>
  );
};
