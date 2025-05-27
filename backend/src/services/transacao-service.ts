import { AppDataSource } from '../database/database-config.ts';
import { Conta, Transacao, TipoTransacao } from '../database/entidades.ts';

export class TransacaoService {
    static async create(tipo: number, contaid: number, valor: number, descricao: string, data: Date): Promise<Transacao> {
        if(valor < 0) {
            throw new Error('Valor não pode ser negativo');
        }
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction()
        try {
            const novaTransacao = new Transacao();
            const conta = await Conta.findOneBy({ id: Number(contaid) });
            if (!conta) {
                throw new Error('Conta não encontrada');
            }
            if (tipo === TipoTransacao.Debito) {
                conta.saldo -= valor;
            } else if (tipo === TipoTransacao.Credito) {
                conta.saldo += valor;
            }
            if (conta.saldo < 0) {
                throw new Error('Saldo insuficiente');
            }
            await queryRunner.manager.save(conta);

            novaTransacao.tipo = tipo;
            novaTransacao.conta = conta;
            novaTransacao.valor = valor;
            novaTransacao.descricao = descricao;
            novaTransacao.data = data;
            await queryRunner.manager.save(novaTransacao);
            await queryRunner.commitTransaction();
            return novaTransacao;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
        
    }
    static async getAll(): Promise<Transacao[]> {
        return await Transacao.find({ relations: ['conta'] });
    }
    static async getById(id: number): Promise<Transacao> {
        const transacao = await Transacao.findOneBy({ id: Number(id) });
        if (!transacao) {
            throw new Error('Transação não encontrada');
        }
        return transacao;
    }
    static async getByContaId(contaId: number): Promise<Transacao[]> {
        const transacoes = await Transacao.find({ where: { conta: { id: contaId } }, relations: ['conta'] });
        if (!transacoes) {
            throw new Error('Transações não encontradas');
        }
        return transacoes;
    }
    static async transfer(contaOrigemId: number, contaDestinoId: number, valor: number, descricao: string, data: Date): Promise<{ transOrigem: Transacao; transDestino: Transacao }> {
        if(valor < 0) {
            throw new Error('Valor não pode ser negativo');
        }
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction(); //utilizando transactions para garantir a atomicidade

        try {
            const contaOrigem = await Conta.findOneBy({ id: Number(contaOrigemId) });
            const contaDestino = await Conta.findOneBy({ id: Number(contaDestinoId) });

            if (!contaOrigem || !contaDestino) {
                throw new Error('Conta de origem ou destino não encontrada');
            }

            if (contaOrigem.saldo < valor) {
                throw new Error('Saldo insuficiente na conta de origem');
            }
            

            contaOrigem.saldo -= valor;
            contaDestino.saldo += valor;
            if (contaOrigem.saldo < 0) {
                throw new Error('Saldo insuficiente');
            }

            await queryRunner.manager.save(contaOrigem);
            await queryRunner.manager.save(contaDestino);

            const transacaoOrigem = new Transacao();
            transacaoOrigem.tipo = TipoTransacao.Credito;
            transacaoOrigem.conta = contaOrigem;
            transacaoOrigem.valor = valor;
            transacaoOrigem.descricao = descricao;
            transacaoOrigem.data = data;

            const transacaoDestino = new Transacao();
            transacaoDestino.tipo = TipoTransacao.Debito;
            transacaoDestino.conta = contaDestino;
            transacaoDestino.valor = valor;
            transacaoDestino.descricao = descricao;
            transacaoDestino.data = data;
            

            await queryRunner.manager.save(transacaoOrigem);
            await queryRunner.manager.save(transacaoDestino);
            await queryRunner.commitTransaction();

            return {transOrigem: transacaoOrigem, transDestino: transacaoDestino};
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}