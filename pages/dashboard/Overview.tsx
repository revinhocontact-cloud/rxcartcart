import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Printer, TrendingUp, Calendar, AlertCircle, FileText, CheckCircle, Clock, Package, Palette, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Overview: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) return null;

  // Mock data to match image appearance
  const isExpired = new Date(user.validUntil) < new Date() || true; // Force true for demo match

  const StatCard = ({ label, value, icon: Icon, color }: any) => (
    <div className="bg-[#1E293B] p-5 rounded-xl border border-slate-800 flex flex-col justify-between group hover:border-slate-700 transition-colors">
        <div className="flex justify-between items-start mb-4">
             <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
                <h3 className="text-3xl font-bold text-white">{value}</h3>
             </div>
             <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
                 <Icon size={20} className={color.replace('bg-', 'text-')} />
             </div>
        </div>
    </div>
  );

  const ActionCard = ({ title, desc, icon: Icon, to, gradient }: any) => (
    <Link to={to} className={`relative overflow-hidden rounded-xl p-6 h-40 flex flex-col justify-center items-center text-center transition-all hover:scale-[1.02] shadow-lg ${gradient}`}>
        <div className="mb-3 bg-white/20 p-3 rounded-full backdrop-blur-sm">
            <Icon size={24} className="text-white" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
        <p className="text-xs text-white/70">{desc}</p>
    </Link>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Alert Banner */}
      {isExpired && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="bg-red-500 p-2 rounded-full animate-pulse">
                    <AlertCircle className="text-white h-6 w-6" />
                </div>
                <div>
                    <h3 className="text-red-400 font-bold text-lg">Plano Expirado</h3>
                    <p className="text-red-400/70 text-sm">Renove para continuar criando cartazes e acessando seus arquivos.</p>
                </div>
             </div>
             <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg shadow-red-500/20 transition-colors text-sm">
                Renovar
             </button>
          </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total de Cartazes" value="0" icon={FileText} color="bg-orange-500" />
        <StatCard label="Impressos" value="0" icon={CheckCircle} color="bg-orange-500" />
        <StatCard label="Na Fila" value="0" icon={Clock} color="bg-orange-500" />
        <StatCard label="Dias Restantes" value="0" icon={Calendar} color="bg-orange-500" />
      </div>

      {/* Quick Actions */}
      <div>
         <h2 className="text-lg font-bold text-white mb-4">Ações Rápidas</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ActionCard 
                title="Criar Cartaz" 
                desc="Novo cartaz" 
                icon={Printer} 
                to="/dashboard/create" 
                gradient="bg-gradient-to-br from-orange-500 to-red-600" 
            />
            <ActionCard 
                title="Fila de Impressão" 
                desc="0 pendentes" 
                icon={Clock} 
                to="/dashboard/queue" 
                gradient="bg-gradient-to-br from-orange-600 to-amber-700" 
            />
            <ActionCard 
                title="Produtos" 
                desc="0 itens" 
                icon={Package} 
                to="/dashboard/products" 
                gradient="bg-gradient-to-br from-orange-700 to-pink-700" 
            />
            <ActionCard 
                title="Templates" 
                desc="0 modelos" 
                icon={Palette} 
                to="/dashboard/templates" 
                gradient="bg-gradient-to-br from-orange-600 to-indigo-900" 
            />
         </div>
      </div>

    </div>
  );
};