import { Transacoes } from "./Transacoes";

export interface PerfilTransacoes {
    nome: string;
    id: number;
    status: number;
    transacoes: Transacoes[];
}