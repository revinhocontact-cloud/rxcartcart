
import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, Check, Printer, Box, ArrowRight, LayoutTemplate, Scaling, X, Move, Plus, RotateCcw, Image as ImageIcon, Tag, Percent, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { MockService } from '../../services/mockService';
import { Product, PosterConfig, PaperSize, CampaignType, CAMPAIGN_STYLES, PAPER_DIMENSIONS, PosterLayoutConfig, Template } from '../../types';
import { PosterView } from '../../components/poster/PosterView';
import { useNavigate } from 'react-router-dom';

export const CreatePoster: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [customTemplates, setCustomTemplates] = useState<Template[]>([]);
  
  // Edit State
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editOldPrice, setEditOldPrice] = useState<string>(''); 
  const [editDesc, setEditDesc] = useState<string>('');
  const [editUnit, setEditUnit] = useState<string>('');
  const [isOfferMode, setIsOfferMode] = useState(false); // Toggle for De/Por system
  
  // Config State
  const [selectedSize, setSelectedSize] = useState<PaperSize>(PaperSize.A4);
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignType>(CampaignType.OFFER);
  
  // Custom Template State
  const [activeTemplate, setActiveTemplate] = useState<Template | null>(null);

  // Layout Adjustment State
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [layoutConfig, setLayoutConfig] = useState<PosterLayoutConfig>({
      productName: { x: 0, y: 0, scale: 1 },
      price: { x: 0, y: 0, scale: 1 },
      description: { x: 0, y: 0, scale: 1 },
      priceBg: { x: 0, y: 0, scale: 1 },
      logo: { x: 0, y: 0, scale: 1 }
  });

  // Load Custom Templates
  useEffect(() => {
    MockService.getTemplates().then(setCustomTemplates);
  }, []);

  // Search Logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 0) {
        const results = await MockService.searchProducts(searchQuery);
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setEditPrice(product.price);
    setEditDesc(product.description || '');
    setEditUnit(product.unit);
    
    // Check if product has valid old price to auto-enable offer mode
    if (product.oldPrice && product.oldPrice > product.price) {
        setEditOldPrice(product.oldPrice.toString());
        setIsOfferMode(true);
        setSelectedCampaign(CampaignType.OFFER);
    } else {
        setEditOldPrice('');
        setIsOfferMode(false);
        setSelectedCampaign(CampaignType.NORMAL);
    }
    
    // Reset layout
    setActiveTemplate(null);
    setLayoutConfig({
        productName: { x: 0, y: 0, scale: 1 },
        price: { x: 0, y: 0, scale: 1 },
        description: { x: 0, y: 0, scale: 1 },
    });
    setStep(2);
  };

  const handleSelectCustomTemplate = (template: Template) => {
    setActiveTemplate(template);
    setSelectedCampaign(CampaignType.CUSTOM); // Mark as custom
    
    // Load layout from template
    setLayoutConfig(template.layout || {
        productName: { x: 0, y: 0, scale: 1 },
        price: { x: 0, y: 0, scale: 1 },
        description: { x: 0, y: 0, scale: 1 }
    });
  };

  const currentConfig: PosterConfig = selectedProduct ? {
    id: 'preview',
    productId: selectedProduct.id,
    productName: selectedProduct.name,
    price: editPrice,
    oldPrice: isOfferMode && editOldPrice ? parseFloat(editOldPrice) : undefined,
    unit: editUnit,
    description: editDesc,
    campaign: selectedCampaign,
    size: selectedSize,
    layout: layoutConfig,
    
    // Inject Custom Template Assets if active
    backgroundImageUrl: activeTemplate?.baseImageUrl,
    priceBgUrl: activeTemplate?.priceBgUrl,
    logoUrl: activeTemplate?.logoUrl,

    createdAt: new Date().toISOString()
  } : {} as PosterConfig;

  // Calculate Discount Percentage
  const discountPercent = isOfferMode && editOldPrice && parseFloat(editOldPrice) > editPrice
      ? Math.round(((parseFloat(editOldPrice) - editPrice) / parseFloat(editOldPrice)) * 100)
      : 0;

  // ... (Print/Add logic remains same)
  const handlePrintNow = async () => {
    if (!selectedProduct) return;
    const uniqueId = Math.random().toString(36).substr(2, 9);
    const finalConfig = { ...currentConfig, id: uniqueId };
    try {
        await MockService.addToQueue(finalConfig);
        navigate(`/print?ids=${uniqueId}`);
    } catch (e) { alert('Erro: ' + e); }
  };

  const handleAddAndCreateAnother = async () => {
    if (!selectedProduct) return;
    const uniqueId = Math.random().toString(36).substr(2, 9);
    const finalConfig = { ...currentConfig, id: uniqueId };
    try {
        await MockService.addToQueue(finalConfig);
        setStep(1);
        setSelectedProduct(null);
        setSearchQuery('');
        setEditPrice(0);
        setActiveTemplate(null);
        // ... reset rest
    } catch (e) { alert('Erro: ' + e); }
  };

  // Helper to render steps
  const StepIndicator = ({ num, label, active, completed }: { num: number, label: string, active: boolean, completed: boolean }) => {
    // ... (Keep existing implementation)
    if (completed) return <div className="flex items-center space-x-2 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20 text-emerald-400"><Check size={14} /><span className="text-sm font-medium">{label}</span></div>;
    if (active) return <div className="flex items-center space-x-2 bg-violet-600 px-4 py-2 rounded-full shadow-lg shadow-violet-500/30 text-white"><span className="text-sm font-bold">{num}</span><span className="text-sm font-medium">{label}</span></div>;
    return <div className="flex items-center space-x-2 bg-slate-800 px-4 py-2 rounded-full text-slate-500 border border-slate-700"><span className="text-sm font-medium">{num}</span><span className="text-sm">{label}</span></div>;
  };

  // Controls for Layout Modal
  const AdjustmentControl = ({ label, target }: { label: string, target: keyof PosterLayoutConfig }) => {
     // ... (Keep existing implementation but cast target safely)
     const current = layoutConfig[target] || { x: 0, y: 0, scale: 1 };
     return (
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 mb-4">
            <h4 className="text-white text-sm font-bold mb-3 flex items-center gap-2">
                <Move size={14} className="text-violet-400" /> {label}
            </h4>
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="text-[10px] text-slate-500 uppercase font-bold">X</label>
                    <input type="range" min="-300" max="300" value={current.x} onChange={(e) => setLayoutConfig({ ...layoutConfig, [target]: { ...current, x: parseInt(e.target.value) } })} className="w-full h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer mt-2 accent-violet-500" />
                </div>
                <div>
                    <label className="text-[10px] text-slate-500 uppercase font-bold">Y</label>
                    <input type="range" min="-400" max="400" value={current.y} onChange={(e) => setLayoutConfig({ ...layoutConfig, [target]: { ...current, y: parseInt(e.target.value) } })} className="w-full h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer mt-2 accent-violet-500" />
                </div>
                <div>
                    <label className="text-[10px] text-slate-500 uppercase font-bold">Zoom</label>
                    <input type="range" min="0.5" max="3" step="0.1" value={current.scale} onChange={(e) => setLayoutConfig({ ...layoutConfig, [target]: { ...current, scale: parseFloat(e.target.value) } })} className="w-full h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer mt-2 accent-violet-500" />
                </div>
            </div>
        </div>
     );
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      
      {/* Header Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
              <div className="flex items-center text-slate-400 mb-1 cursor-pointer hover:text-white" onClick={() => step > 1 ? setStep(step - 1 as any) : navigate('/dashboard')}>
                 <ChevronLeft size={16} />
                 <span className="text-xs ml-1">Voltar</span>
              </div>
              <h1 className="text-2xl font-bold text-white">Criar Cartaz</h1>
          </div>
          <div className="flex items-center space-x-4 overflow-x-auto no-scrollbar py-2">
              <StepIndicator num={1} label="Produto" active={step === 1} completed={step > 1} />
              <div className="w-8 h-px bg-slate-700"></div>
              <StepIndicator num={2} label="Template" active={step === 2} completed={step > 2} />
              <div className="w-8 h-px bg-slate-700"></div>
              <StepIndicator num={3} label="Tamanho" active={step === 3} completed={step > 3} />
              <div className="w-8 h-px bg-slate-700"></div>
              <StepIndicator num={4} label="Preview" active={step === 4} completed={step > 4} />
          </div>
      </div>

      {/* STEP 1: SELECT PRODUCT */}
      {step === 1 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-6 mb-6">
              <h2 className="text-white font-semibold mb-4">Selecione o Produto</h2>
              <div className="relative mb-6">
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
                <input
                    type="text"
                    placeholder="Buscar produto..."
                    className="w-full pl-12 pr-4 py-3 bg-[#1E293B] border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none placeholder-slate-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                />
              </div>
              <div className="space-y-3">
                 {searchResults.length > 0 ? (
                     searchResults.map(product => (
                         <div key={product.id} onClick={() => handleSelectProduct(product)} className="bg-[#1E293B] hover:bg-slate-700 border border-slate-700 hover:border-violet-500/50 p-4 rounded-lg cursor-pointer transition-all flex items-center justify-between group">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-slate-800 rounded-lg text-slate-400 group-hover:text-violet-400 group-hover:bg-slate-900 transition-colors"><Box size={24} /></div>
                                <div><h3 className="text-white font-medium text-lg">{product.name}</h3><p className="text-slate-500 text-sm">Cód: {product.code}</p></div>
                            </div>
                            <div className="text-right"><span className="text-violet-400 font-bold text-xl">R$ {product.price.toFixed(2)}</span></div>
                         </div>
                     ))
                 ) : (
                    <div className="text-center py-12 text-slate-600"><Box size={48} className="mx-auto mb-4 opacity-50" /><p>Digite o nome ou código do produto para buscar</p></div>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* STEP 2: TEMPLATE & EDIT */}
      {step === 2 && selectedProduct && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-6">
                {/* Product Data Edit - Pricing System */}
                <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-white font-semibold flex items-center gap-2">
                            <Tag size={18} className="text-violet-400" />
                            Preço e Detalhes
                        </h2>
                        <button onClick={() => setStep(1)} className="text-xs text-slate-500 hover:text-white flex items-center"><ChevronLeft size={12} className="mr-1" /> Voltar</button>
                    </div>

                    {/* Main Price Input */}
                    <div className="mb-6">
                        <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wide">
                            Preço de Venda (POR)
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">R$</span>
                            <input 
                                type="number" 
                                step="0.01"
                                className="w-full bg-[#1E293B] border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white text-2xl font-bold focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none"
                                value={editPrice} 
                                onChange={e => setEditPrice(parseFloat(e.target.value))} 
                            />
                        </div>
                    </div>

                    {/* Offer Toggle System */}
                    <div className={`border rounded-xl p-4 transition-all duration-300 mb-6 ${isOfferMode ? 'bg-violet-900/10 border-violet-500/50' : 'bg-[#1E293B] border-slate-700'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Percent size={18} className={isOfferMode ? "text-violet-400" : "text-slate-500"} />
                                <span className={`text-sm font-bold ${isOfferMode ? "text-white" : "text-slate-400"}`}>Fazer Oferta (De/Por)</span>
                            </div>
                            <div 
                                onClick={() => {
                                    if (!isOfferMode) {
                                        // Activating
                                        setSelectedCampaign(CampaignType.OFFER);
                                        // Default "De" price suggestion (10% higher)
                                        if(!editOldPrice) setEditOldPrice((editPrice * 1.10).toFixed(2));
                                    } else {
                                        // Deactivating
                                        if (selectedCampaign === CampaignType.OFFER) setSelectedCampaign(CampaignType.NORMAL);
                                    }
                                    setIsOfferMode(!isOfferMode);
                                }}
                                className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${isOfferMode ? 'bg-violet-600' : 'bg-slate-600'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${isOfferMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </div>
                        </div>

                        {/* Expandable Offer Input */}
                        {isOfferMode && (
                            <div className="animate-in fade-in slide-in-from-top-2">
                                <div className="flex gap-4 items-start">
                                    <div className="flex-1">
                                        <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase">Preço Anterior (DE)</label>
                                        <input 
                                            type="number" 
                                            step="0.01"
                                            className="w-full bg-[#020617] border border-slate-600 rounded-lg p-3 text-white focus:border-violet-500 outline-none"
                                            value={editOldPrice} 
                                            onChange={e => setEditOldPrice(e.target.value)} 
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="flex items-center h-[70px]">
                                        {discountPercent > 0 ? (
                                            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-2 rounded-lg text-center">
                                                <span className="block text-lg font-bold">{discountPercent}%</span>
                                                <span className="text-[10px] font-bold uppercase">OFF</span>
                                            </div>
                                        ) : (
                                            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-2 rounded-lg flex items-center justify-center h-[52px] w-[60px]">
                                                <AlertCircle size={20} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Validation Message */}
                                {editOldPrice && parseFloat(editOldPrice) <= editPrice && (
                                    <p className="text-xs text-red-400 mt-2 flex items-center">
                                        <AlertCircle size={12} className="mr-1" />
                                        O preço "De" deve ser maior que o preço "Por".
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1.5">Unidade de Medida</label>
                            <select className="w-full bg-[#1E293B] border border-slate-700 rounded-lg p-2.5 text-white focus:border-violet-500 outline-none" value={editUnit} onChange={e => setEditUnit(e.target.value)}>
                                <option value="UN">UN (Unidade)</option>
                                <option value="KG">KG (Quilo)</option>
                                <option value="CX">CX (Caixa)</option>
                                <option value="PC">PC (Peça)</option>
                                <option value="LT">LT (Litro)</option>
                                <option value="DZ">DZ (Dúzia)</option>
                                <option value="g">gramas (g)</option>
                                <option value="ml">ml</option>
                            </select>
                        </div>
                        <div>
                             <label className="block text-xs font-medium text-slate-400 mb-1.5">Descrição Adicional</label>
                             <input type="text" placeholder="Ex: Marca X, 500g" className="w-full bg-[#1E293B] border border-slate-700 rounded-lg p-2.5 text-white focus:border-violet-500 outline-none placeholder-slate-600" value={editDesc} onChange={e => setEditDesc(e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* Templates Section */}
                <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-6">
                    <h2 className="text-white font-semibold mb-4">Escolha o Modelo</h2>
                    
                    {/* Standard Campaigns */}
                    <div className="mb-6">
                        <p className="text-xs text-slate-500 uppercase font-bold mb-2">Padrões do Sistema</p>
                        <div className="grid grid-cols-3 gap-2">
                            {Object.values(CampaignType).filter(c => c !== CampaignType.CUSTOM).map(c => (
                                <div key={c} onClick={() => { setSelectedCampaign(c); setActiveTemplate(null); }} className={`cursor-pointer rounded-lg p-2 text-center text-xs font-bold border transition-all ${selectedCampaign === c && !activeTemplate ? 'bg-violet-600 text-white border-violet-500' : 'bg-[#1E293B] text-slate-400 border-slate-700 hover:border-slate-500'}`}>
                                    {CAMPAIGN_STYLES[c].label}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Custom Templates */}
                    {customTemplates.length > 0 && (
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-bold mb-2">Meus Templates</p>
                            <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto no-scrollbar">
                                {customTemplates.map(t => (
                                    <div 
                                        key={t.id} 
                                        onClick={() => handleSelectCustomTemplate(t)}
                                        className={`cursor-pointer rounded-lg p-2 border transition-all flex items-center gap-3 ${activeTemplate?.id === t.id ? 'bg-violet-600/20 border-violet-500' : 'bg-[#1E293B] border-slate-700 hover:border-slate-500'}`}
                                    >
                                        <div className="w-10 h-10 rounded bg-slate-800 flex-shrink-0 overflow-hidden">
                                            <img src={t.baseImageUrl} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className={`text-xs font-bold truncate ${activeTemplate?.id === t.id ? 'text-violet-400' : 'text-white'}`}>{t.name}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-6">
                        <Button fullWidth onClick={() => setStep(3)}>Continuar para Tamanho <ArrowRight size={16} className="ml-2" /></Button>
                    </div>
                </div>
            </div>

            {/* Preview Panel */}
            <div className="flex justify-center items-start">
                <div className="bg-[#0F172A] p-4 rounded-xl border border-slate-800 shadow-2xl sticky top-8">
                    <div className="w-[320px]">
                        <PosterView config={currentConfig} />
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* STEP 3 & 4 (Sizes & Preview) - Basic logic reused */}
      {step === 3 && selectedProduct && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Same size selection UI as before */}
            <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-white font-semibold">Escolha o Tamanho</h2>
                    <button onClick={() => setStep(2)} className="text-xs text-slate-500 hover:text-white flex items-center"><ChevronLeft size={12} className="mr-1" /> Voltar</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {Object.entries(PAPER_DIMENSIONS).map(([key, data]) => (
                        <div key={key} onClick={() => { setSelectedSize(key as PaperSize); setStep(4); }} className={`group cursor-pointer rounded-xl border-2 p-6 flex flex-col items-center justify-center transition-all h-64 ${selectedSize === key ? 'bg-[#1E293B] border-violet-500 shadow-lg shadow-violet-500/20' : 'bg-[#1E293B] border-slate-700 hover:border-slate-500 hover:bg-slate-800'}`}>
                            <div className={`border border-slate-500 rounded mb-4 bg-slate-700/50 ${key === 'A3' ? 'w-16 h-24' : key === 'A4' ? 'w-12 h-16' : key === 'A5' ? 'w-10 h-14' : 'w-8 h-12'}`}></div>
                            <h3 className={`text-2xl font-bold mb-1 ${selectedSize === key ? 'text-violet-400' : 'text-white group-hover:text-white'}`}>{data.label}</h3>
                            <p className="text-slate-500 text-sm">{data.dim.replace(' x ', ' × ')}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      )}

      {step === 4 && selectedProduct && (
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-8 flex items-center justify-center relative">
                 <div className="w-[300px] shadow-2xl">
                     <PosterView config={currentConfig} />
                 </div>
             </div>
             <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-6 h-fit">
                 {/* Summary & Actions */}
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-white font-semibold">Finalizar</h2>
                    <button onClick={() => setStep(3)} className="text-xs text-slate-500 hover:text-white flex items-center"><ChevronLeft size={12} className="mr-1" /> Voltar</button>
                 </div>
                 <div className="space-y-4 mb-8">
                     <div className="flex justify-between items-center py-3 border-b border-slate-800"><span className="text-slate-400 text-sm">Produto</span><span className="text-white font-medium text-right max-w-[200px] truncate">{selectedProduct.name}</span></div>
                     <div className="flex justify-between items-center py-3 border-b border-slate-800"><span className="text-slate-400 text-sm">Preço</span><span className="text-violet-400 font-bold">R$ {editPrice.toFixed(2)}</span></div>
                     <div className="flex justify-between items-center py-3 border-b border-slate-800"><span className="text-slate-400 text-sm">Template</span><span className="text-white">{activeTemplate ? activeTemplate.name : CAMPAIGN_STYLES[selectedCampaign].label}</span></div>
                 </div>
                 <Button variant="outline" fullWidth className="mb-3 bg-white hover:bg-slate-100 text-slate-900 border-white" onClick={() => setIsAdjustmentModalOpen(true)}><Scaling size={16} className="mr-2" /> Ajustes de Texto</Button>
                 <Button variant="primary" fullWidth className="mb-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 py-3" onClick={handlePrintNow}><Printer size={16} className="mr-2" /> Imprimir Agora</Button>
                 <Button variant="secondary" fullWidth onClick={handleAddAndCreateAnother}><Plus size={16} className="mr-2" /> Adicionar e Criar Outro</Button>
             </div>
         </div>
      )}

      {/* ADJUSTMENT MODAL */}
      {isAdjustmentModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-[#0F172A] border border-slate-700 rounded-xl w-full max-w-4xl shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[90vh]">
                  <div className="w-full md:w-1/2 p-6 overflow-y-auto border-r border-slate-800">
                      <div className="flex justify-between items-center mb-6">
                          <h2 className="text-lg font-bold text-white">Ajustes de Texto</h2>
                          <div className="flex gap-2"><button onClick={() => setLayoutConfig(activeTemplate?.layout || { productName: { x: 0, y: 0, scale: 1 }, price: { x: 0, y: 0, scale: 1 }, description: { x: 0, y: 0, scale: 1 } })} className="text-xs text-slate-400 hover:text-white flex items-center bg-slate-800 px-2 py-1 rounded"><RotateCcw size={12} className="mr-1" /> Resetar</button></div>
                      </div>
                      <div className="space-y-6">
                          <AdjustmentControl label="Nome do Produto" target="productName" />
                          <AdjustmentControl label="Preço" target="price" />
                          <AdjustmentControl label="Descrição / Detalhes" target="description" />
                          
                          {/* Show extra controls only if template assets exist */}
                          {activeTemplate?.priceBgUrl && <AdjustmentControl label="Fundo Preço" target="priceBg" />}
                          {activeTemplate?.logoUrl && <AdjustmentControl label="Logo" target="logo" />}
                      </div>
                      <Button fullWidth className="mt-4" onClick={() => setIsAdjustmentModalOpen(false)}><Check size={16} className="mr-2" /> Concluir Ajustes</Button>
                  </div>
                  <div className="w-full md:w-1/2 bg-slate-900 p-8 flex items-center justify-center relative">
                       <button onClick={() => setIsAdjustmentModalOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X size={24} /></button>
                       <div className="w-[300px] shadow-2xl border border-slate-700"><PosterView config={currentConfig} /></div>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};
