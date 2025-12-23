
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as fabric from 'fabric';
import { 
  ChevronLeft, Save, Download, Plus, Trash2, 
  Type, Move, Grid, Layers, Box, Sparkles, 
  Check, X, Search, Image as ImageIcon 
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { MockService } from '../../services/mockService';
import { Product } from '../../types';

export const VisionEditor: React.FC = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<any>(null);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // --- INITIALIZE CANVAS ---
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
        width: 600,
        height: 800,
        backgroundColor: '#f8fafc',
        preserveObjectStacking: true
    });

    fabricRef.current = canvas;

    // Background placeholder
    canvas.renderAll();

    return () => {
      canvas.dispose();
    };
  }, []);

  // --- LOAD PRODUCTS ---
  useEffect(() => {
    MockService.getProducts().then(setProducts);
  }, []);

  // --- EDITOR FUNCTIONS ---
  const addText = (text: string = 'Novo Texto', options: any = {}) => {
      const fbText = new fabric.IText(text, {
          left: 100,
          top: 100,
          fontFamily: 'Inter',
          fontSize: 24,
          fill: '#000000',
          ...options
      });
      fabricRef.current.add(fbText);
      fabricRef.current.setActiveObject(fbText);
  };

  const clearCanvas = () => {
      if(confirm('Limpar toda a arte?')) {
          fabricRef.current.clear();
          fabricRef.current.backgroundColor = '#f8fafc';
          setSelectedProducts([]);
          fabricRef.current.renderAll();
      }
  };

  const removeSelected = () => {
      const activeObjects = fabricRef.current.getActiveObjects();
      fabricRef.current.remove(...activeObjects);
      fabricRef.current.discardActiveObject().renderAll();
  };

  // --- AUTO ORGANIZATION ALGORITHM ---
  const organizeGrid = () => {
    if (selectedProducts.length === 0) return;

    // Determine grid size
    const cols = selectedProducts.length <= 4 ? 2 : 3;
    const rows = Math.ceil(selectedProducts.length / cols);
    
    const margin = 30;
    const canvasW = fabricRef.current.width!;
    const availableW = canvasW - (margin * 2);
    const availableH = fabricRef.current.height! - 200;

    const itemW = availableW / cols;
    const itemH = availableH / rows;

    selectedProducts.forEach((product, index) => {
        const col = index % cols;
        const row = Math.floor(index / cols);
        
        const x = margin + (col * itemW);
        const y = 150 + (row * itemH);

        const groupItems: any[] = [];
        const rect = new fabric.Rect({
            width: itemW - 10,
            height: itemH - 10,
            fill: '#ffffff',
            stroke: '#e2e8f0',
            rx: 8, ry: 8
        });
        groupItems.push(rect);

        const nameText = new fabric.Text(product.name, {
            fontSize: 14,
            fontWeight: 'bold',
            left: 10,
            top: itemH - 50,
            width: itemW - 20,
            fontFamily: 'Inter'
        });
        groupItems.push(nameText);

        const priceText = new fabric.Text(`R$ ${product.price.toFixed(2)}`, {
            fontSize: 20,
            fontWeight: '900',
            fill: '#dc2626',
            left: 10,
            top: itemH - 35,
            fontFamily: 'Inter'
        });
        groupItems.push(priceText);

        const group = new fabric.Group(groupItems, { left: x, top: y });
        fabricRef.current.add(group);
    });

    fabricRef.current.renderAll();
  };

  const handleAddProductToEditor = (product: Product) => {
      setSelectedProducts(prev => [...prev, product]);
      setIsProductModalOpen(false);
  };

  const exportImage = () => {
      setIsExporting(true);
      const dataURL = fabricRef.current.toDataURL({ format: 'png', quality: 1 });
      const link = document.createElement('a');
      link.download = `encarte-${new Date().getTime()}.png`;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsExporting(false);
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="h-screen flex flex-col bg-[#020617] text-white">
      {/* Editor Toolbar */}
      <div className="bg-[#0F172A] border-b border-slate-800 p-4 flex items-center justify-between z-30">
          <div className="flex items-center gap-4">
              <button onClick={() => navigate('/vision/templates')} className="text-slate-400 hover:text-white transition-colors">
                  <ChevronLeft size={20} />
              </button>
              <div>
                  <h2 className="text-white font-bold text-sm">Editor RexCart Vision</h2>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Workspace Profissional</p>
              </div>
          </div>

          <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-slate-700 text-slate-300" onClick={clearCanvas}>
                  <X size={16} className="mr-2" /> Limpar
              </Button>
              <Button 
                onClick={exportImage}
                disabled={isExporting}
                className="bg-amber-600 hover:bg-amber-500 border-none font-bold" 
                size="sm"
              >
                  <Download size={16} className="mr-2" /> {isExporting ? 'Exportando...' : 'Exportar Arte'}
              </Button>
          </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
          {/* Left Panel: Tools */}
          <div className="w-16 md:w-64 bg-[#0F172A] border-r border-slate-800 flex flex-col p-4 space-y-4">
               <div className="hidden md:block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Elementos</div>
               <button onClick={() => setIsProductModalOpen(true)} className="flex items-center gap-3 w-full p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white transition-all border border-slate-700/50 group">
                   <Box size={20} className="text-amber-500 group-hover:scale-110 transition-transform" />
                   <span className="hidden md:block text-sm font-medium">Adicionar Produto</span>
               </button>
               <button onClick={() => addText()} className="flex items-center gap-3 w-full p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white transition-all border border-slate-700/50 group">
                   <Type size={20} className="text-violet-500 group-hover:scale-110 transition-transform" />
                   <span className="hidden md:block text-sm font-medium">Adicionar Texto</span>
               </button>
               <button onClick={organizeGrid} className="flex items-center gap-3 w-full p-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 transition-all border border-amber-500/20 group">
                   <Grid size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                   <span className="hidden md:block text-sm font-bold italic">Auto-Organizar Grid</span>
               </button>
               <div className="pt-4 border-t border-slate-800 mt-auto">
                   <button onClick={removeSelected} className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-all">
                       <Trash2 size={20} />
                       <span className="hidden md:block text-sm font-medium">Remover Selecionado</span>
                   </button>
               </div>
          </div>

          {/* Center: Canvas Area */}
          <div className="flex-1 bg-slate-900 p-8 flex items-center justify-center overflow-auto no-scrollbar relative">
              <div className="bg-white shadow-2xl rounded-sm overflow-hidden">
                <canvas ref={canvasRef} />
              </div>
          </div>
      </div>

      {/* MODAL: SELECT PRODUCT */}
      {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-[#0F172A] border border-slate-700 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                  <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                          <Box className="text-amber-500" />
                          <h3 className="text-lg font-bold text-white">Adicionar ao Encarte</h3>
                      </div>
                      <button onClick={() => setIsProductModalOpen(false)} className="text-slate-500 hover:text-white"><X size={24} /></button>
                  </div>
                  <div className="p-6 border-b border-slate-800 bg-slate-900/50">
                      <div className="relative">
                          <Search className="absolute left-4 top-3.5 text-slate-500" size={18} />
                          <input type="text" placeholder="Buscar produto..." className="w-full bg-[#1E293B] border border-slate-700 rounded-lg pl-12 pr-4 py-3 text-white outline-none focus:border-amber-500 transition-colors" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} autoFocus />
                      </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 space-y-3 no-scrollbar">
                      {filteredProducts.map(p => (
                          <div key={p.id} onClick={() => handleAddProductToEditor(p)} className="bg-[#1E293B] hover:bg-slate-800 border border-slate-700 p-4 rounded-xl flex items-center justify-between cursor-pointer transition-all group">
                              <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center text-slate-500"><ImageIcon size={24} /></div>
                                  <div><h4 className="text-white font-bold text-sm group-hover:text-amber-500 transition-colors">{p.name}</h4><p className="text-slate-500 text-xs">R$ {p.price.toFixed(2)}</p></div>
                              </div>
                              <Plus size={20} className="text-slate-600 group-hover:text-amber-500" />
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
