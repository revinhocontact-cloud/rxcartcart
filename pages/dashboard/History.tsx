
import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, FileText, ChevronRight, Calendar, Filter, Clock, ArrowUpRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { MockService } from '../../services/mockService';
import { PosterConfig } from '../../types';
import { PosterView } from '../../components/poster/PosterView';

export const History: React.FC = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<PosterConfig[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    MockService.getHistory().then(setHistory).catch(console.error);
  }, []);

  const filteredHistory = history.filter(item => 
    item.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRequeue = async (item: PosterConfig) => {
    await MockService.addToQueue({
        ...item,
        id: '' // New ID
    });
    navigate('/dashboard/queue');
  };

  return (
    <div className="max-w-7xl mx-auto pb-20">
       {/* Header */}
       <div className="flex flex-col mb-8">
         <h1 className="text-2xl font-bold text-white">Histórico de Cartazes</h1>
         <div className="flex items-center text-sm text-slate-500 mt-1">
             <span>Visualize e gerencie todos os cartazes criados</span>
         </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
            <input 
                type="text" 
                placeholder="Buscar por nome do produto..." 
                className="w-full bg-white text-slate-900 pl-10 pr-4 py-2.5 rounded-lg border-none focus:ring-2 focus:ring-violet-500 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        
        <div className="flex gap-4">
            <button className="flex items-center justify-between px-4 py-2.5 bg-white text-slate-700 rounded-lg min-w-[140px] text-sm font-medium hover:bg-slate-50">
                <span>Todos</span>
                <ChevronDown size={14} className="ml-2 text-slate-400" />
            </button>
        </div>
      </div>

      {/* Content */}
      {history.length === 0 ? (
        // Empty State (Matches Image)
        <div className="bg-white rounded-xl flex flex-col items-center justify-center min-h-[400px] text-center p-8 shadow-sm">
            <div className="mb-4 text-slate-300">
                <FileText size={48} strokeWidth={1.5} />
            </div>
            <h3 className="text-slate-500 font-medium mb-6">Nenhum cartaz criado ainda</h3>
            
            <Button 
                onClick={() => navigate('/dashboard/create')}
                className="bg-[#F97316] hover:bg-[#EA580C] text-white font-medium px-6 py-2.5 shadow-lg shadow-orange-500/20 border-none"
            >
                Criar primeiro cartaz
            </Button>
        </div>
      ) : (
        // Grid View
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {filteredHistory.map((item) => (
                <div key={item.id} className="bg-[#1E293B] border border-slate-700 rounded-xl overflow-hidden hover:border-violet-500/50 transition-all group">
                    <div className="relative aspect-[210/297] bg-slate-800 overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center transform scale-50 origin-top-left w-[200%] h-[200%] pointer-events-none">
                            <PosterView config={item} />
                        </div>
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button size="sm" onClick={() => handleRequeue(item)} className="bg-white text-slate-900 hover:bg-slate-100 border-none">
                                <ArrowUpRight size={16} className="mr-2" />
                                Imprimir Novamente
                            </Button>
                        </div>
                    </div>
                    <div className="p-4">
                        <h3 className="text-white font-medium truncate mb-1">{item.productName}</h3>
                        <div className="flex justify-between items-center text-xs">
                             <span className="text-slate-500 flex items-center">
                                <Clock size={12} className="mr-1" />
                                {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                             </span>
                             <span className="text-violet-400 font-bold">R$ {item.price.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      )}
    </div>
  );
};
