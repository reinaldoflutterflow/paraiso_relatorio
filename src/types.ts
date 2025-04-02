export type NotificationStatus = '1ª Notificação' | '2ª Notificação' | 'Protesto';

export interface Notification {
  id: string;
  date: string;
  type: NotificationStatus;
  details: string;
}

export interface CustomerContact {
  id: string;
  date: string;
  notes: string;
  outcome: string;
}

export interface Bill {
  id: string;
  number: string;
  customerName: string;
  originalAmount: number;
  updatedAmount: number;
  dueDate: string;
  daysOverdue: number;
  status: NotificationStatus;
  notifications: Notification[];
  contacts: CustomerContact[];
  // Campos adicionais da tabela original
  titulo?: string;
  codigo?: string;
  data_vencimento?: string;
  valor?: string;
  valor_num?: number;
  valot_num?: number; // Novo campo float para o valor correto
}

export interface BillsByPeriod {
  '1-30': Bill[];
  '31-60': Bill[];
  '61-90': Bill[];
  '90+': Bill[];
}

export type SortField = 'amount' | 'date' | 'daysOverdue';
export type SortDirection = 'asc' | 'desc';

export interface DashboardSummary {
  totalBills: number;
  totalAmount: number;
  totalInterest: number;
  averageAge: number;
}

// Interface para a view boletos_em_atraso_30_dias do Supabase
export interface BoletoEmAtraso {
  id: string;
  created_at: string;
  titulo: string;
  codigo: string;
  vencimento: string;
  status: string;
  valor: string;
  cliente_id: string;
  valor_num: number;
  valot_num: number; // Novo campo float para o valor correto
  nfse_id: string | null;
  pdf_base64: string | null;
  qr_code: string | null;
  data_vencimento: string;
  pago: boolean;
  linhaDigital: string;
  codigoBarras: string;
  numeroCliente: string;
  nossoNumero: string;
  empresa: string;
}