import React from 'react';
import { Bill } from '../types';
import { formatCurrency } from '../utils/formatters';
import { FileText, PhoneCall, Bell, Gavel } from 'lucide-react';

interface BillCardProps {
  bill: Bill;
  onClick: (bill: Bill) => void;
}

const getColorClass = (daysOverdue: number): string => {
  if (daysOverdue > 90) return 'bg-gradient-to-r from-purple-50 to-white border-purple-500';
  if (daysOverdue > 60) return 'bg-gradient-to-r from-red-50 to-white border-red-500';
  if (daysOverdue > 30) return 'bg-gradient-to-r from-orange-50 to-white border-orange-500';
  return 'bg-gradient-to-r from-yellow-50 to-white border-yellow-500';
};

// Função para obter a cor do status - agora sempre retorna vermelho
const getStatusColor = (status: string): string => {
  // Todos os status agora usam o mesmo estilo de vermelho
  return 'text-red-700 bg-red-50 border border-red-200';
};

export const BillCard: React.FC<BillCardProps> = ({ bill, onClick }) => {
  const colorClass = getColorClass(bill.daysOverdue);
  const statusColor = getStatusColor(bill.status);

  const handleAction = (action: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`Action ${action} for bill ${bill.number}`);
  };

  return (
    <div
      className={`rounded-xl border shadow-sm hover:shadow-md transition-all cursor-pointer ${colorClass}`}
      onClick={() => onClick(bill)}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 pr-2">
            <h3 className="font-semibold text-gray-900">{bill.titulo || bill.customerName}</h3>
            <p className="text-sm text-gray-500 mt-0.5">Boleto: {bill.codigo || bill.number}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusColor}`}>
            Em atraso
          </span>
        </div>

        <div className="flex justify-between mb-4">
          <div>
            <p className="text-sm text-gray-500">Valor Original</p>
            <p className="font-medium text-gray-900">{formatCurrency(bill.valot_num || bill.originalAmount)}</p>
          </div>
          {/* Elemento "Valor Atualizado" ocultado conforme solicitado */}
        </div>

        <div className="flex justify-between text-sm mb-4">
          <div>
            <p className="text-gray-500">Vencimento</p>
            <p className="font-medium text-gray-900">{new Date(bill.data_vencimento || bill.dueDate).toLocaleDateString()}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-500">Dias em Atraso</p>
            <p className="font-medium text-gray-900">{bill.daysOverdue} dias</p>
          </div>
        </div>

        <div className="flex justify-between gap-2 pt-4 border-t border-gray-100">
          <button
            onClick={(e) => handleAction('print', e)}
            className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-indigo-600 transition-colors px-2 py-1 rounded hover:bg-indigo-50"
          >
            <FileText size={14} />
            2ª Via
          </button>
          <button
            onClick={(e) => handleAction('notifications', e)}
            className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-indigo-600 transition-colors px-2 py-1 rounded hover:bg-indigo-50"
          >
            <Bell size={14} />
            Histórico
          </button>
          <button
            onClick={(e) => handleAction('contact', e)}
            className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-indigo-600 transition-colors px-2 py-1 rounded hover:bg-indigo-50"
          >
            <PhoneCall size={14} />
            Contato
          </button>
          <button
            onClick={(e) => handleAction('protest', e)}
            className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-indigo-600 transition-colors px-2 py-1 rounded hover:bg-indigo-50"
          >
            <Gavel size={14} />
            Protestar
          </button>
        </div>
      </div>
    </div>
  );
};