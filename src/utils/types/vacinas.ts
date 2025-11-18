export interface VacinaI {
  animalId: number;
  dataAplicacao: string | number | Date;
  aplicadoPor: string;
  observacoes: string;
  id: number;
  nome: string;
  fabricante?: string;
  lote?: string;
}
