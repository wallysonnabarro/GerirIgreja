import { DadosCard } from "./DadosCard";
import { ListaInscricoes } from "./ListaInscricoes";

export interface FichaPagamento {
    count: number;
    pageIndex: number;
    pageSize: number;
    feminino: DadosCard;
    masculino: DadosCard;
    dados: ListaInscricoes[];
}