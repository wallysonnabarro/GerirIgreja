import { Transacao } from "./transacao";

export interface PerfilListaPaginadaDto {    
    id: number;
    nome: string;
    transacoes: Transacao[];
}
