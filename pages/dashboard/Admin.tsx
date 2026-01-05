
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, UserRole } from '../../types';
import { Button } from '../../components/ui/Button';
import { Search, ChevronRight, Plus, Users, ShieldCheck, AlertCircle, Edit, Trash2, Crown, X, Key, Calendar, AlertTriangle } from 'lucide-react';
import { MockService } from '../../services/mockService';

export const Admin: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  // New/Edit Client Form
  const [formData, setFormData] = useState({
      name: '',
      email: '',
      cpf: '',
      address: '',
      plan: 'FREE',
      role: UserRole.CUSTOMER, // Added role field to form
      duration: '1',
      status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'EXPIRED'
  });

  const loadUsers = async () => {
      try {
          const data = await MockService.getUsers();
          setUsers(data);
      } catch (e) {
          console.error(e);
      }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Allow ADMIN and SUPPORT to access this page
  if (user?.role !== UserRole.ADMIN && user?.role !== UserRole.SUPPORT) {
    return <div className="p-8 text-red-500 font-bold text-center">Acesso restrito.</div>;
  }

  const handleOpenCreate = () => {
      setEditingUser(null);
      setFormData({ name: '', email: '', cpf: '', address: '', plan: 'FREE', role: UserRole.CUSTOMER, duration: '1', status: 'ACTIVE' });
      setIsModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
      setEditingUser(user);
      setFormData({
          name: user.name,
          email: user.email,
          cpf: user.cpf || '',
          address: user.address || '',
          plan: user.plan,
          role: user.role,
          duration: '0', // Keep current date by default logic
          status: user.status || 'ACTIVE'
      });
      setIsModalOpen(true);
  };

  const handleSubmitUser = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      try {
          if (editingUser) {
              // --- UPDATE MODE ---
              const updatedUser: User = {
                  ...editingUser,
                  name: formData.name,
                  email: formData.email,
                  plan: formData.plan as any,
                  role: formData.role, // Allow changing role
                  cpf: formData.cpf,
                  address: formData.address,
                  status: formData.status,
                  // If duration is > 0, calculate new date, else keep existing
                  validUntil: parseInt(formData.duration) > 0 
                      ? new Date(new Date().setMonth(new Date().getMonth() + parseInt(formData.duration))).toISOString()
                      : editingUser.validUntil
              };
              
              await MockService.updateUser(updatedUser);
              
              // Local update for demo smoothness
              setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
              alert('Dados atualizados com sucesso!');

          } else {
              // --- CREATE MODE ---
              // Auto-generate secure password
              const autoPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

              const newUser: User = {
                  id: '',
                  name: formData.name,
                  email: formData.email,
                  role: formData.role,
                  plan: formData.plan as any,
                  cpf: formData.cpf,
                  address: formData.address,
                  status: formData.status,
                  usage: 0,
                  password: autoPassword, 
                  createdAt: new Date().toISOString(),
                  validUntil: new Date(new Date().setMonth(new Date().getMonth() + parseInt(formData.duration))).toISOString()
              };

              await MockService.createUser(newUser);
              
              // Show password to Admin
              alert(`Usuário criado com sucesso!\n\nSENHA GERADA: ${autoPassword}\n\nCopie e envie para o usuário.`);
              
              loadUsers();
          }

          setIsModalOpen(false);
      } catch (err: any) {
          alert('Erro ao salvar usuário: ' + err.message);
      } finally {
          setLoading(false);
      }
  };

  const handleDeleteUser = async (id: string) => {
      if (confirm('Tem certeza que deseja excluir este usuário?')) {
          await MockService.deleteUser(id);
          setUsers(prev => prev.filter(u => u.id !== id));
      }
  };

  const filteredUsers = users.filter(u => 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.cpf && u.cpf.includes(searchTerm))
  );

  const stats = {
      total: users.length,
      active: users.filter(u => u.status === 'ACTIVE').length,
      inactive: users.filter(u => u.status !== 'ACTIVE').length
  };

  const StatusBadge = ({ status }: { status?: string }) => {
      if (status === 'ACTIVE') {
          return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wide">Ativo</span>
      }
      if (status === 'PENDING') {
          return <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wide">Pendente</span>
      }
      if (status === 'EXPIRED') {
          return <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wide">Expirado</span>
      }
      return <span className="bg-slate-700/50 text-slate-400 border border-slate-600/50 px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wide">Inativo</span>
  };

  return (
    <div className="max-w-7xl mx-auto pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
         <div>
             <div className="flex items-center text-xs text-slate-500 mb-1 cursor-pointer hover:text-white">
                 <span>Administração</span>
                 <ChevronRight size={12} className="mx-1" />
                 <span className="text-violet-400">Usuários</span>
             </div>
             <h1 className="text-2xl font-bold text-white">Gerenciar Usuários</h1>
         </div>
         <Button 
            onClick={handleOpenCreate}
            className="bg-violet-600 hover:bg-violet-500 text-white border-none shadow-lg shadow-violet-500/20"
         >
             <Plus className="w-4 h-4 mr-2" />
             Novo Usuário
         </Button>
      </div>

      {/* Warning about limited data */}
      {users.length === 0 && (
          <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-500 text-sm">
              <p>Nota: O backend atual não suporta listagem completa de usuários persistida. Usuários criados nesta sessão aparecerão aqui.</p>
          </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#0F172A] p-5 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Total</p>
                  <h3 className="text-3xl font-bold text-white">{stats.total}</h3>
              </div>
              <div className="bg-slate-800 p-3 rounded-lg text-slate-400">
                  <Users size={20} />
              </div>
          </div>
          <div className="bg-[#0F172A] p-5 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Ativos</p>
                  <h3 className="text-3xl font-bold text-white">{stats.active}</h3>
              </div>
              <div className="bg-emerald-500/10 p-3 rounded-lg text-emerald-500">
                  <ShieldCheck size={20} />
              </div>
          </div>
          <div className="bg-[#0F172A] p-5 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Inativos/Pendentes</p>
                  <h3 className="text-3xl font-bold text-white">{stats.inactive}</h3>
              </div>
              <div className="bg-red-500/10 p-3 rounded-lg text-red-500">
                  <AlertCircle size={20} />
              </div>
          </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
          <input
              type="text"
              placeholder="Buscar por nome, email ou CPF/CNPJ..."
              className="w-full pl-12 pr-4 py-3 bg-[#0F172A] border border-slate-800 rounded-xl text-white focus:ring-1 focus:ring-violet-500 focus:border-violet-500 outline-none placeholder-slate-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
          />
      </div>

      {/* Table */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-[#1E293B] border-b border-slate-800 text-xs uppercase text-slate-400 font-semibold tracking-wider">
                        <th className="p-4">Usuário</th>
                        <th className="p-4">Tipo</th>
                        <th className="p-4">Plano</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Validade</th>
                        <th className="p-4 text-right">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {filteredUsers.map((client) => (
                        <tr key={client.id} className="hover:bg-slate-800/50 transition-colors group">
                            <td className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm bg-gradient-to-br ${client.role === 'ADMIN' ? 'from-violet-600 to-indigo-600' : (client.role === 'SUPPORT' ? 'from-amber-600 to-orange-600' : 'from-slate-700 to-slate-800')}`}>
                                        {client.name.substring(0, 1).toUpperCase()}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-white">{client.name}</span>
                                        <span className="text-xs text-slate-500">{client.email}</span>
                                    </div>
                                </div>
                            </td>
                            <td className="p-4">
                                {client.role === UserRole.ADMIN ? (
                                    <span className="text-xs font-bold text-violet-400 flex items-center"><Crown size={12} className="mr-1" /> Admin</span>
                                ) : client.role === UserRole.SUPPORT ? (
                                    <span className="text-xs font-bold text-amber-400 flex items-center"><ShieldCheck size={12} className="mr-1" /> Func.</span>
                                ) : (
                                    <span className="text-xs text-slate-400">Cliente</span>
                                )}
                            </td>
                            <td className="p-4 text-slate-400 text-sm">{client.plan}</td>
                            <td className="p-4">
                                <StatusBadge status={client.status} />
                            </td>
                            <td className="p-4 text-slate-400 text-sm">{client.validUntil !== '2099-12-31' ? new Date(client.validUntil).toLocaleDateString() : 'Vitalício'}</td>
                            <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <button 
                                        className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-700 rounded transition-colors" 
                                        title="Editar"
                                        onClick={() => handleOpenEdit(client)}
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button 
                                        className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-700 rounded transition-colors" 
                                        title="Excluir"
                                        onClick={() => handleDeleteUser(client.id)}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                        <tr>
                            <td colSpan={7} className="p-8 text-center text-slate-500">
                                Nenhum usuário encontrado.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {/* Modal - CREATE / EDIT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#0F172A] border border-slate-700 rounded-xl w-full max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-slate-800 sticky top-0 bg-[#0F172A] z-10">
                    <div className="flex items-center gap-2">
                        <div className="bg-violet-600/20 p-2 rounded-lg">
                            {editingUser ? <Edit size={18} className="text-violet-400" /> : <Plus size={18} className="text-violet-400" />}
                        </div>
                        <h2 className="text-xl font-bold text-white">{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</h2>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white">
                        <X size={20} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmitUser} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">Nome Completo *</label>
                        <input 
                            type="text" 
                            required
                            className="w-full bg-[#1E293B] border border-slate-700 rounded-lg p-3 text-white focus:border-violet-500 outline-none transition-colors"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">E-mail *</label>
                        <input 
                            type="email" 
                            required
                            className="w-full bg-[#1E293B] border border-slate-700 rounded-lg p-3 text-white focus:border-violet-500 outline-none transition-colors"
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                    </div>

                    {/* Senha removida na criação, gerada automaticamente */}
                    {!editingUser && (
                        <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg flex items-start gap-3">
                            <Key size={18} className="text-blue-400 mt-0.5" />
                            <p className="text-xs text-blue-300">
                                A senha será <strong>gerada automaticamente</strong> e exibida na próxima tela para você enviar ao usuário.
                            </p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1.5">CPF ou CNPJ</label>
                            <input 
                                type="text" 
                                placeholder="000.000.000-00"
                                className="w-full bg-[#1E293B] border border-slate-700 rounded-lg p-3 text-white focus:border-violet-500 outline-none transition-colors placeholder-slate-600"
                                value={formData.cpf}
                                onChange={e => setFormData({...formData, cpf: e.target.value})}
                            />
                        </div>
                        <div>
                             <label className="block text-xs font-bold text-slate-300 mb-1.5">Tipo de Usuário</label>
                             <select 
                                className="w-full bg-[#1E293B] border border-slate-700 rounded-lg p-3 text-white focus:border-violet-500 outline-none"
                                value={formData.role}
                                onChange={e => setFormData({...formData, role: e.target.value as UserRole})}
                            >
                                <option value={UserRole.CUSTOMER}>Cliente</option>
                                <option value={UserRole.SUPPORT}>Funcionário (Suporte)</option>
                                <option value={UserRole.ADMIN}>Administrador</option>
                            </select>
                        </div>
                    </div>

                    {formData.role === UserRole.CUSTOMER && (
                        <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1.5">Plano</label>
                            <select 
                                className="w-full bg-[#1E293B] border border-slate-700 rounded-lg p-3 text-white focus:border-violet-500 outline-none"
                                value={formData.plan}
                                onChange={e => setFormData({...formData, plan: e.target.value})}
                            >
                                <option value="FREE">Gratuito</option>
                                <option value="PRO">Profissional</option>
                                <option value="ENTERPRISE">Enterprise</option>
                            </select>
                        </div>
                    )}

                    {/* Área de Status e Validade */}
                    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1.5">Status da Conta</label>
                            <select 
                                className="w-full bg-[#1E293B] border border-slate-700 rounded-lg p-3 text-white focus:border-violet-500 outline-none"
                                value={formData.status}
                                onChange={e => setFormData({...formData, status: e.target.value as any})}
                            >
                                <option value="ACTIVE">Ativo (Serviços Liberados)</option>
                                <option value="PENDING">Pendente (Bloqueio Financeiro)</option>
                                <option value="INACTIVE">Inativo (Bloqueio Total)</option>
                                <option value="EXPIRED">Expirado</option>
                            </select>
                            {formData.status === 'PENDING' && (
                                <p className="text-[10px] text-orange-400 mt-1 flex items-center">
                                    <AlertTriangle size={10} className="mr-1" />
                                    O usuário verá uma tela de bloqueio financeiro.
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1.5">
                                {editingUser ? 'Adicionar Validade (Meses)' : 'Validade Inicial (Meses)'}
                            </label>
                            <div className="flex gap-2">
                                <input 
                                    type="number" 
                                    min={editingUser ? "0" : "1"}
                                    className="w-full bg-[#1E293B] border border-slate-700 rounded-lg p-3 text-white focus:border-violet-500 outline-none"
                                    value={formData.duration}
                                    onChange={e => setFormData({...formData, duration: e.target.value})}
                                />
                            </div>
                            {editingUser && (
                                <p className="text-[10px] text-slate-500 mt-1">
                                    Atual: {new Date(editingUser.validUntil).toLocaleDateString()} (Deixe 0 para manter)
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3 border-t border-slate-800 mt-6 sticky bottom-0 bg-[#0F172A]">
                        <Button 
                            type="button" 
                            variant="secondary" 
                            fullWidth 
                            onClick={() => setIsModalOpen(false)}
                            className="bg-white hover:bg-slate-200 text-slate-900 font-bold"
                        >
                            Cancelar
                        </Button>
                        <Button 
                            type="submit" 
                            fullWidth
                            disabled={loading}
                            className="bg-violet-600 hover:bg-violet-500 text-white border-none font-bold shadow-lg shadow-violet-500/20"
                        >
                            {loading ? 'Salvando...' : (editingUser ? 'Salvar Alterações' : 'Criar Usuário')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
      )}

    </div>
  );
};
