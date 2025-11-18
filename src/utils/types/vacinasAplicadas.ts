export interface VacinasAplicadasI {
  id: number;
  dataAplicacao: string;
  observacoes?: string | null;
  vacinaId: number;
  animalId: number;
  vacina: {
    id: number;
    nome: string;
  };
  animal: {
    id: number;
    nome: string;
  };
}
