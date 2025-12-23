
import React, { useState } from 'react';
import { Sparkles, Plus, Image as ImageIcon, Calendar, ChevronRight, LayoutGrid, FileImage, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const VisionHome: React.FC = () => {
  const navigate = useNavigate();
  const [encartes, setEncartes] = useState([]);

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      {/* Standalone Vision Header */}
      <header className="bg-[#0F172A] border-b border-slate-800 p-4 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div className="flex items-center gap-3">
                  <div className="bg-amber-600 p-2 rounded-lg text-white">
                      <Sparkles size={24} />
                  </div>
                  <div>
                      <h1 className="text-xl font-bold tracking-tight">RexCart <span className="text-amber-500">Vision</span></h1>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Estúdio de Encartes</p>
                  </div>
              </div>
              <Button 
                variant="ghost" 
                onClick={() => window.close()} 
                className="text-slate-400 hover:text-white"
              >
                  Fechar Estúdio
              </Button>
          </div>
      </header>

      <div className="max-w-7xl mx-auto p-8 space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div>
              <h2 className="text-2xl font-bold text-white mb-1">Meus Encartes</h2>
              <p className="text-slate-400 text-sm">Editor profissional de encartes e tabloides para redes sociais.</p>
           </div>
           <Button 
              onClick={() => navigate('/vision/templates')}
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 border-none shadow-lg shadow-amber-500/20 font-bold px-8"
           >
              <Plus size={18} className="mr-2" />
              Criar Novo Encarte
           </Button>
        </div>

        {encartes.length === 0 ? (
            <div className="bg-[#0F172A] border border-slate-800 rounded-2xl flex flex-col items-center justify-center p-20 text-center space-y-6">
                <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center border border-slate-700">
                    <LayoutGrid size={40} className="text-slate-500" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white mb-2">Seu estúdio de encartes</h3>
                    <p className="text-slate-400 max-w-sm mx-auto">
                        Crie encartes personalizados para o Instagram Feed, Stories ou Impressão em segundos.
                    </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/vision/templates')}
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                    Ver Modelos Disponíveis
                </Button>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Listagem de encartes */}
            </div>
        )}

        {/* Categorias e Benefícios Rápidos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
            <div className="bg-[#0F172A] p-6 rounded-xl border border-slate-800 group hover:border-amber-500/50 transition-all">
                <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-500 mb-4 group-hover:scale-110 transition-transform">
                    <FileImage size={24} />
                </div>
                <h4 className="text-white font-bold mb-1">Exportação HQ</h4>
                <p className="text-slate-500 text-xs">Artes em alta definição prontas para suas redes sociais.</p>
            </div>
            <div className="bg-[#0F172A] p-6 rounded-xl border border-slate-800 group hover:border-violet-500/50 transition-all">
                <div className="w-12 h-12 bg-violet-500/10 rounded-lg flex items-center justify-center text-violet-500 mb-4 group-hover:scale-110 transition-transform">
                    <Sparkles size={24} />
                </div>
                <h4 className="text-white font-bold mb-1">Grid Inteligente</h4>
                <p className="text-slate-500 text-xs">Os produtos se alinham sozinhos. Sem estresse com alinhamento.</p>
            </div>
            <div className="bg-[#0F172A] p-6 rounded-xl border border-slate-800 group hover:border-emerald-500/50 transition-all">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500 mb-4 group-hover:scale-110 transition-transform">
                    <LayoutGrid size={24} />
                </div>
                <h4 className="text-white font-bold mb-1">Múltiplos Formatos</h4>
                <p className="text-slate-500 text-xs">Stories, Feed e A4. Crie uma vez, use em todo lugar.</p>
            </div>
        </div>
      </div>
    </div>
  );
};
