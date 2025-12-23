import React, { useState } from 'react';
import { User, Lock, Moon, Sun, CreditCard, ChevronRight, Camera, User as UserIcon, Palette, Layout, CheckCircle, Clock } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

type Tab = 'account' | 'appearance' | 'plan';

export const Settings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('account');
  const [darkMode, setDarkMode] = useState(true);

  // Form States
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  
  const TabButton = ({ id, label, icon: Icon }: { id: Tab, label: string, icon: any }) => (
    <button 
        onClick={() => setActiveTab(id)}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === id 
            ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20' 
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        }`}
    >
        <Icon size={16} />
        <span>{label}</span>
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto pb-20">
      
      {/* Header */}
      <div className="mb-8">
          <div className="flex items-center text-sm text-slate-500 mb-1">
             <span>Painel</span>
             <ChevronRight size={14} className="mx-1" />
             <span className="text-violet-400">Configurações</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Configurações</h1>
          <p className="text-slate-400 text-sm">Gerencie sua conta e preferências</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 bg-[#0F172A] p-1.5 rounded-xl border border-slate-800 w-fit">
          <TabButton id="account" label="Conta" icon={User} />
          <TabButton id="appearance" label="Aparência" icon={Palette} />
          <TabButton id="plan" label="Plano" icon={Layout} />
      </div>

      {/* ACCOUNT TAB */}
      {activeTab === 'account' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Personal Info */}
            <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-6 md:p-8">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                    <UserIcon size={20} className="mr-2 text-violet-500" />
                    Informações Pessoais
                </h3>

                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex flex-col items-center space-y-3">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl">
                            {user?.name.charAt(0).toUpperCase()}
                        </div>
                        <button className="flex items-center space-x-2 text-xs font-medium text-slate-400 bg-[#1E293B] hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors">
                            <Camera size={14} />
                            <span>Alterar foto</span>
                        </button>
                    </div>

                    <div className="flex-1 space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Nome completo</label>
                            <input 
                                type="text" 
                                className="w-full bg-[#1E293B] border border-slate-700 rounded-lg p-3 text-white focus:border-violet-500 outline-none transition-colors"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">E-mail</label>
                            <input 
                                type="email" 
                                className="w-full bg-[#1E293B] border border-slate-700 rounded-lg p-3 text-white focus:border-violet-500 outline-none transition-colors"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Função</label>
                            <div className="inline-block bg-violet-500/10 text-violet-400 px-3 py-1 rounded-md text-xs font-bold uppercase border border-violet-500/20">
                                {user?.role === 'ADMIN' ? 'Administrador' : 'Cliente'}
                            </div>
                        </div>

                        <div className="pt-2">
                             <Button className="bg-violet-600 hover:bg-violet-500 text-white border-none shadow-lg shadow-violet-500/20">
                                Salvar alterações
                             </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Password */}
            <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-6 md:p-8">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                    <Lock size={20} className="mr-2 text-violet-500" />
                    Alterar Senha
                </h3>
                
                <div className="space-y-5 max-w-2xl">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Senha atual</label>
                        <input 
                            type="password" 
                            className="w-full bg-[#1E293B] border border-slate-700 rounded-lg p-3 text-white focus:border-violet-500 outline-none transition-colors"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Nova senha</label>
                            <input 
                                type="password" 
                                className="w-full bg-[#1E293B] border border-slate-700 rounded-lg p-3 text-white focus:border-violet-500 outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Confirmar</label>
                            <input 
                                type="password" 
                                className="w-full bg-[#1E293B] border border-slate-700 rounded-lg p-3 text-white focus:border-violet-500 outline-none transition-colors"
                            />
                        </div>
                    </div>
                    <div className="pt-2">
                        <Button variant="secondary" className="bg-white hover:bg-slate-200 text-slate-900 border-none">
                            Atualizar senha
                        </Button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* APPEARANCE TAB */}
      {activeTab === 'appearance' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
             <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-6 md:p-8">
                <div className="flex items-center space-x-2 mb-2">
                    <Palette size={20} className="text-violet-500" />
                    <h3 className="text-lg font-bold text-white">Tema</h3>
                </div>
                <p className="text-slate-500 text-sm mb-8">Escolha entre o modo claro ou escuro</p>

                {/* Toggle Row */}
                <div className="flex items-center justify-between bg-[#1E293B] p-4 rounded-lg mb-8 border border-slate-700">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-slate-700 rounded-lg text-violet-400">
                            <Moon size={20} />
                        </div>
                        <div>
                            <h4 className="text-white font-medium">Modo Escuro</h4>
                            <p className="text-xs text-slate-500">Interface com cores escuras</p>
                        </div>
                    </div>
                    <div 
                        className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${darkMode ? 'bg-violet-600' : 'bg-slate-600'}`}
                        onClick={() => setDarkMode(!darkMode)}
                    >
                        <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </div>
                </div>

                {/* Visual Selectors */}
                <div className="grid grid-cols-2 gap-6">
                    <div 
                        onClick={() => setDarkMode(false)}
                        className={`cursor-pointer border-2 rounded-xl p-4 transition-all ${!darkMode ? 'border-violet-500 bg-[#1E293B]' : 'border-slate-700 hover:border-slate-600 bg-[#020617]'}`}
                    >
                        <div className="bg-white h-24 rounded-lg mb-4 flex items-center justify-center shadow-sm">
                            <Sun className="text-orange-500" size={32} />
                        </div>
                        <div className="text-center">
                            <h5 className="text-white font-medium">Claro</h5>
                        </div>
                    </div>
                    <div 
                        onClick={() => setDarkMode(true)}
                        className={`cursor-pointer border-2 rounded-xl p-4 transition-all ${darkMode ? 'border-violet-500 bg-[#1E293B]' : 'border-slate-700 hover:border-slate-600 bg-[#020617]'}`}
                    >
                        <div className="bg-[#020617] h-24 rounded-lg mb-4 flex items-center justify-center border border-slate-800">
                            <Moon className="text-violet-500" size={32} />
                        </div>
                        <div className="text-center">
                            <h5 className="text-white font-medium">Escuro</h5>
                        </div>
                    </div>
                </div>
             </div>
          </div>
      )}

      {/* PLAN TAB */}
      {activeTab === 'plan' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Current Plan Card */}
             <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl p-1 shadow-lg shadow-violet-500/20">
                 <div className="bg-[#1E293B]/30 backdrop-blur-sm rounded-lg p-6 md:p-8">
                     <div className="flex justify-between items-start mb-6">
                         <div>
                             <p className="text-white/80 text-sm font-medium mb-1">Plano Atual</p>
                             <h2 className="text-3xl font-bold text-white">
                                {user?.plan === 'PRO' ? 'Profissional' : user?.plan === 'ENTERPRISE' ? 'Empresarial' : 'Gratuito'}
                             </h2>
                         </div>
                         <CreditCard className="text-white/50 w-12 h-12" />
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                         <div className="bg-black/20 rounded-lg p-3 backdrop-blur-sm">
                             <p className="text-xs text-white/60 mb-1">Cartazes</p>
                             <p className="text-lg font-bold text-white">0/100</p>
                         </div>
                         <div className="bg-black/20 rounded-lg p-3 backdrop-blur-sm">
                             <p className="text-xs text-white/60 mb-1">Status</p>
                             <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-500/20 text-red-200 border border-red-500/30">
                                Inativo
                             </span>
                         </div>
                         <div className="bg-black/20 rounded-lg p-3 backdrop-blur-sm">
                             <p className="text-xs text-white/60 mb-1">Validade</p>
                             <p className="text-lg font-bold text-white">-</p>
                         </div>
                     </div>

                     <Button fullWidth className="bg-white text-violet-700 hover:bg-slate-100 font-bold border-none shadow-xl">
                        <CreditCard size={16} className="mr-2" />
                        Fazer Upgrade
                     </Button>
                 </div>
             </div>

             {/* History */}
             <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                    <Clock size={20} className="mr-2 text-violet-500" />
                    Histórico
                </h3>

                <div className="space-y-3">
                    {[
                        { plan: 'Pro', date: '01/12/2024', price: 99.00 },
                        { plan: 'Pro', date: '01/11/2024', price: 99.00 },
                    ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-[#1E293B] border border-slate-700 rounded-lg hover:border-violet-500/50 transition-all">
                            <div className="flex items-center space-x-4">
                                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-full">
                                    <CheckCircle size={16} />
                                </div>
                                <div>
                                    <h4 className="text-white font-medium">{item.plan}</h4>
                                    <p className="text-xs text-slate-500">{item.date}</p>
                                </div>
                            </div>
                            <span className="text-white font-bold">R$ {item.price.toFixed(2)}</span>
                        </div>
                    ))}
                </div>
             </div>
          </div>
      )}

    </div>
  );
};