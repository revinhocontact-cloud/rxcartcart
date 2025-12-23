
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MockService } from '../services/mockService';
import { PrintQueueItem } from '../types';
import { PosterView } from '../components/poster/PosterView';
import { Printer, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const PrintView: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [items, setItems] = useState<PrintQueueItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      const idsParam = searchParams.get('ids');
      if (!idsParam) {
        setLoading(false);
        return;
      }
      
      const ids = idsParam.split(',');
      const allQueue = await MockService.getQueue();
      
      // Filter items that match the IDs
      const selected = allQueue.filter(item => ids.includes(item.id));
      setItems(selected);
      setLoading(false);
    };

    fetchItems();
  }, [searchParams]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="p-8 text-center">Carregando visualização de impressão...</div>;

  if (items.length === 0) {
      return (
          <div className="p-8 text-center">
              <p className="mb-4">Nenhum cartaz encontrado para imprimir.</p>
              <Button onClick={() => navigate('/dashboard/queue')}>Voltar para Fila</Button>
          </div>
      )
  }

  return (
    <div className="min-h-screen bg-gray-100">
        {/* Toolbar - Hidden on Print */}
        <div className="no-print fixed top-0 left-0 w-full bg-slate-900 text-white p-4 shadow-lg z-50 flex justify-between items-center">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate(-1)} className="text-white hover:bg-slate-800">
                    <ArrowLeft size={16} className="mr-2" /> Voltar
                </Button>
                <span className="font-bold text-lg">Visualização de Impressão ({items.length} itens)</span>
            </div>
            <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-500 font-bold px-6">
                <Printer size={18} className="mr-2" />
                IMPRIMIR AGORA
            </Button>
        </div>

        {/* Print Area */}
        <div className="p-8 pt-24 flex flex-wrap gap-1 justify-center bg-white min-h-screen" id="print-canvas">
            {/* Inject Print CSS */}
            <style>{`
                @media print {
                    @page { margin: 0; size: auto; }
                    body { background: white; }
                    .no-print { display: none !important; }
                    #print-canvas { padding: 0 !important; margin: 0 !important; display: flex; flex-wrap: wrap; gap: 0; justify-content: flex-start; }
                    .print-item { page-break-inside: avoid; border: 1px dotted #ddd; margin: 1px; }
                    
                    /* Force sizes */
                    .print-A4 { width: 210mm; height: 297mm; }
                    .print-A5 { width: 148mm; height: 210mm; }
                    .print-A6 { width: 105mm; height: 148mm; }
                    .print-A3 { width: 297mm; height: 420mm; }
                }
            `}</style>

            {items.map((item, idx) => {
                // Render based on quantity, though typically in this view we might just show one per ID 
                // unless expanded. Assuming quantity logic is handled by user adding multiples to queue or printer settings.
                // Here we render exactly what's in the list.
                return (
                    <div key={`${item.id}-${idx}`} className={`print-item print-${item.size} bg-white shadow-sm mb-4`}>
                        <div style={{ width: getWidthMm(item.size), height: getHeightMm(item.size) }}>
                            <PosterView config={item} className="w-full h-full" />
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );
};

const getWidthMm = (size: string) => {
    switch(size) {
        case 'A3': return '297mm';
        case 'A4': return '210mm';
        case 'A5': return '148mm';
        case 'A6': return '105mm';
        default: return '210mm';
    }
}
const getHeightMm = (size: string) => {
    switch(size) {
        case 'A3': return '420mm';
        case 'A4': return '297mm';
        case 'A5': return '210mm';
        case 'A6': return '148mm';
        default: return '297mm';
    }
}
