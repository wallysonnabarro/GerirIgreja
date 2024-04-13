import { CheckInReports } from "./CheckInReports";

export interface DadosRelatorio {
    imagem: Uint16Array;
    tituloRelatorio: string;
    subTituloRelatorio: string;
    dados: CheckInReports[]; 
    titulo: string;
    paragrafo: string;
    nome: string;
    sexo: number;
}