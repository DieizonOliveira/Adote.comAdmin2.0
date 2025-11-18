import { AnimalI } from "./animais"
import { AdotanteI } from "./adotantes"
import { AdocaoI } from "./adocoes" // ✅ import do tipo correto

export interface PedidoI {
  id: number
  adotanteId: string
  adotante: AdotanteI
  animalId: number
  animal: AnimalI
  descricao: string
  resposta: string | null
  aprovado: boolean
  adocao?: AdocaoI | null  // ✅ tipo correto
  createdAt: string
  updatedAt: string | null
}
