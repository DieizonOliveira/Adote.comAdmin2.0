// types/adocoes.ts
import { AnimalI } from "./animais";
import { AdotanteI } from "./adotantes";
import { PedidoI } from "./pedidos";

export interface AdocaoI {
  id: number;
  dataAdocao: string;
  status: string;
  pedidoId?: number | null;
  animalId: number;
  adotanteId: string;
  animal: AnimalI;       // ✅ agora inclui fotos e especie
  adotante: AdotanteI;
  pedido?: PedidoI | null;
  acompanhamentos?: any[]; // opcional
}
