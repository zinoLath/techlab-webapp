export const TipoConta = {
    Corrente: 0,
    Poupanca: 1,
    Investimento: 2,
    CartaoCredito: 3,
} as const;

type TipoConta = typeof TipoConta[keyof typeof TipoConta];

export const TipoContaLabels: Record<TipoConta | number, string> = {
    [TipoConta.Corrente]: 'Corrente',
    [TipoConta.Poupanca]: 'Poupança',
    [TipoConta.Investimento]: 'Investimento',
    [TipoConta.CartaoCredito]: 'Cartão de Crédito',
};

export const TipoTransacao = {
    Debito: 0,
    Credito: 1,
} as const;

type TipoTransacao = typeof TipoTransacao[keyof typeof TipoTransacao];

export const TipoTransacaoLabels: Record<TipoTransacao | number, string> = {
    [TipoTransacao.Debito]: 'Débito',
    [TipoTransacao.Credito]: 'Crédito',
};