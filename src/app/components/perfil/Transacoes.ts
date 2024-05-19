export interface Transacoes {
    id: number;
    nome: string;
    descricao: string;
    idTransacaoPai: number;
    ordenacao: number;
    rota: string;
    status: number;
    dataCadastro: Date;
    stMenu: number;
    stFormulario: number;
    stFuncao: number;
    stControle: number;
}