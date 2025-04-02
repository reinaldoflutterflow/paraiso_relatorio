import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Bill } from '../types';
import { formatCurrency } from '../utils/formatters';

// Função para obter a cor com base nos dias de atraso
const getColorByDaysOverdue = (daysOverdue: number): string => {
  if (daysOverdue > 90) return '#d8b4fe'; // Roxo claro
  if (daysOverdue > 60) return '#fecaca'; // Vermelho claro
  if (daysOverdue > 30) return '#fed7aa'; // Laranja claro
  return '#fef08a'; // Amarelo claro
};

// Função para formatar a data
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

// Função para gerar o PDF
export const generateBillsReport = (
  bills: Bill[],
  filterDescription: string,
  totalAmount: number,
  averageAge: number
): void => {
  // Criar uma nova instância do jsPDF
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Adicionar cabeçalho com logo e título
  doc.setFillColor(64, 137, 124); // Cor de fundo do cabeçalho (#40897c - verde esmeralda)
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  // Título do relatório
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Relatório de Boletos em Atraso', pageWidth / 2, 20, { align: 'center' });
  
  // Subtítulo com data atual
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  const today = new Date().toLocaleDateString('pt-BR');
  doc.text(`Gerado em: ${today}`, pageWidth / 2, 30, { align: 'center' });
  
  // Adicionar informações do filtro e resumo
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Filtro aplicado: ${filterDescription}`, 14, 50);
  
  // Adicionar caixas de resumo
  // Total de boletos
  doc.setFillColor(240, 249, 255); // Azul claro
  doc.roundedRect(14, 60, 55, 25, 3, 3, 'F');
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.text('Total de Boletos', 20, 70);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`${bills.length}`, 20, 80);
  
  // Valor total
  doc.setFillColor(240, 255, 244); // Verde claro
  doc.roundedRect(75, 60, 55, 25, 3, 3, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Valor Total', 81, 70);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(formatCurrency(totalAmount), 81, 80);
  
  // Dias em média
  doc.setFillColor(252, 245, 255); // Roxo claro
  doc.roundedRect(136, 60, 55, 25, 3, 3, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Dias em média', 142, 70);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`${Math.round(averageAge)} dias`, 142, 80);
  
  // Legenda de cores
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Legenda:', 14, 100);
  
  // Desenhar legendas coloridas
  const legendY = 105;
  const legendWidth = 40;
  const legendHeight = 6;
  const legendSpacing = 50;
  
  // 1-30 dias
  doc.setFillColor(254, 240, 138); // Amarelo
  doc.roundedRect(14, legendY, legendWidth, legendHeight, 1, 1, 'F');
  doc.text('1-30 dias', 14, legendY + 15);
  
  // 31-60 dias
  doc.setFillColor(254, 215, 170); // Laranja
  doc.roundedRect(14 + legendSpacing, legendY, legendWidth, legendHeight, 1, 1, 'F');
  doc.text('31-60 dias', 14 + legendSpacing, legendY + 15);
  
  // 61-90 dias
  doc.setFillColor(254, 202, 202); // Vermelho
  doc.roundedRect(14 + legendSpacing * 2, legendY, legendWidth, legendHeight, 1, 1, 'F');
  doc.text('61-90 dias', 14 + legendSpacing * 2, legendY + 15);
  
  // +90 dias
  doc.setFillColor(216, 180, 254); // Roxo
  doc.roundedRect(14 + legendSpacing * 3, legendY, legendWidth, legendHeight, 1, 1, 'F');
  doc.text('+90 dias', 14 + legendSpacing * 3, legendY + 15);
  
  // Preparar dados para a tabela
  const tableData = bills.map(bill => [
    bill.codigo || bill.number,
    bill.titulo || bill.customerName,
    formatCurrency(bill.valot_num || bill.valor_num || bill.originalAmount),
    formatDate(bill.data_vencimento || bill.dueDate),
    `${bill.daysOverdue} dias`,
    'Em atraso'
  ]);
  
  // Definir cabeçalhos da tabela
  const headers = [
    'Código',
    'Cliente',
    'Valor',
    'Vencimento',
    'Dias em Atraso',
    'Status'
  ];
  
  // Criar a tabela
  autoTable(doc, {
    startY: 130,
    head: [headers],
    body: tableData,
    headStyles: {
      fillColor: [64, 137, 124], // #40897c - verde esmeralda
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    willDrawCell: (data) => {
      // Não aplicar cor às células do cabeçalho
      if (data.section === 'head') return;
      
      // Obter os dias em atraso da linha atual
      const daysOverdueText = data.row.cells[4].text.toString();
      const daysOverdue = parseInt(daysOverdueText);
      
      // Definir a cor de fundo com base nos dias em atraso
      if (!isNaN(daysOverdue)) {
        data.cell.styles.fillColor = getColorByDaysOverdue(daysOverdue);
      }
    },
    styles: {
      fontSize: 10,
      cellPadding: 3
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250]
    }
  });
  
  // Adicionar rodapé
  const pageCount = doc.internal.getNumberOfPages();
  doc.setFontSize(10);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setTextColor(100, 100, 100);
    doc.text(
      'Paraíso Ambiental - Relatório de Inadimplência',
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
    doc.text(
      `Página ${i} de ${pageCount}`,
      pageWidth - 20,
      doc.internal.pageSize.getHeight() - 10
    );
  }
  
  // Salvar o PDF
  doc.save('relatorio-boletos-em-atraso.pdf');
};
