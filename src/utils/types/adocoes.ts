// types/adocoes.ts
import { AnimalI } from "./animais";
import { AdotanteI } from "./adotantes";
import { PedidoI } from "./pedidos";
import { AcompanhamentoI } from "./acompanhamento"; // ✅ import do tipo correto

export interface AdocaoI {
  id: number;
  dataAdocao: string;
  status: string;
  pedidoId?: number | null;
  animalId: number;
  adotanteId: string;
  animal: AnimalI;       
  adotante: AdotanteI;
  pedido?: PedidoI | null;
  acompanhamentos?: AcompanhamentoI[]; // ✅ substituído any[] pelo tipo correto
}
