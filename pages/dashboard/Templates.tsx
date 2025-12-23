
import React, { useState, useEffect } from 'react';
import { Plus, Palette, Upload, X, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { MockService } from '../../services/mockService';
import { Template } from '../../types';

export const Templates: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateTemplate = async () => {
    if (!newTemplateName || !selectedImage) return;

    const newTemplate: Template = {
      id: '',
      name: newTemplateName,
      imageUrl: selectedImage,
      createdAt: new Date().toISOString()
    };

    await MockService.addTemplate(newTemplate);
    loadTemplates();
    setIsModalOpen(false);
    setNewTemplateName('');
    setSelectedImage(null);
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
                  <div key={tpl.id} className="bg-[#1E293B] border border-slate-700 rounded-xl overflow-hidden hover:border-violet-500/50 transition-all group">
                      <div className="aspect-[210/297] bg-slate-800 relative overflow-hidden">
                          <img src={tpl.imageUrl} alt={tpl.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-4 bg-[#1E293B]">
                          <h3 className="text-white font-bold truncate">{tpl.name}</h3>
                          <p className="text-xs text-slate-500 mt-1">Customizado</p>
                      </div>
                  </div>
              ))}
          </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#0F172A] border border-slate-700 rounded-xl w-full max-w-lg shadow-2xl relative">
                <div className="flex justify-between items-center p-6 border-b border-slate-800">
                    <h2 className="text-xl font-bold text-white">Novo Template</h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-white mb-2">Nome do Template *</label>
                        <input 
                            type="text" 
                            placeholder="Ex: Cartaz Oferta"
                            className="w-full bg-[#1E293B] border border-slate-700 rounded-lg p-3 text-white focus:border-violet-500 outline-none placeholder-slate-600"
                            value={newTemplateName}
                            onChange={e => setNewTemplateName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-white mb-2">Imagem do Cartaz (PNG) *</label>
                        <div className="relative">
                            <input 
                                type="file" 
                                accept="image/png, image/jpeg"
                                className="hidden" 
                                id="template-upload"
                                onChange={handleImageUpload}
                            />
                            <label 
                                htmlFor="template-upload"
                                className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                                    selectedImage 
                                    ? 'border-violet-500 bg-violet-500/10' 
                                    : 'border-slate-700 hover:border-violet-500 hover:bg-slate-800'
                                }`}
                            >
                                {selectedImage ? (
                                    <div className="flex flex-col items-center text-violet-300">
                                        <ImageIcon size={32} className="mb-2" />
                                        <span className="text-sm font-medium">Imagem selecionada</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center text-slate-400">
                                        <Upload size={32} className="mb-2" />
                                        <span className="text-sm">Cartaz base A4</span>
                                    </div>
                                )}
                            </label>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button 
                            variant="secondary" 
                            fullWidth 
                            onClick={() => setIsModalOpen(false)}
                            className="bg-white hover:bg-slate-200 text-slate-900 font-bold"
                        >
                            Cancelar
                        </Button>
                        <Button 
                            fullWidth
                            disabled={!newTemplateName || !selectedImage}
                            onClick={handleCreateTemplate}
                            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold border-none"
                        >
                            Criar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};
