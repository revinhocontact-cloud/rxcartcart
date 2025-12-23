
import React from 'react';
import { Sparkles, ChevronLeft, Image as ImageIcon, Crown } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { VisionFormat } from '../../types';

export const VisionTemplates: React.FC = () => {
  const navigate = useNavigate();

  const templates = [
      { id: 't1', name: 'Ofertas do Dia', format: VisionFormat.FEED, category: 'Varejo', preview: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400', isPremium: false },
      { id: 't2', name: 'Stories Black', format: VisionFormat.STORY, category: 'Eletrônicos', preview: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', isPremium: true },
      { id: 't3', name: 'Tabloide Semanal', format: VisionFormat.A4, category: 'Hortifruti', preview: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400', isPremium: false },
      { id: 't4', name: 'Super Limpeza', format: VisionFormat.FEED, category: 'Limpeza', preview: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400', isPremium: true },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      {/* Header */}
      <header className="bg-[#0F172A] border-b border-slate-800 p-4 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
              <button onClick={() => navigate('/vision')} className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                  <ChevronLeft size={20} />
              </button>
              <div>
                <h1 className="text-lg font-bold text-white">Escolha um Tema</h1>
                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Base Visual</p>
              </div>
          </div>
      </header>

      <div className="max-w-7xl mx-auto p-8 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map(tpl => (
                <div 
                  key={tpl.id} 
                  onClick={() => navigate(`/vision/editor/${tpl.id}`)}
                  className="bg-[#0F172A] border border-slate-800 rounded-xl overflow-hidden cursor-pointer group hover:border-amber-500 transition-all flex flex-col"
                >
                    <div className="relative aspect-[3/4] bg-slate-900 overflow-hidden">
                        <img src={tpl.preview} alt={tpl.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button className="bg-amber-600 hover:bg-amber-500 border-none">Usar Modelo</Button>
                        </div>
                        <div className="absolute top-2 left-2">
                            <span className="bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                                {tpl.format}
                            </span>
                        </div>
                        {tpl.isPremium && (
                            <div className="absolute top-2 right-2 text-amber-500">
                                <Crown size={16} fill="currentColor" />
                            </div>
                        )}
                    </div>
                    <div className="p-4">
                        <h4 className="text-white font-bold text-sm mb-1">{tpl.name}</h4>
                        <p className="text-slate-500 text-xs">{tpl.category}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};
