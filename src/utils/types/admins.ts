export interface AdminI {
  id: number;
  nome: string;
  email: string;
  ativo: boolean;   // <- CORRETO
  role: string;
}
