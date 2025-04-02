import React from 'react';
import { DashboardSummary } from '../types';
import { formatCurrency } from '../utils/formatters';
import { FileText, Banknote, Percent, Clock } from 'lucide-react';

interface SummaryPanelProps {
  summary: DashboardSummary;
}

export const SummaryPanel: React.FC<SummaryPanelProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <FileText size={24} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Total de Boletos</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{summary.totalBills}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-50 rounded-lg">
            <Banknote size={24} className="text-green-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Valor Total</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(summary.totalAmount)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-50 rounded-lg">
            <Clock size={24} className="text-purple-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Dias em média</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {Math.round(summary.averageAge)} dias
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};