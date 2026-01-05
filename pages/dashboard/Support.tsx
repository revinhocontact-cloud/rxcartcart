
import React, { useState, useEffect, useRef } from 'react';
import { LifeBuoy, Plus, MessageSquare, ChevronLeft, Send, CheckCircle, Clock, X, User as UserIcon, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { MockService } from '../../services/mockService';
import { Ticket, TicketMessage, TicketStatus, TicketPriority, UserRole } from '../../types';
import { Button } from '../../components/ui/Button';

export const Support: React.FC = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Create Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newPriority, setNewPriority] = useState<TicketPriority>(TicketPriority.MEDIUM);
  const [newInitialMessage, setNewInitialMessage] = useState('');

  // Chat State
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadTickets = async () => {
      if (!user) return;
      try {
          const data = await MockService.getTickets(user.id, user.role);
          setTickets(data);
      } catch (e) { console.error(e); }
  };

  useEffect(() => {
    loadTickets();
    const interval = setInterval(loadTickets, 10000); // Polling for updates
    return () => clearInterval(interval);
  }, [user]);

  const loadMessages = async (ticketId: string) => {
      setLoading(true);
      try {
          const msgs = await MockService.getTicketMessages(ticketId);
          setMessages(msgs);
          setSelectedTicketId(ticketId);
          setTimeout(scrollToBottom, 100);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user) return;
      try {
          await MockService.createTicket(
              { subject: newSubject, priority: newPriority },
              newInitialMessage,
              user
          );
          setIsCreateModalOpen(false);
          setNewSubject('');
          setNewInitialMessage('');
          loadTickets();
      } catch (e) { alert('Erro ao criar ticket'); }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedTicketId || !user || !newMessage.trim()) return;

      try {
          const msg = await MockService.sendTicketMessage(selectedTicketId, newMessage, user);
          setMessages(prev => [...prev, msg]);
          setNewMessage('');
          scrollToBottom();
          loadTickets(); // Refresh list to update 'last message'
      } catch (e) { console.error(e); }
  };

  const handleCloseTicket = async () => {
      if (!selectedTicketId || !confirm('Deseja realmente encerrar este atendimento?')) return;
      await MockService.updateTicketStatus(selectedTicketId, TicketStatus.CLOSED);
      loadTickets();
      setSelectedTicketId(null);
  };

  const StatusBadge = ({ status }: { status: TicketStatus }) => {
      switch (status) {
          case TicketStatus.OPEN: return <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded text-xs font-bold">Aberto</span>;
          case TicketStatus.ANSWERED: return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded text-xs font-bold">Respondido</span>;
          case TicketStatus.CLOSED: return <span className="bg-slate-700/50 text-slate-400 border border-slate-600/50 px-2 py-1 rounded text-xs font-bold">Encerrado</span>;
      }
  };

  const PriorityBadge = ({ priority }: { priority: TicketPriority }) => {
    switch (priority) {
        case TicketPriority.LOW: return <span className="text-slate-500 text-xs">Baixa</span>;
        case TicketPriority.MEDIUM: return <span className="text-yellow-500 text-xs">Média</span>;
        case TicketPriority.HIGH: return <span className="text-red-500 text-xs font-bold">Alta</span>;
    }
  };

  if (!user) return null;

  const isStaff = user.role === UserRole.ADMIN || user.role === UserRole.SUPPORT;

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-100px)] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 shrink-0">
          <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                  <LifeBuoy className="text-violet-500" />
                  Suporte Online
              </h1>
              <p className="text-slate-400 text-sm">Central de atendimento e ajuda</p>
          </div>
          {/* Somente Clientes criam tickets (normalmente), mas Staff pode criar também se quiser */}
          {!selectedTicketId && (
            <Button onClick={() => setIsCreateModalOpen(true)} className="bg-violet-600 hover:bg-violet-500 border-none shadow-lg">
                <Plus size={16} className="mr-2" /> Novo Chamado
            </Button>
          )}
      </div>

      <div className="flex-1 bg-[#0F172A] border border-slate-800 rounded-xl overflow-hidden flex shadow-2xl">
          
          {/* LIST SIDEBAR */}
          <div className={`${selectedTicketId ? 'hidden md:flex' : 'flex'} w-full md:w-80 border-r border-slate-800 flex-col bg-[#0F172A]`}>
              <div className="p-4 border-b border-slate-800 bg-[#1E293B]/30 flex justify-between items-center">
                  <h3 className="font-bold text-white text-sm uppercase tracking-wider">
                      {isStaff ? 'Todos os Chamados' : 'Seus Chamados'}
                  </h3>
                  {isStaff && <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">{tickets.length}</span>}
              </div>
              <div className="flex-1 overflow-y-auto">
                  {tickets.length === 0 ? (
                      <div className="p-8 text-center text-slate-500">
                          <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
                          <p className="text-sm">Nenhum chamado encontrado.</p>
                      </div>
                  ) : (
                      tickets.map(ticket => (
                          <div 
                            key={ticket.id}
                            onClick={() => loadMessages(ticket.id)}
                            className={`p-4 border-b border-slate-800 cursor-pointer hover:bg-slate-800/50 transition-colors ${selectedTicketId === ticket.id ? 'bg-violet-600/10 border-l-4 border-l-violet-500' : 'border-l-4 border-l-transparent'}`}
                          >
                              <div className="flex justify-between items-start mb-1">
                                  <StatusBadge status={ticket.status} />
                                  <span className="text-[10px] text-slate-500">{new Date(ticket.updatedAt).toLocaleDateString()}</span>
                              </div>
                              <h4 className="text-white font-bold text-sm mb-1 line-clamp-1">{ticket.subject}</h4>
                              <p className="text-slate-500 text-xs line-clamp-2 mb-2">{ticket.lastMessage}</p>
                              {isStaff && (
                                  <div className="flex items-center gap-1 text-[10px] text-amber-400 mt-2 bg-amber-500/10 w-fit px-1.5 py-0.5 rounded">
                                      <UserIcon size={10} /> {ticket.userName}
                                  </div>
                              )}
                          </div>
                      ))
                  )}
              </div>
          </div>

          {/* CHAT AREA */}
          <div className={`${!selectedTicketId ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-[#020617]`}>
              {selectedTicketId ? (
                  <>
                      {/* Chat Header */}
                      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-[#1E293B]/50">
                          <div className="flex items-center gap-3">
                              <button onClick={() => setSelectedTicketId(null)} className="md:hidden text-slate-400 hover:text-white">
                                  <ChevronLeft />
                              </button>
                              <div>
                                  <h3 className="font-bold text-white">
                                    {tickets.find(t => t.id === selectedTicketId)?.subject}
                                  </h3>
                                  <div className="flex items-center gap-2 text-xs text-slate-400">
                                      <span>Protocolo: #{selectedTicketId}</span>
                                      <span>•</span>
                                      <PriorityBadge priority={tickets.find(t => t.id === selectedTicketId)?.priority || TicketPriority.LOW} />
                                  </div>
                              </div>
                          </div>
                          {tickets.find(t => t.id === selectedTicketId)?.status !== TicketStatus.CLOSED && (
                              <Button variant="outline" size="sm" onClick={handleCloseTicket} className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                                  Encerrar
                              </Button>
                          )}
                      </div>

                      {/* Messages Area */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                          {messages.map((msg) => {
                              const isMe = msg.senderId === user.id;
                              
                              // Check if the message sender is staff (Admin or Support)
                              // We rely on the stored property isAdmin for visual styling 
                              const isSenderStaff = msg.isAdmin; 
                              
                              return (
                                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                      <div className={`max-w-[80%] rounded-2xl p-4 ${
                                          isMe 
                                          ? 'bg-violet-600 text-white rounded-tr-none' 
                                          : isSenderStaff 
                                              ? 'bg-slate-700 text-white rounded-tl-none border border-slate-600' 
                                              : 'bg-slate-800 text-slate-200 rounded-tl-none'
                                      }`}>
                                          <div className="flex items-center gap-2 mb-1">
                                              {isSenderStaff && !isMe && <Shield size={12} className="text-amber-400" />}
                                              <span className={`text-[10px] font-bold ${isMe ? 'text-violet-200' : 'text-slate-400'}`}>
                                                  {isMe ? 'Você' : (isSenderStaff ? 'Suporte RexCart' : msg.senderName)}
                                              </span>
                                          </div>
                                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                                          <div className={`text-[10px] mt-2 text-right ${isMe ? 'text-violet-300' : 'text-slate-500'}`}>
                                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                          </div>
                                      </div>
                                  </div>
                              );
                          })}
                          <div ref={messagesEndRef} />
                      </div>

                      {/* Input Area */}
                      {tickets.find(t => t.id === selectedTicketId)?.status !== TicketStatus.CLOSED ? (
                          <div className="p-4 border-t border-slate-800 bg-[#1E293B]/30">
                              <form onSubmit={handleSendMessage} className="flex gap-2">
                                  <input 
                                      type="text" 
                                      className="flex-1 bg-[#020617] border border-slate-700 rounded-lg p-3 text-white focus:border-violet-500 outline-none transition-colors"
                                      placeholder="Digite sua mensagem..."
                                      value={newMessage}
                                      onChange={(e) => setNewMessage(e.target.value)}
                                  />
                                  <Button type="submit" disabled={!newMessage.trim()} className="bg-violet-600 hover:bg-violet-500 border-none aspect-square p-0 w-12 flex items-center justify-center">
                                      <Send size={18} />
                                  </Button>
                              </form>
                          </div>
                      ) : (
                          <div className="p-4 bg-slate-800/50 text-center text-slate-500 text-sm border-t border-slate-800">
                              Este chamado foi encerrado. Crie um novo se precisar de mais ajuda.
                          </div>
                      )}
                  </>
              ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8">
                      <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                          <LifeBuoy size={40} className="text-slate-600" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-400">Suporte Online</h3>
                      <p className="text-sm">Selecione um chamado ao lado para visualizar.</p>
                  </div>
              )}
          </div>
      </div>

      {/* CREATE MODAL */}
      {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
              <div className="bg-[#0F172A] border border-slate-700 rounded-xl w-full max-w-md shadow-2xl">
                  <div className="flex justify-between items-center p-6 border-b border-slate-800">
                      <h3 className="text-lg font-bold text-white">Novo Chamado</h3>
                      <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-500 hover:text-white"><X size={20} /></button>
                  </div>
                  <form onSubmit={handleCreateTicket} className="p-6 space-y-4">
                      <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1.5">Assunto</label>
                          <input 
                              type="text" required
                              className="w-full bg-[#1E293B] border border-slate-700 rounded-lg p-3 text-white focus:border-violet-500 outline-none"
                              placeholder="Ex: Dúvida sobre impressão"
                              value={newSubject} onChange={e => setNewSubject(e.target.value)}
                          />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1.5">Prioridade</label>
                          <select 
                              className="w-full bg-[#1E293B] border border-slate-700 rounded-lg p-3 text-white focus:border-violet-500 outline-none"
                              value={newPriority} onChange={e => setNewPriority(e.target.value as TicketPriority)}
                          >
                              <option value={TicketPriority.LOW}>Baixa (Dúvida geral)</option>
                              <option value={TicketPriority.MEDIUM}>Média (Problema não urgente)</option>
                              <option value={TicketPriority.HIGH}>Alta (Erro no sistema/Urgente)</option>
                          </select>
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1.5">Mensagem</label>
                          <textarea 
                              required rows={4}
                              className="w-full bg-[#1E293B] border border-slate-700 rounded-lg p-3 text-white focus:border-violet-500 outline-none resize-none"
                              placeholder="Descreva seu problema..."
                              value={newInitialMessage} onChange={e => setNewInitialMessage(e.target.value)}
                          />
                      </div>
                      <div className="pt-2 flex gap-3">
                          <Button type="button" variant="secondary" fullWidth onClick={() => setIsCreateModalOpen(false)}>Cancelar</Button>
                          <Button type="submit" fullWidth className="bg-violet-600 hover:bg-violet-500 text-white border-none">Enviar</Button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};
