import React from 'react';
import { NotificationStatus } from '../types';

interface FilterBarProps {
  selectedPeriods: string[];
  onPeriodChange: (periods: string[]) => void;
  selectedStatuses: NotificationStatus[];
  onStatusChange: (statuses: NotificationStatus[]) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedPeriods,
  onPeriodChange,
  selectedStatuses,
  onStatusChange
}) => {
  const periods = [
    { id: '1-30', label: '1-30 dias', color: 'yellow' },
    { id: '31-60', label: '31-60 dias', color: 'orange' },
    { id: '61-90', label: '61-90 dias', color: 'red' },
    { id: '90+', label: '+90 dias', color: 'purple' }
  ];

  const statuses: NotificationStatus[] = ['1ª Notificação', '2ª Notificação', 'Protesto'];

  const togglePeriod = (periodId: string) => {
    // Se já estiver selecionado, remover da seleção
    if (selectedPeriods.includes(periodId)) {
      onPeriodChange(selectedPeriods.filter(p => p !== periodId));
    } 
    // Caso contrário, adicionar à seleção
    else {
      onPeriodChange([...selectedPeriods, periodId]);
    }
  };

  const toggleStatus = (status: NotificationStatus) => {
    if (selectedStatuses.includes(status)) {
      onStatusChange(selectedStatuses.filter(s => s !== status));
    } else {
      onStatusChange([...selectedStatuses, status]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Período de Atraso</h3>
        <div className="flex flex-wrap gap-3">
          {periods.map(period => (
            <button
              key={period.id}
              onClick={() => togglePeriod(period.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedPeriods.includes(period.id) ? 
                  period.id === '1-30' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' : 
                  period.id === '31-60' ? 'bg-orange-50 text-orange-700 border border-orange-200' : 
                  period.id === '61-90' ? 'bg-red-50 text-red-700 border border-red-200' : 
                  'bg-purple-50 text-purple-700 border border-purple-200'
                  : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Seção de Status de Cobrança ocultada conforme solicitado */}
    </div>
  );
};