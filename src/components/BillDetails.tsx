import React from 'react';
import { Bill } from '../types';
import { formatCurrency } from '../utils';
import { X } from 'lucide-react';

interface BillDetailsProps {
  bill: Bill;
  onClose: () => void;
}

export const BillDetails: React.FC<BillDetailsProps> = ({ bill, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-xl">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Detalhes do Boleto</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Número do Boleto</p>
              <p className="font-medium text-gray-900">{bill.number}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Cliente</p>
              <p className="font-medium text-gray-900">{bill.customerName}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Valor Original</p>
              <p className="font-medium text-gray-900">{formatCurrency(bill.originalAmount)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Valor Atualizado</p>
              <p className="font-medium text-red-600">{formatCurrency(bill.updatedAmount)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Data de Vencimento</p>
              <p className="font-medium text-gray-900">{new Date(bill.dueDate).toLocaleDateString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Dias em Atraso</p>
              <p className="font-medium text-gray-900">{bill.daysOverdue} dias</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Cálculo de Juros e Multa</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 px-4 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Valor Original</span>
                <span className="font-medium text-gray-900">{formatCurrency(bill.originalAmount)}</span>
              </div>
              <div className="flex justify-between items-center py-2 px-4 bg-red-50 rounded-lg">
                <span className="text-red-600">Juros + Multa</span>
                <span className="font-medium text-red-600">{formatCurrency(bill.updatedAmount - bill.originalAmount)}</span>
              </div>
              <div className="flex justify-between items-center py-2 px-4 bg-gray-900 rounded-lg">
                <span className="text-white font-medium">Total a Pagar</span>
                <span className="font-bold text-white">{formatCurrency(bill.updatedAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};