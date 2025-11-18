import { VacinasAplicadasI } from "./vacinasAplicadas";

export interface AcompanhamentoI {
  id: number;
  adocaoId: number;
  dataVisita: string;
  proximaVisita?: string | null;
  observacoes?: string | null;
  usuarioId?: number | null;
  usuario?: {
    id: number;
    nome: string;
    email?: string;
  } | null;
  vacinasAplicadas?: VacinasAplicadasI[]; // ✅ aqui usa o type já existente
  adocao?: {
    id: number;
    animalId: number;
    adotanteId: string;
    animal?: {
      id: number;
      nome: string;
      especie?: string;
    };
  };
}

