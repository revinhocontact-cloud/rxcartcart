
import React, { useState, useEffect } from 'react';
import { Palette, Layout, Globe, ChevronRight, Save, Upload, Check, Crown } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { MockService } from '../../services/mockService';
import { SystemConfig, PlanDetails } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

type Tab = 'theme' | 'plans' | 'site';

export const SystemSettings: React.FC = () => {
  const { user } = useAuth();
  const { refreshTheme, updateThemeDirectly } = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>('theme');
  const [config, setConfig] = useState<SystemConfig | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadConfig = async () => {
      const data = await MockService.getSystemConfig();
      setConfig(data);
    };
    loadConfig();
  }, []);

  const handleSave = async () => {
    if (config) {
        setIsSaving(true);
        try {
            await MockService.saveSystemConfig(config);
            await refreshTheme(); // Atualiza o contexto global
            alert('Configurações salvas e aplicadas com sucesso!');
        } catch (error) {
            alert('Erro ao salvar configurações.');
        } finally {
            setIsSaving(false);
        }
    }
  };

  if (!config) return <div className="p-8 text-center text-slate-500">Carregando configurações...</div>;

  const themes = [
      { id: 'standard', name: 'Padrão', colors: ['#7C3AED', '#1E293B'] }, // Violet/Dark
      { id: 'ocean', name: 'Oceano', colors: ['#0EA5E9', '#0F172A'] }, // Sky/Dark
      { id: 'forest', name: 'Floresta', colors: ['#10B981', '#064E3B'] }, // Emerald
      { id: 'sunset', name: 'Pôr do Sol', colors: ['#F97316', '#7C2D12'] }, // Orange
      { id: 'midnight', name: 'Meia-Noite', colors: ['#6366F1', '#312E81'] }, // Indigo
      { id: 'black', name: 'Totalmente Preto', colors: ['#FBBF24', '#000000'] }, // Amber/Black
  ];

  const handlePresetSelect = (theme: typeof themes[0]) => {
      const newTheme = {
          ...config.theme,
          preset: theme.id,
          primaryColor: theme.colors[0],
          secondaryColor: theme.colors[1]
      };
      setConfig({ ...config, theme: newTheme });
      // Opcional: atualização em tempo real sem salvar
      updateThemeDirectly(newTheme);
  };

  const TabButton = ({ id, label, icon: Icon }: { id: Tab, label: string, icon: any }) => (
    <button 
        onClick={() => setActiveTab(id)}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === id 
            ? 'text-white shadow-lg' 
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        }`}
        style={activeTab === id ? { backgroundColor: config.theme.primaryColor, boxShadow: `0 10px 15px -3px ${config.theme.primaryColor}33` } : {}}
    >
        <Icon size={16} />
        <span>{label}</span>
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto pb-20">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
            <div className="flex items-center text-sm text-slate-500 mb-1">
                <span>Administração</span>
                <ChevronRight size={14} className="mx-1" />
                <span style={{ color: config.theme.primaryColor }}>Configurações</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Configurações do Sistema</h1>
        </div>
        <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="text-white border-none shadow-lg px-8"
            style={{ backgroundColor: config.theme.primaryColor, boxShadow: `0 10px 15px -3px ${config.theme.primaryColor}33` }}
        >
            <Save size={16} className="mr-2" />
            {isSaving ? 'Salvando...' : 'Salvar Tudo'}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 bg-[#0F172A] p-1.5 rounded-xl border border-slate-800 w-fit flex-wrap">
          <TabButton id="theme" label="Tema & Design" icon={Palette} />
          <TabButton id="plans" label="Planos" icon={Crown} />
          <TabButton id="site" label="Site" icon={Globe} />
      </div>

      {/* --- TAB: THEME --- */}
      {activeTab === 'theme' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
             
             {/* Themes Grid */}
             <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-6 md:p-8">
                <div className="flex items-center space-x-2 mb-2">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${config.theme.primaryColor}33` }}>
                        <Palette size={20} style={{ color: config.theme.primaryColor }} />
                    </div>
                    <h3 className="text-lg font-bold text-white">Temas Predefinidos</h3>
                </div>
                <p className="text-slate-500 text-sm mb-6">Escolha um tema e personalize sua logo para cada estilo</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {themes.map(theme => (
                        <div 
                            key={theme.id}
                            className={`border-2 rounded-xl p-6 relative cursor-pointer transition-all ${
                                config.theme.preset === theme.id 
                                ? 'bg-[#1E293B]' 
                                : 'border-slate-800 bg-[#1E293B]/50 hover:border-slate-600'
                            }`}
                            style={config.theme.preset === theme.id ? { borderColor: config.theme.primaryColor } : {}}
                            onClick={() => handlePresetSelect(theme)}
                        >
                            {config.theme.preset === theme.id && (
                                <div className="absolute top-4 right-4 rounded-full p-1 text-white" style={{ backgroundColor: config.theme.primaryColor }}>
                                    <Check size={14} />
                                </div>
                            )}

                            <div className="flex gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg shadow-lg" style={{ backgroundColor: theme.colors[0] }}></div>
                                <div className="w-10 h-10 rounded-lg shadow-lg" style={{ backgroundColor: theme.colors[1] }}></div>
                            </div>

                            <h4 className="text-white font-bold mb-4">{theme.name}</h4>

                            <div className="border border-dashed border-slate-700 rounded-lg p-6 flex flex-col items-center justify-center text-slate-500 hover:text-white hover:bg-slate-800 transition-colors" style={{ borderColor: config.theme.preset === theme.id ? config.theme.primaryColor : undefined }}>
                                <Upload size={20} className="mb-2" />
                                <span className="text-xs">Enviar logo</span>
                                <span className="text-[10px] text-slate-600 mt-1">Logo para este tema</span>
                            </div>
                        </div>
                    ))}
                </div>
             </div>

             {/* Custom Colors & Config */}
             <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-6 md:p-8">
                <div className="flex items-center space-x-2 mb-6">
                    <Palette size={20} style={{ color: config.theme.primaryColor }} />
                    <h3 className="text-lg font-bold text-white">Personalizar Cores</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Cor Primária</label>
                        <div className="flex gap-3">
                            <div className="w-12 h-12 rounded-lg border border-slate-700 shadow-lg" style={{ backgroundColor: config.theme.primaryColor }}></div>
                            <input 
                                type="text" 
                                className="flex-1 bg-[#1E293B] border border-slate-700 rounded-lg p-3 text-white outline-none uppercase font-mono"
                                style={{ borderColor: config.theme.primaryColor }}
                                value={config.theme.primaryColor}
                                onChange={e => {
                                    const c = e.target.value;
                                    setConfig({...config, theme: {...config.theme, primaryColor: c}});
                                    updateThemeDirectly({...config.theme, primaryColor: c});
                                }}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Cor Secundária</label>
                        <div className="flex gap-3">
                            <div className="w-12 h-12 rounded-lg border border-slate-700 shadow-lg" style={{ backgroundColor: config.theme.secondaryColor }}></div>
                            <input 
                                type="text" 
                                className="flex-1 bg-[#1E293B] border border-slate-700 rounded-lg p-3 text-white outline-none uppercase font-mono"
                                style={{ borderColor: config.theme.primaryColor }}
                                value={config.theme.secondaryColor}
                                onChange={e => {
                                    const c = e.target.value;
                                    setConfig({...config, theme: {...config.theme, secondaryColor: c}});
                                    updateThemeDirectly({...config.theme, secondaryColor: c});
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Modo de Exibição</label>
                        <select 
                            className="w-full bg-[#1E293B] border border-slate-700 rounded-lg p-3 text-white focus:border-violet-500 outline-none"
                            value={config.theme.mode}
                            onChange={e => setConfig({...config, theme: {...config.theme, mode: e.target.value as any}})}
                        >
                            <option value="dark">Escuro</option>
                            <option value="light">Claro</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Fonte do Sistema</label>
                        <select 
                            className="w-full bg-[#1E293B] border border-slate-700 rounded-lg p-3 text-white focus:border-violet-500 outline-none"
                            value={config.theme.font}
                            onChange={e => setConfig({...config, theme: {...config.theme, font: e.target.value}})}
                        >
                            <option value="Inter">Inter (Padrão)</option>
                            <option value="Roboto">Roboto</option>
                            <option value="Poppins">Poppins</option>
                        </select>
                    </div>
                </div>
             </div>
          </div>
      )}

      {/* --- TAB: PLANS --- */}
      {activeTab === 'plans' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
             {(Object.entries(config.plans) as [string, PlanDetails][]).map(([key, plan]) => (
                <div key={key} className="bg-[#0F172A] border border-slate-800 rounded-xl p-6 md:p-8">
                    <div className="flex items-center space-x-2 mb-6">
                         <Crown size={20} className={key === 'free' ? 'text-slate-400' : 'text-white'} style={key !== 'free' ? { color: config.theme.primaryColor } : {}} />
                         <h3 className="text-lg font-bold text-white capitalize">Plano {key}</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Nome do Plano</label>
                            <input 
                                type="text" 
                                className="w-full bg-[#1E293B] border border-slate-700 rounded-lg p-3 text-white focus:border-violet-500 outline-none"
                                value={plan.name}
                                onChange={e => {
                                    const newPlans = { ...config.plans, [key]: { ...plan, name: e.target.value } };
                                    setConfig({ ...config, plans: newPlans });
                                }}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Preço (R$)</label>
                            <input 
                                type="number" 
                                className="w-full bg-[#1E293B] border border-slate-700 rounded-lg p-3 text-white focus:border-violet-500 outline-none"
                                value={plan.price}
                                onChange={e => {
                                    const newPlans = { ...config.plans, [key]: { ...plan, price: parseFloat(e.target.value) } };
                                    setConfig({ ...config, plans: newPlans });
                                }}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Limite de Cartazes</label>
                            <input 
                                type="number" 
                                className="w-full bg-[#1E293B] border border-slate-700 rounded-lg p-3 text-white focus:border-violet-500 outline-none"
                                value={plan.limit}
                                onChange={e => {
                                    const newPlans = { ...config.plans, [key]: { ...plan, limit: parseInt(e.target.value) } };
                                    setConfig({ ...config, plans: newPlans });
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-800 pt-4">
                        <span className="text-slate-400 font-medium">Plano Ativo</span>
                        <div 
                            className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${plan.active ? '' : 'bg-slate-600'}`}
                            style={plan.active ? { backgroundColor: config.theme.primaryColor } : {}}
                            onClick={() => {
                                const newPlans = { ...config.plans, [key]: { ...plan, active: !plan.active } };
                                setConfig({ ...config, plans: newPlans });
                            }}
                        >
                             <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${plan.active ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </div>
                    </div>
                </div>
             ))}
          </div>
      )}

      {/* --- TAB: SITE --- */}
      {activeTab === 'site' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
             
             {/* General Info */}
             <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-6 md:p-8">
                 <div className="flex items-center space-x-2 mb-6">
                     <Globe size={20} style={{ color: config.theme.primaryColor }} />
                     <h3 className="text-lg font-bold text-white">Informações do Site</h3>
                 </div>

                 <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Nome do Sistema</label>
                        <input 
                            type="text" 
                            className="w-full bg-[#1E293B] border border-slate-700 rounded-lg p-3 text-white focus:border-violet-500 outline-none"
                            value={config.site.name}
                            onChange={e => setConfig({...config, site: {...config.site, name: e.target.value}})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Descrição</label>
                        <input 
                            type="text" 
                            className="w-full bg-[#1E293B] border border-slate-700 rounded-lg p-3 text-white focus:border-violet-500 outline-none"
                            value={config.site.description}
                            onChange={e => setConfig({...config, site: {...config.site, description: e.target.value}})}
                        />
                    </div>
                 </div>

                 <div className="mt-8 pt-8 border-t border-slate-800">
                     <label className="block text-sm font-medium text-slate-400 mb-2">Logo Principal (Navbar Aberto)</label>
                     <p className="text-xs text-slate-600 mb-4">Logo exibida quando a barra lateral está aberta</p>
                     
                     <div className="border-2 border-dashed border-slate-700 hover:border-violet-500 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#1E293B]/30">
                         <Upload size={24} className="text-slate-500 mb-2" />
                         <span className="text-slate-500 text-sm">Clique para enviar logo principal</span>
                     </div>
                 </div>

                 <div className="mt-8">
                     <label className="block text-sm font-medium text-slate-400 mb-2">Logo Pequena (Navbar Fechado)</label>
                     <p className="text-xs text-slate-600 mb-4">Logo exibida quando a barra lateral está recolhida</p>
                     
                     <div className="border-2 border-dashed border-slate-700 hover:border-violet-500 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#1E293B]/30">
                         <Upload size={24} className="text-slate-500 mb-2" />
                         <span className="text-slate-500 text-sm">Clique para enviar logo pequena</span>
                     </div>
                 </div>
             </div>

             {/* Contact */}
             <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-6 md:p-8">
                 <div className="flex items-center space-x-2 mb-6">
                     <h3 className="text-lg font-bold text-white">Contato e Suporte</h3>
                 </div>
                 
                 <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">WhatsApp de Suporte</label>
                        <input 
                            type="text" 
                            className="w-full bg-[#1E293B] border border-slate-700 rounded-lg p-3 text-white focus:border-violet-500 outline-none"
                            value={config.site.whatsapp}
                            onChange={e => setConfig({...config, site: {...config.site, whatsapp: e.target.value}})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">E-mail de Suporte</label>
                        <input 
                            type="text" 
                            className="w-full bg-[#1E293B] border border-slate-700 rounded-lg p-3 text-white focus:border-violet-500 outline-none"
                            value={config.site.email}
                            onChange={e => setConfig({...config, site: {...config.site, email: e.target.value}})}
                        />
                    </div>
                 </div>
             </div>
          </div>
      )}

    </div>
  );
};
