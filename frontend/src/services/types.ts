export interface Conta {
    id: number;
    nome: string;
    tipo: number;
    saldo: number;
}

export interface Transacao {
    id: number;
    conta: Conta;
    tipo: string;
    valor: number;
    data: string;
    descricao: string;
}