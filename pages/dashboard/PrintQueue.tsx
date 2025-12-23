
import React, { useState, useEffect } from 'react';
import { Trash2, Printer, CheckSquare, Square, ChevronRight, Check } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { MockService } from '../../services/mockService';
import { PrintQueueItem, PaperSize, PAPER_DIMENSIONS } from '../../types';
import { PosterView } from '../../components/poster/PosterView';
import { useNavigate } from 'react-router-dom';

export const PrintQueue: React.FC = () => {
  const navigate = useNavigate();
  const [queue, setQueue] = useState<PrintQueueItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const loadQueue = async () => {
      try {
          const data = await MockService.getQueue();
          setQueue(data);
      } catch (e) {
          console.error(e);
      }
  };

  useEffect(() => {
    loadQueue();
  }, []);

  const handleRemove = async (ids: string[]) => {
    if(confirm(`Remover ${ids.length} cartaz(es) da fila?`)) {
        for (const id of ids) {
            await MockService.removeFromQueue(id);
        }
        setSelectedIds(prev => prev.filter(pid => !ids.includes(pid)));
        loadQueue();
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === queue.length) {
        setSelectedIds([]);
    } else {
        setSelectedIds(queue.map(i => i.id));
    }
  };

  const toggleSelection = (id: string) => {
      if (selectedIds.includes(id)) {
          setSelectedIds(prev => prev.filter(i => i !== id));
      } else {
          setSelectedIds(prev => [...prev, id]);
      }
  };

  const handlePrint = () => {
      if (selectedIds.length === 0) {
          alert("Selecione pelo menos um cartaz para imprimir.");
          return;
      }
      
      // Navigate to dedicated print view with selected IDs
      const idsString = selectedIds.join(',');
      navigate(`/print?ids=${idsString}`);
  };

  return (
    <div className="max-w-7xl mx-auto pb-20">
      
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
         <div>
            <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white">Fila de Impressão</h1>
                <div className="bg-[#1E293B] px-3 py-1 rounded-full border border-slate-700 text-xs text-violet-400 font-medium">
                {queue.length} cartaz(es)
                </div>
            </div>
            <div className="flex items-center text-sm text-slate-500 mt-1">
                <span>Painel</span>
                <ChevronRight size={14} className="mx-1" />
                <span className="text-violet-400">Fila</span>
            </div>
         </div>

         {queue.length > 0 && (
             <div className="flex items-center gap-3 bg-[#1E293B] p-2 rounded-lg border border-slate-700">
                 <button 
                    onClick={handleSelectAll}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white transition-colors"
                 >
                    {selectedIds.length === queue.length ? <CheckSquare size={18} className="text-violet-500" /> : <Square size={18} />}
                    {selectedIds.length === queue.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
                 </button>
                 
                 <div className="h-6 w-px bg-slate-700 mx-1"></div>

                 {selectedIds.length > 0 && (
                     <button 
                        onClick={() => handleRemove(selectedIds)}
                        className="text-red-400 hover:text-red-300 text-sm font-medium px-3 py-2"
                     >
                        Excluir ({selectedIds.length})
                     </button>
                 )}

                 <Button 
                    onClick={handlePrint}
                    className="bg-violet-600 hover:bg-violet-500 text-white font-bold shadow-lg shadow-violet-900/20"
                 >
                    <Printer className="mr-2 h-4 w-4" />
                    Imprimir Selecionados ({selectedIds.length})
                 </Button>
             </div>
         )}
      </div>

      {/* Empty State */}
      {queue.length === 0 ? (
        <div className="bg-[#0F172A] border border-slate-800 rounded-xl flex flex-col items-center justify-center min-h-[500px] text-center p-8 animate-in fade-in duration-500">
            <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
                <Printer size={40} className="text-slate-500" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Fila vazia</h2>
            <p className="text-slate-400 mb-8">Adicione cartazes à fila para imprimir em lote</p>
            
            <Button 
                onClick={() => navigate('/dashboard/create')}
                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 px-8 py-3 shadow-lg shadow-violet-500/20"
            >
                Criar Novo Cartaz
            </Button>
        </div>
      ) : (
        /* Grid View (Dashboard) */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {queue.map((item) => (
                <div 
                    key={item.id} 
                    className={`relative group rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        selectedIds.includes(item.id) 
                        ? 'border-violet-500 ring-2 ring-violet-500/30' 
                        : 'border-slate-800 hover:border-slate-600'
                    }`}
                    onClick={() => toggleSelection(item.id)}
                >
                    {/* Aspect Ratio container matching paper size ratio */}
                    <div className="relative w-full bg-slate-800" style={{ aspectRatio: PAPER_DIMENSIONS[item.size].w / PAPER_DIMENSIONS[item.size].h }}>
                        {/* Scaled preview */}
                        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                             {/* Usando transform para garantir que o preview caiba no card independentemente do tamanho real */}
                             <div className="w-[200%] h-[200%] transform scale-50 origin-top-left">
                                <PosterView config={item} />
                             </div>
                        </div>

                        {/* Selection Overlay */}
                        <div className={`absolute inset-0 bg-black/40 transition-opacity flex items-center justify-center ${selectedIds.includes(item.id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                            {selectedIds.includes(item.id) && (
                                <div className="bg-violet-600 text-white rounded-full p-2 shadow-lg scale-110">
                                    <Check size={24} />
                                </div>
                            )}
                        </div>
                        
                        {/* Checkbox Top Right */}
                        <div className="absolute top-2 right-2">
                             {selectedIds.includes(item.id) 
                                ? <CheckSquare className="text-violet-500 bg-white rounded" size={20} /> 
                                : <Square className="text-white/70 drop-shadow-md" size={20} />
                             }
                        </div>
                        
                        {/* Size Badge Bottom Left */}
                        <div className="absolute bottom-2 left-2">
                            <span className="text-[10px] font-bold bg-black/70 text-white px-1.5 py-0.5 rounded backdrop-blur-sm border border-white/10">
                                {item.size}
                            </span>
                        </div>
                    </div>

                    <div className="bg-[#1E293B] p-3 border-t border-slate-700">
                         <h3 className="text-white font-medium text-xs truncate mb-1" title={item.productName}>{item.productName}</h3>
                         <div className="flex justify-between items-center">
                             <span className="text-violet-400 font-bold text-xs">R$ {item.price.toFixed(2)}</span>
                             <span className="text-[10px] text-slate-500">{item.quantity}un</span>
                         </div>
                    </div>
                </div>
            ))}
        </div>
      )}
    </div>
  );
};
