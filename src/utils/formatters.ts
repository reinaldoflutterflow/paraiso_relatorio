/**
 * Utilitários para formatação e conversão de valores monetários
 */

/**
 * Converte uma string de valor monetário em um número
 * Lida com diferentes formatos como "R$ 1.234,56", "1.234,56", "1234.56", etc.
 */
export const parseMoneyValue = (value: string | number | undefined): number => {
  // Se for undefined ou null, retorna 0
  if (value === undefined || value === null) {
    return 0;
  }
  
  // Log para debug
  console.log('Processando valor:', value, 'tipo:', typeof value);
  
  // Se já for um número
  if (typeof value === 'number') {
    // Se for um valor muito pequeno (provavelmente está em centavos ou dividido por 10.000)
    if (value > 0 && value < 0.1) {
      // Multiplicar por 10.000 para obter o valor correto
      const correctedValue = value * 10000;
      console.log('Valor muito pequeno, multiplicando por 10000:', correctedValue);
      return correctedValue;
    }
    
    // Não converter valores inteiros para centavos
    // Valores inteiros como 288 devem permanecer como 288,00 e não 2,88
    console.log('Retornando valor inteiro sem conversão para centavos:', value);
    return value;
  }
  
  // Se for string, processar para extrair o valor numérico
  try {
    // Remover símbolos de moeda e espaços
    let cleanValue = value.toString().trim().replace(/[R$\s]/g, '');
    
    // Verificar se usa formato brasileiro (vírgula como decimal)
    if (cleanValue.includes(',')) {
      // Formato brasileiro: 1.234,56
      // Remover pontos e substituir vírgula por ponto
      cleanValue = cleanValue.replace(/\./g, '').replace(',', '.');
    }
    
    // Converter para número
    const numericValue = parseFloat(cleanValue);
    
    // Se não for um número válido, retorna 0
    if (isNaN(numericValue)) {
      console.log('Valor inválido após processamento, retornando 0');
      return 0;
    }
    
    // Não converter valores inteiros para centavos
    // Valores inteiros como "288" devem permanecer como 288,00 e não 2,88
    console.log('Valor string sem conversão para centavos:', numericValue);
    return numericValue;
  } catch (error) {
    console.error('Erro ao processar valor:', error);
    return 0;
  }
};

/**
 * Formata um número para o formato de moeda brasileira (R$)
 */
export const formatCurrency = (value: number | string | undefined): string => {
  // Converter para número se for string ou undefined
  const numericValue = parseMoneyValue(value);
  
  // Formatar para o padrão brasileiro
  // Usando Intl.NumberFormat para garantir a formatação correta
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericValue);
};
