import React, { useState, useMemo, useEffect } from 'react';
import { Bill, NotificationStatus, SortField, SortDirection, BoletoEmAtraso } from '../types';
import { BillCard } from './BillCard';
import { SummaryPanel } from './SummaryPanel';
import { FilterBar } from './FilterBar';
import { BillDetails } from './BillDetails';
import { getBoletoEmAtraso, mapBoletoToBill } from '../services/boletosService';
import { parseMoneyValue, formatCurrency } from '../utils/formatters';
import { 
  Download, 
  ArrowUpDown,
  Calendar,
  DollarSign,
  Clock,
} from 'lucide-react';
import { generateBillsReport } from '../services/pdfService';

const Dashboard: React.FC = () => {
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [sortField, setSortField] = useState<SortField>('daysOverdue');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filterPeriod, setFilterPeriod] = useState<string[]>(['1-30', '31-60', '61-90', '90+']);
  const [statusFilter, setStatusFilter] = useState<NotificationStatus[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBoletos = async () => {
      try {
        setLoading(true);
        const boletosData = await getBoletoEmAtraso();
        const mappedBills = boletosData.map(boleto => mapBoletoToBill(boleto));
        setBills(mappedBills);
      } catch (err) {
        console.error('Erro ao buscar boletos:', err);
        setError('Não foi possível carregar os boletos. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchBoletos();
  }, []);

  // Dados de exemplo para caso não haja dados no Supabase ou ocorra um erro
  const fallbackBills: Bill[] = [
    {
      id: '1',
      number: 'BOL001',
      customerName: 'João Silva',
      originalAmount: 1500.00,
      updatedAmount: 1650.00,
      dueDate: '2024-01-15',
      daysOverdue: 45,
      status: '1ª Notificação',
      notifications: [
        {
          id: '1',
          date: '2024-02-01',
          type: '1ª Notificação',
          details: 'Notificação enviada por e-mail'
        }
      ],
      contacts: [
        {
          id: '1',
          date: '2024-02-05',
          notes: 'Cliente solicitou prazo adicional',
          outcome: 'Aguardando pagamento'
        }
      ]
    },
    {
      id: '2',
      number: 'BOL002',
      customerName: 'Maria Santos',
      originalAmount: 2800.00,
      updatedAmount: 3150.00,
      dueDate: '2024-01-05',
      daysOverdue: 55,
      status: '2ª Notificação',
      notifications: [],
      contacts: []
    },
    {
      id: '3',
      number: 'BOL003',
      customerName: 'Pedro Oliveira',
      originalAmount: 4200.00,
      updatedAmount: 4830.00,
      dueDate: '2023-12-20',
      daysOverdue: 71,
      status: '2ª Notificação',
      notifications: [],
      contacts: []
    },
    {
      id: '4',
      number: 'BOL004',
      customerName: 'Ana Costa',
      originalAmount: 1800.00,
      updatedAmount: 2070.00,
      dueDate: '2024-01-25',
      daysOverdue: 35,
      status: '1ª Notificação',
      notifications: [],
      contacts: []
    },
    {
      id: '5',
      number: 'BOL005',
      customerName: 'Carlos Ferreira',
      originalAmount: 3500.00,
      updatedAmount: 4200.00,
      dueDate: '2023-12-10',
      daysOverdue: 81,
      status: 'Protesto',
      notifications: [],
      contacts: []
    },
    {
      id: '6',
      number: 'BOL006',
      customerName: 'Lucia Mendes',
      originalAmount: 2100.00,
      updatedAmount: 2415.00,
      dueDate: '2024-01-30',
      daysOverdue: 30,
      status: '1ª Notificação',
      notifications: [],
      contacts: []
    },
    {
      id: '7',
      number: 'BOL007',
      customerName: 'Roberto Alves',
      originalAmount: 5600.00,
      updatedAmount: 6720.00,
      dueDate: '2023-12-05',
      daysOverdue: 86,
      status: 'Protesto',
      notifications: [],
      contacts: []
    },
    {
      id: '8',
      number: 'BOL008',
      customerName: 'Sandra Lima',
      originalAmount: 1900.00,
      updatedAmount: 2090.00,
      dueDate: '2024-01-20',
      daysOverdue: 40,
      status: '1ª Notificação',
      notifications: [],
      contacts: []
    },
    {
      id: '9',
      number: 'BOL009',
      customerName: 'Fernando Santos',
      originalAmount: 3200.00,
      updatedAmount: 3840.00,
      dueDate: '2023-12-15',
      daysOverdue: 76,
      status: '2ª Notificação',
      notifications: [],
      contacts: []
    },
    {
      id: '10',
      number: 'BOL010',
      customerName: 'Patricia Costa',
      originalAmount: 2700.00,
      updatedAmount: 3105.00,
      dueDate: '2024-01-10',
      daysOverdue: 50,
      status: '2ª Notificação',
      notifications: [],
      contacts: []
    }
  ];

  // Primeiro, aplicar apenas os filtros (sem ordenação)
  const filteredBillsUnordered = useMemo(() => {
    // Para fins de teste, vamos garantir que os dados de exemplo tenham valores de daysOverdue variados
    const testData = fallbackBills.map((bill, index) => {
      // Distribuir os boletos em diferentes faixas de atraso para teste
      let daysOverdue = bill.daysOverdue;
      if (index % 4 === 0) daysOverdue = 15; // 1-30 dias
      else if (index % 4 === 1) daysOverdue = 45; // 31-60 dias
      else if (index % 4 === 2) daysOverdue = 75; // 61-90 dias
      else daysOverdue = 100; // 90+ dias
      
      return {...bill, daysOverdue};
    });
    
    const dataSource = bills.length > 0 ? bills : testData;
    
    // Se nenhum filtro estiver selecionado, não mostrar nenhum boleto
    if (filterPeriod.length === 0) {
      return [];
    }
    
    // Filtrar por período
    const filteredByPeriod = dataSource.filter(bill => {
      // Verificar se o boleto está em algum dos períodos selecionados
      return filterPeriod.some(period => {
        if (period === '1-30') {
          return bill.daysOverdue >= 1 && bill.daysOverdue <= 30;
        } else if (period === '31-60') {
          return bill.daysOverdue >= 31 && bill.daysOverdue <= 60;
        } else if (period === '61-90') {
          return bill.daysOverdue >= 61 && bill.daysOverdue <= 90;
        } else if (period === '90+') {
          return bill.daysOverdue > 90;
        }
        return false;
      });
    });
    
    // Depois filtrar por status
    let filteredByStatus = filteredByPeriod;
    if (statusFilter.length > 0) {
      filteredByStatus = filteredByPeriod.filter(bill => {
        return statusFilter.includes(bill.status);
      });
    }
    
    // Retornar os boletos filtrados (sem ordenação)
    return filteredByStatus;
  }, [bills, fallbackBills, filterPeriod, statusFilter]);
  
  // Depois, aplicar a ordenação aos boletos filtrados
  const filteredBills = useMemo(() => {
    // Ordenar os boletos filtrados
    return [...filteredBillsUnordered].sort((a, b) => {
      const multiplier = sortDirection === 'asc' ? 1 : -1;
      switch (sortField) {
        case 'amount':
          // Usar o campo valot_num se disponível, caso contrário usar outras opções
          const aValue = parseMoneyValue(a.valot_num || a.valor_num || a.valor || a.originalAmount);
          const bValue = parseMoneyValue(b.valot_num || b.valor_num || b.valor || b.originalAmount);
          
          return (aValue - bValue) * multiplier;
        case 'date':
          // Usar data_vencimento se disponível, caso contrário usar dueDate
          const aDate = new Date(a.data_vencimento || a.dueDate).getTime();
          const bDate = new Date(b.data_vencimento || b.dueDate).getTime();
          return (aDate - bDate) * multiplier;
        case 'daysOverdue':
          return (a.daysOverdue - b.daysOverdue) * multiplier;
        default:
          return 0;
      }
    });
  }, [filteredBillsUnordered, sortField, sortDirection]);

  const summary = useMemo(() => {
    // Calcular o valor total usando os valores corretos dos boletos filtrados
    // Importante: usamos filteredBillsUnordered para que a ordenação não afete o cálculo
    let totalAmount = 0;
    console.log('Calculando valor total para', filteredBillsUnordered.length, 'boletos filtrados');
    
    // Mapear todos os valores primeiro para depuração
    const allValues = filteredBillsUnordered.map((bill, index) => {
      // Usar o campo valot_num como prioridade
      let billValue = 0;
      let source = '';
      
      if (bill.valot_num !== undefined && bill.valot_num !== null) {
        // O campo valot_num é o valor correto em float
        billValue = bill.valot_num;
        source = 'valot_num';
      } else if (bill.valor_num !== undefined && bill.valor_num !== null) {
        // Se não tiver valot_num, usar valor_num
        billValue = bill.valor_num;
        source = 'valor_num';
      } else if (bill.valor) {
        // Se não tiver valor_num, tentar converter o valor string
        billValue = parseMoneyValue(bill.valor);
        source = 'valor string';
      } else {
        // Como último recurso, usar originalAmount
        billValue = bill.originalAmount;
        source = 'originalAmount';
      }
      
      console.log(`Boleto ${index + 1} (${bill.codigo || bill.number}):`, 
                  `Valor: ${billValue} - Fonte: ${source}`);
      
      return billValue;
    });
    
    // Verificar se há valores muito pequenos que podem estar divididos por 10.000
    const hasVerySmallValues = allValues.some(v => v > 0 && v < 0.1);
    
    // Somar todos os valores
    allValues.forEach(value => {
      // Se houver valores muito pequenos, multiplicar todos por 10.000 para normalizar
      if (hasVerySmallValues && value > 0 && value < 0.1) {
        totalAmount += value * 10000;
      } else {
        totalAmount += value;
      }
    });
    
    // Log do valor total para depuração
    console.log('Todos os valores:', allValues);
    console.log('Valor total calculado:', totalAmount);

    return {
      totalBills: filteredBillsUnordered.length,
      totalAmount: totalAmount,
      totalInterest: 0, // Não usado mais, mas mantido para compatibilidade
      averageAge: filteredBillsUnordered.length > 0 
        ? filteredBillsUnordered.reduce((sum, bill) => sum + bill.daysOverdue, 0) / filteredBillsUnordered.length 
        : 0
    };
  }, [filteredBillsUnordered]);

  const handleSort = (field: SortField) => {
    // Se o campo já estiver selecionado, apenas inverte a direção
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Se for um novo campo, define o campo e a direção inicial
      setSortField(field);
      
      // Direção inicial baseada no tipo de campo
      // Para dias em atraso e valores, começar com o maior (desc)
      // Para datas, começar com o mais recente (desc)
      setSortDirection('desc');
    }
    
    // Mantém os filtros de período ativos
    // Não precisamos fazer nada aqui, pois o filteredBills já considera
    // tanto os filtros quanto a ordenação
  };

  const handleExport = () => {
    // Criar descrição do filtro aplicado
    let filterDescription = 'Todos os boletos';
    
    if (filterPeriod.length > 0 && filterPeriod.length < 4) {
      const periodLabels = {
        '1-30': '1-30 dias',
        '31-60': '31-60 dias',
        '61-90': '61-90 dias',
        '90+': '+90 dias'
      };
      
      const selectedPeriods = filterPeriod.map(period => periodLabels[period as keyof typeof periodLabels]);
      filterDescription = `Período de atraso: ${selectedPeriods.join(', ')}`;
    }
    
    // Gerar o relatório PDF com os boletos filtrados
    generateBillsReport(
      filteredBillsUnordered,
      filterDescription,
      summary.totalAmount,
      summary.averageAge
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-[1400px] mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Controle de Inadimplência</h1>
            <p className="text-gray-500 mt-1">Gerencie sua carteira de cobranças de forma eficiente</p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-6 py-2.5 text-white rounded-lg transition-colors shadow-sm hover:shadow-md"
            style={{ backgroundColor: '#40897c', hover: { backgroundColor: '#357568' } }}
          >
            <Download size={18} />
            Exportar Relatório
          </button>
        </div>

        <SummaryPanel summary={summary} />

        <div className="mt-10 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <FilterBar
              onPeriodChange={setFilterPeriod}
              selectedPeriods={filterPeriod}
              onStatusChange={setStatusFilter}
              selectedStatuses={statusFilter}
            />

            <div className="flex gap-6 mt-6">
              <button
                onClick={() => handleSort('amount')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  sortField === 'amount' 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                title="Ordenar por valor"
              >
                <DollarSign size={18} />
                Valor
                {sortField === 'amount' && (
                  <span className="ml-1">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </button>
              <button
                onClick={() => handleSort('date')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  sortField === 'date' 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                title="Ordenar por data"
              >
                <Calendar size={18} />
                Data
                {sortField === 'date' && (
                  <span className="ml-1">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </button>
              <button
                onClick={() => handleSort('daysOverdue')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  sortField === 'daysOverdue' 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                title="Ordenar por dias em atraso"
              >
                <Clock size={18} />
                Dias em Atraso
                {sortField === 'daysOverdue' && (
                  <span className="ml-1">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : error ? (
              <div className="text-center p-8 text-red-500">{error}</div>
            ) : filteredBills.length === 0 ? (
              <div className="text-center p-8 text-gray-500">Nenhum boleto em atraso encontrado.</div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredBills.map(bill => (
                  <BillCard
                    key={bill.id}
                    bill={bill}
                    onClick={setSelectedBill}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedBill && (
        <BillDetails
          bill={selectedBill}
          onClose={() => setSelectedBill(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;