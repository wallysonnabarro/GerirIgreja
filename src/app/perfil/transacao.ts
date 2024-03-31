export interface Transacao {
    id: number;
    nome: string;
    descricao: string;
    idTransacaoPai: number;
    ordenacao: number;
    string: string;
    status: number;
    dataCadastro: Date;
    stMenu: number;
    stFormulario: number;
    stFuncao: number;
    stControle: number;
}
