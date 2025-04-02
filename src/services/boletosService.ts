import { supabase } from '../lib/supabase';
import { BoletoEmAtraso } from '../types';

/**
 * Busca todos os boletos em atraso há mais de 30 dias
 * @returns Lista de boletos em atraso
 */
export async function getBoletoEmAtraso(): Promise<BoletoEmAtraso[]> {
  const { data, error } = await supabase
    .from('boletos_em_atraso_30_dias')
    .select('*');

  if (error) {
    console.error('Erro ao buscar boletos em atraso:', error);
    throw error;
  }

  return data || [];
}

/**
 * Busca um boleto específico pelo ID
 * @param id ID do boleto
 * @returns Boleto encontrado ou null
 */
export async function getBoletoById(id: string): Promise<BoletoEmAtraso | null> {
  const { data, error } = await supabase
    .from('boletos_em_atraso_30_dias')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Erro ao buscar boleto com ID ${id}:`, error);
    return null;
  }

  return data;
}

/**
 * Mapeia um BoletoEmAtraso para o formato Bill usado na interface
 * @param boleto Boleto do Supabase
 * @returns Boleto no formato da interface
 */
export function mapBoletoToBill(boleto: BoletoEmAtraso) {
  // Calcula dias em atraso
  const vencimento = new Date(boleto.data_vencimento);
  const hoje = new Date();
  const diffTime = Math.abs(hoje.getTime() - vencimento.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Determina o status com base nos dias em atraso
  let status: '1ª Notificação' | '2ª Notificação' | 'Protesto' = '1ª Notificação';
  if (diffDays > 60) {
    status = 'Protesto';
  } else if (diffDays > 30) {
    status = '2ª Notificação';
  }

  return {
    id: boleto.id,
    number: boleto.codigo,
    customerName: boleto.titulo, // Usando o campo titulo como nome do cliente
    originalAmount: boleto.valot_num || boleto.valor_num, // Usar valot_num se disponível
    updatedAmount: boleto.valot_num || boleto.valor_num, // Usar valot_num se disponível
    dueDate: boleto.data_vencimento,
    daysOverdue: diffDays,
    status: status,
    notifications: [],
    contacts: [],
    // Campos adicionais da tabela original
    titulo: boleto.titulo,
    codigo: boleto.codigo,
    data_vencimento: boleto.data_vencimento,
    valor: boleto.valor, // Incluindo o campo valor da tabela
    valor_num: boleto.valor_num,
    valot_num: boleto.valot_num // Incluindo o novo campo valot_num
  };
}
