
import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Plus, FileText, ChevronLeft, ChevronRight, X, Upload, Box, Edit, Trash2, CheckSquare, Square, Barcode, Download } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { MockService } from '../../services/mockService';
import { Product } from '../../types';

export const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Selection & Edit States
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
      code: '',
      unit: 'UN',
      name: '',
      description: '',
      price: 0,
      category: '',
      image: ''
  });

  const loadProducts = async () => {
    setIsLoading(true);
    try {
        const data = await MockService.getProducts();
        setProducts(data);
    } catch (error) {
        console.error("Error loading products", error);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Filter Logic
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.code.includes(searchTerm)
  );

  // Selection Logic
  const handleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
        setSelectedIds([]);
    } else {
        setSelectedIds(filteredProducts.map(p => p.id));
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
        setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
        setSelectedIds([...selectedIds, id]);
    }
  };

  // Delete Logic
  const handleDeleteSelected = async () => {
      if (confirm(`Tem certeza que deseja excluir ${selectedIds.length} produtos?`)) {
          setIsLoading(true);
          await Promise.all(selectedIds.map(id => MockService.deleteProduct(id)));
          await loadProducts();
          setSelectedIds([]);
      }
  };

  const handleDeleteOne = async (id: string) => {
      if (confirm('Tem certeza que deseja excluir este produto?')) {
          await MockService.deleteProduct(id);
          await loadProducts();
      }
  };

  // --- CSV EXPORT LOGIC ---
  const handleExport = () => {
      if (products.length === 0) {
          alert("Não há produtos para exportar.");
          return;
      }

      const headers = "Nome,Codigo,Preco,Unidade,Categoria,Descricao\n";
      const rows = products.map(p => {
          // Escape quotes and handle commas in content
          const name = `"${p.name.replace(/"/g, '""')}"`;
          const code = `"${p.code}"`;
          const price = p.price.toFixed(2).replace('.', ','); // Formato PT-BR
          const desc = `"${(p.description || '').replace(/"/g, '""')}"`;
          return `${name},${code},${price},${p.unit},${p.category || ''},${desc}`;
      }).join("\n");

      const csvContent = headers + rows;
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `rexcart_produtos_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  // --- CSV IMPORT LOGIC ---
  const handleImportClick = () => {
      fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsLoading(true);
      const reader = new FileReader();

      reader.onload = async (event) => {
          const text = event.target?.result as string;
          if (!text) return;

          // Tentar detectar delimitador (vírgula ou ponto e vírgula)
          const separator = text.includes(';') ? ';' : ',';
          
          const lines = text.split('\n');
          // Assumindo que a primeira linha é cabeçalho, começamos do index 1
          // Esperado: Nome, Codigo, Preco, Unidade... (ou similar)
          // Mapeamento simples baseado em posição (0: Nome, 1: Codigo, 2: Preco) 
          // ou se tiver cabeçalho, poderia ser mais robusto. Vamos usar posição para simplificar.
          
          let successCount = 0;

          for (let i = 1; i < lines.length; i++) {
              const line = lines[i].trim();
              if (!line) continue;

              // Regex simples para lidar com CSV (ignora separador dentro de aspas)
              // Mas para simplificar neste exemplo: split direto
              const cols = line.split(separator);
              
              if (cols.length < 3) continue; // Mínimo Nome, Codigo, Preço

              const name = cols[0]?.replace(/"/g, '').trim();
              const code = cols[1]?.replace(/"/g, '').trim();
              // Tratar preço (R$ 1.000,00 ou 1000.00)
              let priceStr = cols[2]?.replace(/"/g, '').replace('R$', '').trim();
              if (priceStr.includes(',') && !priceStr.includes('.')) {
                  priceStr = priceStr.replace(',', '.'); // 10,50 -> 10.50
              } else if (priceStr.includes('.') && priceStr.includes(',')) {
                  priceStr = priceStr.replace('.', '').replace(',', '.'); // 1.000,50 -> 1000.50
              }
              const price = parseFloat(priceStr);
              const unit = cols[3]?.replace(/"/g, '').trim() || 'UN';
              const category = cols[4]?.replace(/"/g, '').trim() || 'Geral';
              const desc = cols[5]?.replace(/"/g, '').trim() || '';

              if (name && !isNaN(price)) {
                  const newProduct: Product = {
                      id: '',
                      name,
                      code: code || Math.floor(Math.random() * 100000).toString(),
                      price,
                      unit: unit.toUpperCase(),
                      category,
                      description: desc,
                      createdAt: new Date().toISOString()
                  };
                  await MockService.addProduct(newProduct);
                  successCount++;
              }
          }

          alert(`${successCount} produtos importados com sucesso!`);
          setProducts(await MockService.getProducts());
          setIsLoading(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
      };

      reader.readAsText(file);
  };

  // Create / Update Logic
  const openCreateModal = () => {
      setEditingId(null);
      setFormData({
        code: '',
        unit: 'UN',
        name: '',
        description: '',
        price: 0,
        category: '',
        image: ''
      });
      setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
      setEditingId(product.id);
      setFormData({
          code: product.code,
          unit: product.unit,
          name: product.name,
          description: product.description || '',
          price: product.price,
          category: product.category || '',
          image: product.image || ''
      });
      setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      const productPayload: Product = {
          id: editingId || '', // ID empty for create, filled for update
          code: formData.code || '',
          name: formData.name || 'Sem nome',
          price: Number(formData.price) || 0,
          unit: formData.unit || 'UN',
          category: formData.category || 'Geral',
          description: formData.description,
          image: formData.image,
          createdAt: editingId ? undefined : new Date().toISOString() // Keep original date if editing
      };

      if (editingId) {
          await MockService.updateProduct(productPayload);
      } else {
          await MockService.addProduct(productPayload);
      }

      await loadProducts(); 
      setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto pb-20">
      
      {/* Hidden File Input for Import */}
      <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept=".csv,.txt" 
          style={{ display: 'none' }} 
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
              <h1 className="text-2xl font-bold text-white mb-1">Produtos</h1>
              <p className="text-slate-500 text-sm">{products.length} produtos cadastrados</p>
          </div>
          <div className="flex flex-wrap gap-3">
              {selectedIds.length > 0 && (
                  <Button variant="danger" onClick={handleDeleteSelected} className="animate-in fade-in zoom-in duration-200">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir ({selectedIds.length})
                  </Button>
              )}
              
              <Button 
                variant="secondary" 
                onClick={handleImportClick}
                className="bg-[#1E293B] border-slate-700 hover:bg-slate-800"
                title="Formato: Nome, Código, Preço, Unidade"
              >
                  <Upload className="w-4 h-4 mr-2 text-slate-400" />
                  Importar CSV
              </Button>

              <Button 
                variant="secondary" 
                onClick={handleExport}
                className="bg-[#1E293B] border-slate-700 hover:bg-slate-800"
              >
                  <Download className="w-4 h-4 mr-2 text-slate-400" />
                  Exportar
              </Button>

              <Button 
                onClick={openCreateModal}
                className="bg-[#F97316] hover:bg-[#EA580C] text-white border-none shadow-lg shadow-orange-500/20"
              >
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Produto
              </Button>
          </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
            <input 
                type="text" 
                placeholder="Buscar por nome, código ou descrição..." 
                className="w-full bg-[#1E293B] border border-slate-700 text-white pl-10 pr-4 py-2.5 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none placeholder-slate-500"
                value={searchTerm}
                onChange={handleSearch}
            />
        </div>
        <Button variant="secondary" className="bg-[#1E293B] border-slate-700 text-slate-300">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
        </Button>
      </div>

      {/* Table */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-[#1E293B] border-b border-slate-700 text-xs uppercase text-slate-400 font-semibold tracking-wider">
                        <th className="p-4 w-10">
                            <button onClick={handleSelectAll} className="text-slate-500 hover:text-white">
                                {selectedIds.length > 0 && selectedIds.length === filteredProducts.length ? <CheckSquare size={20} className="text-orange-500" /> : <Square size={20} />}
                            </button>
                        </th>
                        <th className="p-4">Produto</th>
                        <th className="p-4">Código (EAN)</th>
                        <th className="p-4">Preço</th>
                        <th className="p-4">Unidade</th>
                        <th className="p-4">Categoria</th>
                        <th className="p-4 text-right">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {isLoading ? (
                        <tr><td colSpan={7} className="p-8 text-center text-slate-400">Carregando...</td></tr>
                    ) : filteredProducts.length === 0 ? (
                        <tr><td colSpan={7} className="p-8 text-center text-slate-500">Nenhum produto encontrado.</td></tr>
                    ) : filteredProducts.map((product) => (
                        <tr key={product.id} className={`transition-colors group ${selectedIds.includes(product.id) ? 'bg-orange-500/10' : 'hover:bg-slate-800/50'}`}>
                            <td className="p-4">
                                <button onClick={() => handleSelectOne(product.id)} className="text-slate-500 hover:text-white">
                                    {selectedIds.includes(product.id) ? <CheckSquare size={20} className="text-orange-500" /> : <Square size={20} />}
                                </button>
                            </td>
                            <td className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded bg-slate-800 flex items-center justify-center text-slate-500 border border-slate-700 overflow-hidden">
                                        {product.image ? (
                                            <img src={product.image} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <Box size={20} />
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-medium text-white">{product.name}</div>
                                        {product.description && <div className="text-xs text-slate-500 truncate max-w-[150px]">{product.description}</div>}
                                    </div>
                                </div>
                            </td>
                            <td className="p-4 text-slate-400 text-sm font-mono">
                                {product.code || <span className="text-slate-600 italic">Sem código</span>}
                            </td>
                            <td className="p-4 font-bold text-green-400">R$ {product.price.toFixed(2)}</td>
                            <td className="p-4">
                                <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-xs font-medium border border-slate-700 uppercase">
                                    {product.unit}
                                </span>
                            </td>
                            <td className="p-4">
                                <span className="text-sm text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-full border border-indigo-500/20">
                                    {product.category || 'Geral'}
                                </span>
                            </td>
                            <td className="p-4 text-right">
                                <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => openEditModal(product)}
                                        className="text-slate-400 hover:text-white p-2 hover:bg-slate-700 rounded-lg transition-colors" 
                                        title="Editar"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteOne(product.id)}
                                        className="text-slate-400 hover:text-red-400 p-2 hover:bg-slate-700 rounded-lg transition-colors" 
                                        title="Excluir"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      {/* Modal: Create / Edit Product */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#0F172A] border border-slate-700 rounded-xl w-full max-w-lg shadow-2xl relative">
                <div className="flex justify-between items-center p-6 border-b border-slate-800">
                    <h2 className="text-xl font-bold text-white">
                        {editingId ? 'Editar Produto' : 'Novo Produto'}
                    </h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white">
                        <X size={20} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    
                    {/* Barcode / SKU */}
                    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 border-dashed">
                        <label className="flex items-center text-xs font-bold text-slate-300 mb-1.5">
                            <Barcode size={14} className="mr-1.5 text-orange-500" />
                            Código de Barras / EAN
                            <span className="ml-2 text-[10px] font-normal text-slate-500 uppercase border border-slate-600 px-1 rounded">Opcional</span>
                        </label>
                        <input 
                            type="text" 
                            className="w-full bg-[#1E293B] border border-slate-600 rounded-lg p-2.5 text-white outline-none focus:border-orange-500 placeholder-slate-600" 
                            placeholder="Escaneie ou digite o código..."
                            value={formData.code} 
                            onChange={e => setFormData({...formData, code: e.target.value})} 
                        />
                        <p className="text-[10px] text-slate-500 mt-1">Usado para buscar o produto rapidamente na hora de criar o cartaz.</p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                         <div className="col-span-2">
                            <label className="block text-xs font-medium text-slate-300 mb-1.5">Preço (R$) *</label>
                            <input 
                                type="number" 
                                required 
                                step="0.01" 
                                className="w-full bg-[#1E293B] border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:border-orange-500 font-bold text-lg" 
                                value={formData.price} 
                                onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1.5">Unidade</label>
                            <select 
                                className="w-full bg-[#1E293B] border border-slate-700 rounded-lg p-3 text-white outline-none" 
                                value={formData.unit} 
                                onChange={e => setFormData({...formData, unit: e.target.value})}
                            >
                                <option value="UN">UN</option>
                                <option value="KG">KG</option>
                                <option value="CX">CX</option>
                                <option value="PC">PC</option>
                                <option value="LT">LT</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">Nome do Produto *</label>
                        <input 
                            type="text" 
                            required 
                            className="w-full bg-[#1E293B] border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:border-orange-500" 
                            placeholder="Ex: Arroz Branco Tipo 1"
                            value={formData.name} 
                            onChange={e => setFormData({...formData, name: e.target.value})} 
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">Descrição / Detalhes</label>
                        <input 
                            type="text" 
                            className="w-full bg-[#1E293B] border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:border-orange-500" 
                            placeholder="Ex: 5kg, Marca X..."
                            value={formData.description} 
                            onChange={e => setFormData({...formData, description: e.target.value})} 
                        />
                    </div>
                    
                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">Categoria</label>
                        <input 
                            type="text" 
                            list="categories"
                            className="w-full bg-[#1E293B] border border-slate-700 rounded-lg p-2.5 text-white outline-none focus:border-orange-500" 
                            placeholder="Ex: Bebidas"
                            value={formData.category} 
                            onChange={e => setFormData({...formData, category: e.target.value})} 
                        />
                        <datalist id="categories">
                            <option value="Bebidas" />
                            <option value="Mercearia" />
                            <option value="Açougue" />
                            <option value="Hortifruti" />
                            <option value="Limpeza" />
                        </datalist>
                    </div>

                    <div className="pt-4 flex gap-3 border-t border-slate-800 mt-6">
                        <Button type="button" variant="secondary" fullWidth onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                        <Button type="submit" fullWidth className="bg-orange-500 hover:bg-orange-600 text-white border-none font-bold">
                            {editingId ? 'Salvar Alterações' : 'Criar Produto'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};
