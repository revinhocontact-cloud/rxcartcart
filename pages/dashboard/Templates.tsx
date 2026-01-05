
import React, { useState, useEffect } from 'react';
import { Plus, Palette, Upload, X, ChevronRight, Image as ImageIcon, Move, Type, Check, Layout, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { MockService } from '../../services/mockService';
import { Template, PosterConfig, CampaignType, PaperSize, PosterLayoutConfig } from '../../types';
import { PosterView } from '../../components/poster/PosterView';

export const Templates: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Editor State
  const [name, setName] = useState('');
  const [baseImage, setBaseImage] = useState<string | null>(null);
  const [priceBg, setPriceBg] = useState<string | null>(null);
  const [logo, setLogo] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'layout'>('upload');

  // Layout Configuration State
  const [layoutConfig, setLayoutConfig] = useState<PosterLayoutConfig>({
      productName: { x: 0, y: -150, scale: 1, color: '#000000' },
      price: { x: 0, y: 50, scale: 1, color: '#000000' },
      description: { x: 0, y: -80, scale: 1, color: '#555555' },
      priceBg: { x: 0, y: 50, scale: 1 },
      logo: { x: 0, y: 180, scale: 1 }
  });

  // Dummy config for preview
  const previewConfig: PosterConfig = {
      id: 'template-preview',
      productId: '000',
      productName: 'PRODUTO EXEMPLO',
      price: 99.90,
      oldPrice: 129.90,
      unit: 'UN',
      description: 'Descrição de teste do produto 500g',
      campaign: CampaignType.CUSTOM,
      size: PaperSize.A4,
      backgroundImageUrl: baseImage || undefined,
      priceBgUrl: priceBg || undefined,
      logoUrl: logo || undefined,
      layout: layoutConfig,
      createdAt: new Date().toISOString()
  };

  const loadTemplates = async () => {
      try {
          const data = await MockService.getTemplates();
          setTemplates(data);
      } catch (e) {
          console.error(e);
      }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (s: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveTemplate = async () => {
    if (!name || !baseImage) return;

    const newTemplate: Template = {
      id: '',
      name,
      baseImageUrl: baseImage,
      priceBgUrl: priceBg || undefined,
      logoUrl: logo || undefined,
      layout: layoutConfig,
      createdAt: new Date().toISOString()
    };

    await MockService.addTemplate(newTemplate);
    loadTemplates();
    resetEditor();
  };

  const resetEditor = () => {
    setIsModalOpen(false);
    setName('');
    setBaseImage(null);
    setPriceBg(null);
    setLogo(null);
    setLayoutConfig({
        productName: { x: 0, y: -150, scale: 1, color: '#000000' },
        price: { x: 0, y: 50, scale: 1, color: '#000000' },
        description: { x: 0, y: -80, scale: 1, color: '#555555' },
        priceBg: { x: 0, y: 50, scale: 1 },
        logo: { x: 0, y: 180, scale: 1 }
    });
    setActiveTab('upload');
  };

  // Helper for Sliders
  const AdjustmentControl = ({ label, target, hasColor = false }: { label: string, target: keyof PosterLayoutConfig, hasColor?: boolean }) => {
      const current = layoutConfig[target] || { x: 0, y: 0, scale: 1 };
      
      return (
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 mb-4">
            <h4 className="text-white text-xs font-bold mb-3 flex items-center justify-between">
                <span className="flex items-center gap-2"><Move size={12} className="text-violet-400" /> {label}</span>
                {hasColor && (
                    <input 
                        type="color" 
                        value={current.color || '#000000'}
                        onChange={(e) => setLayoutConfig({ ...layoutConfig, [target]: { ...current, color: e.target.value } })}
                        className="w-6 h-6 rounded cursor-pointer border-none bg-transparent"
                        title="Cor do Texto"
                    />
                )}
            </h4>
            <div className="grid grid-cols-3 gap-3">
                <div>
                    <label className="text-[10px] text-slate-500 uppercase font-bold">X (Horiz)</label>
                    <input 
                        type="range" min="-300" max="300" 
                        value={current.x}
                        onChange={(e) => setLayoutConfig({ ...layoutConfig, [target]: { ...current, x: parseInt(e.target.value) } })}
                        className="w-full h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer mt-2 accent-violet-500"
                    />
                </div>
                <div>
                    <label className="text-[10px] text-slate-500 uppercase font-bold">Y (Vert)</label>
                    <input 
                        type="range" min="-400" max="400" 
                        value={current.y}
                        onChange={(e) => setLayoutConfig({ ...layoutConfig, [target]: { ...current, y: parseInt(e.target.value) } })}
                        className="w-full h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer mt-2 accent-violet-500"
                    />
                </div>
                <div>
                    <label className="text-[10px] text-slate-500 uppercase font-bold">Tamanho</label>
                    <input 
                        type="range" min="0.1" max="3" step="0.1"
                        value={current.scale}
                        onChange={(e) => setLayoutConfig({ ...layoutConfig, [target]: { ...current, scale: parseFloat(e.target.value) } })}
                        className="w-full h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer mt-2 accent-violet-500"
                    />
                </div>
            </div>
        </div>
      );
  };

  return (
    <div className="max-w-7xl mx-auto pb-20">
       
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
              <h1 className="text-2xl font-bold text-white mb-1">Meus Templates</h1>
              <div className="flex items-center text-sm text-slate-500 mt-1">
                 <span>Painel</span>
                 <ChevronRight size={14} className="mx-1" />
                 <span className="text-violet-400">Templates</span>
              </div>
          </div>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-violet-600 hover:bg-violet-500 text-white border-none shadow-lg shadow-violet-500/20"
          >
              <Plus className="w-4 h-4 mr-2" />
              Novo Template
          </Button>
      </div>

      {/* Grid */}
      {templates.length === 0 ? (
          <div className="bg-[#0F172A] border border-slate-800 rounded-xl flex flex-col items-center justify-center min-h-[400px] text-center p-8">
              <div className="bg-slate-800 p-4 rounded-full mb-4">
                  <Palette size={32} className="text-slate-500" />
              </div>
              <p className="text-slate-400">Você ainda não tem templates customizados.</p>
          </div>
      ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {templates.map(tpl => (
                  <div key={tpl.id} className="bg-[#1E293B] border border-slate-700 rounded-xl overflow-hidden hover:border-violet-500/50 transition-all group relative">
                      <div className="aspect-[210/297] bg-slate-800 relative overflow-hidden">
                          {/* Mini Preview using PosterView would be ideal, but image is simpler for list */}
                          <img src={tpl.baseImageUrl} alt={tpl.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-4 bg-[#1E293B]">
                          <h3 className="text-white font-bold truncate">{tpl.name}</h3>
                          <p className="text-xs text-slate-500 mt-1">Customizado</p>
                      </div>
                  </div>
              ))}
          </div>
      )}

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#0F172A] border border-slate-700 rounded-xl w-full max-w-6xl shadow-2xl relative h-[90vh] flex flex-col">
                
                {/* Modal Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-800">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Layout size={20} className="text-violet-400" /> 
                        Criador de Templates
                    </h2>
                    <button onClick={resetEditor} className="text-slate-500 hover:text-white">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="flex-1 flex overflow-hidden">
                    {/* LEFT PANEL: CONTROLS */}
                    <div className="w-full md:w-1/3 p-6 overflow-y-auto border-r border-slate-800 bg-[#0F172A]">
                        
                        {/* Name Input */}
                        <div className="mb-6">
                            <label className="block text-xs font-bold text-slate-400 mb-2">Nome do Template</label>
                            <input 
                                type="text" 
                                placeholder="Ex: Cartaz Fim de Ano"
                                className="w-full bg-[#1E293B] border border-slate-700 rounded-lg p-3 text-white focus:border-violet-500 outline-none"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        </div>

                        {/* Tabs */}
                        <div className="flex bg-[#1E293B] p-1 rounded-lg mb-6">
                            <button 
                                onClick={() => setActiveTab('upload')}
                                className={`flex-1 py-2 text-xs font-bold rounded-md transition-colors ${activeTab === 'upload' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
                            >
                                Imagens
                            </button>
                            <button 
                                onClick={() => setActiveTab('layout')}
                                className={`flex-1 py-2 text-xs font-bold rounded-md transition-colors ${activeTab === 'layout' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
                                disabled={!baseImage}
                            >
                                Layout & Posição
                            </button>
                        </div>

                        {activeTab === 'upload' && (
                            <div className="space-y-6 animate-in slide-in-from-left-4">
                                {/* Base Image */}
                                <div>
                                    <label className="block text-xs font-bold text-white mb-2">Fundo do Cartaz (Obrigatório)</label>
                                    <div className="relative">
                                        <input type="file" accept="image/*" className="hidden" id="base-upload" onChange={(e) => handleImageUpload(e, setBaseImage)} />
                                        <label htmlFor="base-upload" className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${baseImage ? 'border-violet-500 bg-violet-500/10' : 'border-slate-700 hover:border-violet-500 hover:bg-slate-800'}`}>
                                            {baseImage ? <div className="text-violet-300 text-xs flex flex-col items-center"><Check size={24} className="mb-1"/>Imagem carregada</div> : <div className="text-slate-500 text-xs flex flex-col items-center"><Upload size={24} className="mb-1"/>Carregar PNG/JPG</div>}
                                        </label>
                                    </div>
                                </div>

                                {/* Price BG */}
                                <div>
                                    <label className="flex justify-between text-xs font-bold text-white mb-2">
                                        Fundo do Preço (Splash)
                                        {priceBg && <span onClick={() => setPriceBg(null)} className="text-red-400 cursor-pointer hover:underline text-[10px]">Remover</span>}
                                    </label>
                                    <div className="relative">
                                        <input type="file" accept="image/*" className="hidden" id="price-upload" onChange={(e) => handleImageUpload(e, setPriceBg)} />
                                        <label htmlFor="price-upload" className={`flex flex-col items-center justify-center w-full h-20 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${priceBg ? 'border-violet-500 bg-violet-500/10' : 'border-slate-700 hover:border-violet-500 hover:bg-slate-800'}`}>
                                            <span className="text-slate-400 text-xs">Opcional: Fundo atrás do preço</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Logo */}
                                <div>
                                    <label className="flex justify-between text-xs font-bold text-white mb-2">
                                        Logomarca
                                        {logo && <span onClick={() => setLogo(null)} className="text-red-400 cursor-pointer hover:underline text-[10px]">Remover</span>}
                                    </label>
                                    <div className="relative">
                                        <input type="file" accept="image/*" className="hidden" id="logo-upload" onChange={(e) => handleImageUpload(e, setLogo)} />
                                        <label htmlFor="logo-upload" className={`flex flex-col items-center justify-center w-full h-20 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${logo ? 'border-violet-500 bg-violet-500/10' : 'border-slate-700 hover:border-violet-500 hover:bg-slate-800'}`}>
                                            <span className="text-slate-400 text-xs">Opcional: Logo da loja</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'layout' && (
                            <div className="space-y-4 animate-in slide-in-from-right-4">
                                <p className="text-xs text-slate-400 mb-2">Ajuste os controles abaixo para posicionar os elementos sobre o fundo.</p>
                                
                                <AdjustmentControl label="Nome do Produto" target="productName" hasColor />
                                <AdjustmentControl label="Preço (Valor)" target="price" hasColor />
                                <AdjustmentControl label="Descrição / Detalhes" target="description" hasColor />
                                
                                {priceBg && <AdjustmentControl label="Fundo do Preço (Imagem)" target="priceBg" />}
                                {logo && <AdjustmentControl label="Logomarca (Imagem)" target="logo" />}
                            </div>
                        )}

                    </div>

                    {/* RIGHT PANEL: LIVE PREVIEW */}
                    <div className="w-full md:w-2/3 bg-slate-900 p-8 flex items-center justify-center relative border-l border-slate-800">
                         <div className="relative shadow-2xl">
                             <div className="w-[350px]">
                                <PosterView config={previewConfig} />
                             </div>
                             {!baseImage && (
                                 <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-lg border border-slate-700">
                                     <p className="text-white font-bold">Carregue uma imagem de fundo para começar</p>
                                 </div>
                             )}
                         </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-slate-800 bg-[#0F172A] flex justify-end gap-3">
                    <Button variant="secondary" onClick={resetEditor}>Cancelar</Button>
                    <Button 
                        onClick={handleSaveTemplate} 
                        disabled={!name || !baseImage}
                        className="bg-violet-600 hover:bg-violet-500 text-white font-bold px-8"
                    >
                        Salvar Template
                    </Button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};
