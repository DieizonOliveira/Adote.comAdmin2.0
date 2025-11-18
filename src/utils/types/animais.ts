export interface FotoI {
  id: number
  codigoFoto: string
  descricao?: string
  animalId?: number
}

export interface EspecieI {
  id: number
  nome: string
}

export interface AnimalI {
  id: number
  nome: string
  idade: number
  sexo: "Macho" | "Femea"
  descricao?: string
  porte: "Pequeno" | "Medio" | "Grande"
  disponivel: boolean
  castracao: boolean
  destaque: boolean
  especieId: number
  especie: EspecieI
  fotos: FotoI[] // ✅ novo campo com as fotos
}
