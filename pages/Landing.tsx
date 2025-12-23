
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Printer, Zap, Layout, ShieldCheck, Clock, ArrowRight, Play, Star } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Landing: React.FC = () => {
  return (
    <div className="overflow-hidden">
      
      {/* --- HERO SECTION --- */}
      <div className="relative pt-16 pb-20 lg:pt-24 lg:pb-32 overflow-hidden">
        {/* Abstract Background Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-violet-300 text-xs font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <span className="flex h-2 w-2 rounded-full bg-violet-400"></span>
                RexCart: A nova era dos cartazes
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700">
                Crie cartazes profissionais <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">em segundos, não horas.</span>
            </h1>
            
            <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-400 mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                A plataforma completa para varejo. Automatize a precificação, padronize sua loja e aumente suas vendas com design profissional.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
                <Link to="/login">
                  <Button className="h-12 px-8 text-base bg-white text-slate-900 hover:bg-slate-100 border-none font-bold rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all">
                    Começar Agora
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <a href="https://wa.me/5511999999999" target="_blank" rel="noreferrer">
                  <Button variant="outline" className="h-12 px-8 text-base border-slate-700 text-white hover:bg-slate-800 hover:border-slate-600 rounded-full">
                    <Play className="mr-2 w-4 h-4 fill-white" />
                    Ver Demonstração
                  </Button>
                </a>
            </div>

            {/* Dashboard Preview / Mockup */}
            <div className="mt-20 relative mx-auto max-w-5xl animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
                <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl blur opacity-30"></div>
                <div className="relative bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
                    <div className="h-8 bg-[#1E293B] border-b border-slate-800 flex items-center px-4 gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                    </div>
                    {/* Simplified UI Representation */}
                    <div className="aspect-[16/9] bg-[#020617] relative p-8 flex gap-6">
                        {/* Sidebar Mockup */}
                        <div className="w-16 lg:w-48 bg-[#0F172A] rounded-xl border border-slate-800 hidden sm:block opacity-60"></div>
                        {/* Content Mockup */}
                        <div className="flex-1 space-y-6">
                            <div className="flex gap-4">
                                <div className="h-32 flex-1 bg-gradient-to-br from-violet-900/40 to-indigo-900/40 border border-violet-500/30 rounded-xl"></div>
                                <div className="h-32 flex-1 bg-[#0F172A] border border-slate-800 rounded-xl"></div>
                                <div className="h-32 flex-1 bg-[#0F172A] border border-slate-800 rounded-xl hidden md:block"></div>
                            </div>
                            <div className="h-64 bg-[#0F172A] border border-slate-800 rounded-xl flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-slate-800 rounded-full mx-auto mb-4 animate-pulse"></div>
                                    <div className="h-4 w-32 bg-slate-800 rounded mx-auto"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Floating Badge */}
                    <div className="absolute bottom-8 right-8 bg-white text-slate-900 px-4 py-2 rounded-lg shadow-xl font-bold text-sm flex items-center gap-2 animate-bounce">
                        <CheckCircle className="text-green-600 w-5 h-5" />
                        Cartaz Gerado!
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* --- SOCIAL PROOF --- */}
      <div className="border-y border-slate-800 bg-[#020617]/50 backdrop-blur-sm py-10">
          <div className="max-w-7xl mx-auto px-4 text-center">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">Confiança de +500 varejistas no Brasil</p>
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale">
                   {['Supermercado Dia', 'Rede Economia', 'Farmácias Pague Menos', 'Hortifruti'].map((brand, i) => (
                       <span key={i} className="text-xl font-bold text-slate-400">{brand}</span>
                   ))}
              </div>
          </div>
      </div>

      {/* --- FEATURES --- */}
      <div id="features" className="py-24 bg-[#020617] relative">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-20">
                <h2 className="text-violet-400 font-semibold tracking-wide uppercase text-sm mb-3">Recursos Poderosos</h2>
                <p className="text-3xl md:text-4xl font-extrabold text-white mb-6">
                    Tudo o que você precisa para uma operação visual impecável
                </p>
                <p className="text-slate-400 text-lg">
                    Simplificamos o processo complexo de design e impressão para que você foque no que importa: atender seus clientes.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                    { icon: Layout, title: 'Formatos Inteligentes', desc: 'A3, A4, A5 e A6. O layout se adapta automaticamente ao tamanho do papel.' },
                    { icon: Zap, title: 'Campanhas Prontas', desc: 'Templates para Ofertas, Saldão e Datas Comemorativas prontos para usar.' },
                    { icon: Printer, title: 'Fila de Impressão', desc: 'Adicione 50 produtos e imprima tudo de uma vez. Economize horas de trabalho.' },
                    { icon: Clock, title: 'Agilidade Total', desc: 'Busca por código de barras. Crie um cartaz em menos de 10 segundos.' },
                    { icon: ShieldCheck, title: 'Dados Seguros', desc: 'Backup automático na nuvem. Seus preços e histórico sempre protegidos.' },
                    { icon: CheckCircle, title: 'Padronização Visual', desc: 'Garanta que todas as filiais sigam a mesma identidade visual da marca.' },
                ].map((feature, idx) => (
                    <div key={idx} className="group p-8 rounded-2xl bg-[#0F172A] border border-slate-800 hover:border-violet-500/50 transition-all hover:shadow-2xl hover:shadow-violet-900/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
                        
                        <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-6 text-violet-400 group-hover:bg-violet-600 group-hover:text-white transition-colors shadow-lg">
                            <feature.icon size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                        <p className="text-slate-400 leading-relaxed">
                            {feature.desc}
                        </p>
                    </div>
                ))}
            </div>
         </div>
      </div>

      {/* --- PRICING --- */}
      <div id="pricing" className="py-24 bg-[#0F172A] border-t border-slate-800 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Planos Transparentes</h2>
                  <p className="text-slate-400 text-lg">Sem taxas escondidas. Cancele quando quiser.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                  {/* Basic */}
                  <div className="rounded-2xl border border-slate-700 bg-[#020617] p-8 flex flex-col hover:border-slate-500 transition-colors">
                      <h3 className="text-xl font-bold text-white mb-2">Básico</h3>
                      <p className="text-slate-400 text-sm mb-6">Para pequenos comércios locais</p>
                      <div className="mb-6">
                          <span className="text-4xl font-bold text-white">R$ 49</span>
                          <span className="text-slate-500">/mês</span>
                      </div>
                      <Link to="/login" className="w-full block text-center py-3 px-4 rounded-lg border border-slate-700 text-white font-medium hover:bg-slate-800 transition-colors">
                          Começar Grátis
                      </Link>
                      <ul className="mt-8 space-y-4 text-sm text-slate-300 flex-1">
                          <li className="flex items-center"><CheckCircle size={16} className="text-slate-500 mr-3" /> Até 50 cartazes/mês</li>
                          <li className="flex items-center"><CheckCircle size={16} className="text-slate-500 mr-3" /> Formatos A4 e A5</li>
                          <li className="flex items-center"><CheckCircle size={16} className="text-slate-500 mr-3" /> 1 Usuário</li>
                      </ul>
                  </div>

                  {/* Pro (Highlighted) */}
                  <div className="rounded-2xl border-2 border-violet-500 bg-[#020617] p-8 flex flex-col relative transform md:-translate-y-4 shadow-2xl shadow-violet-900/20">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-xs font-bold px-3 py-1 rounded-b-lg uppercase tracking-wide">
                          Mais Popular
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Profissional</h3>
                      <p className="text-violet-200/70 text-sm mb-6">Para mercados e lojas em crescimento</p>
                      <div className="mb-6">
                          <span className="text-4xl font-bold text-white">R$ 99</span>
                          <span className="text-slate-500">/mês</span>
                      </div>
                      <Link to="/login" className="w-full block text-center py-3 px-4 rounded-lg bg-violet-600 text-white font-bold hover:bg-violet-500 shadow-lg shadow-violet-500/25 transition-all">
                          Assinar Agora
                      </Link>
                      <ul className="mt-8 space-y-4 text-sm text-slate-300 flex-1">
                          <li className="flex items-center"><CheckCircle size={16} className="text-violet-500 mr-3" /> Cartazes Ilimitados</li>
                          <li className="flex items-center"><CheckCircle size={16} className="text-violet-500 mr-3" /> Todos os formatos (A3-A6)</li>
                          <li className="flex items-center"><CheckCircle size={16} className="text-violet-500 mr-3" /> 3 Usuários</li>
                          <li className="flex items-center"><CheckCircle size={16} className="text-violet-500 mr-3" /> Suporte Prioritário</li>
                      </ul>
                  </div>

                  {/* Enterprise */}
                  <div className="rounded-2xl border border-slate-700 bg-[#020617] p-8 flex flex-col hover:border-slate-500 transition-colors">
                      <h3 className="text-xl font-bold text-white mb-2">Rede / Franquia</h3>
                      <p className="text-slate-400 text-sm mb-6">Para gestão de múltiplas unidades</p>
                      <div className="mb-6 flex items-center h-[56px]">
                          <span className="text-2xl font-bold text-white">Sob Consulta</span>
                      </div>
                      <a href="https://wa.me/5511999999999" target="_blank" className="w-full block text-center py-3 px-4 rounded-lg border border-slate-700 text-white font-medium hover:bg-slate-800 transition-colors">
                          Falar com Vendas
                      </a>
                      <ul className="mt-8 space-y-4 text-sm text-slate-300 flex-1">
                          <li className="flex items-center"><CheckCircle size={16} className="text-slate-500 mr-3" /> Múltiplas Lojas</li>
                          <li className="flex items-center"><CheckCircle size={16} className="text-slate-500 mr-3" /> API de Integração</li>
                          <li className="flex items-center"><CheckCircle size={16} className="text-slate-500 mr-3" /> Gerente de Conta</li>
                          <li className="flex items-center"><CheckCircle size={16} className="text-slate-500 mr-3" /> SSO / Login Corporativo</li>
                      </ul>
                  </div>
              </div>
          </div>
      </div>

      {/* --- CTA --- */}
      <div className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-900 to-indigo-900 opacity-50"></div>
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Pronto para transformar sua loja?</h2>
              <p className="text-xl text-violet-100 mb-10 max-w-2xl mx-auto">
                  Junte-se a centenas de lojistas que já automatizaram a criação de cartazes. Teste grátis hoje mesmo.
              </p>
              <Link to="/login">
                  <Button className="h-14 px-10 text-lg bg-white text-violet-900 hover:bg-slate-100 font-bold rounded-full shadow-2xl">
                    Começar Gratuitamente
                  </Button>
              </Link>
          </div>
      </div>

    </div>
  );
};
