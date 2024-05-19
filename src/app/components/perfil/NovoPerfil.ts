export interface NovoPerfil{    
    perfilName: string;
    statusSelecionadoId: number;
    contratoSelecionadoId: number;
    tribosEquipes: boolean;
    membros: boolean;
    cadastroEvento: boolean;
    eventosSele: boolean;
    area: boolean;
    inscricoes: boolean;
    inscricoesVoluntarios: boolean;
    administracoe: boolean;
    novoUsuario: boolean;
    redefinirSenha: boolean;
    redefinirAcesso: boolean;
    fechamentoPagamentos: boolean;
    fechamentoEvento: boolean;
    SaidaPagamentos: boolean;
    ofertasEvento: boolean;
    lanchonete: boolean;
    financeiro: boolean;
    registrarFinanceiro: boolean;
    despesasObrigações: boolean; 
    visualizarFinanceiro: boolean;
    tiposSaida: boolean;
    logout: boolean;
    login: boolean;
}