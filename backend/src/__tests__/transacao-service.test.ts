import { TransacaoService } from '../services/transacao-service';
import { ContaService } from '../services/conta-service';
import { AppDataSource } from '../database/database-config';
import { Transacao, Conta, TipoTransacao } from '../database/entidades';

// filepath: /home/zinolath/projects/techlab-webapp/backend/src/__tests__/transacao-service.test.ts

beforeAll(async () => {
    await AppDataSource.initialize();
});

afterAll(async () => {
    await AppDataSource.destroy();
});

describe('TransacaoService', () => {
    it('deve criar uma nova transação de débito', async () => {
        const conta = await ContaService.create('Conta Teste', 0, 100);
        expect(conta).toBeInstanceOf(Conta);
        const transacao = await TransacaoService.create(TipoTransacao.Debito, conta.id, 100, 'Transação Teste', new Date());
        expect(transacao).toBeInstanceOf(Transacao);
        expect(transacao.descricao).toBe('Transação Teste');
        expect(transacao.valor).toBe(100);
        const contaAtualizada = await ContaService.getById(conta.id);
        expect(contaAtualizada.saldo).toBe(0);
    });

    it('deve criar uma nova transação de crédito', async () => {
        const conta = await ContaService.create('Conta Teste', 0, 100);
        expect(conta).toBeInstanceOf(Conta);
        const transacao = await TransacaoService.create(TipoTransacao.Credito, conta.id, 100, 'Transação Teste', new Date());
        expect(transacao).toBeInstanceOf(Transacao);
        expect(transacao.descricao).toBe('Transação Teste');
        expect(transacao.valor).toBe(100);
        const contaAtualizada = await ContaService.getById(conta.id);
        expect(contaAtualizada.saldo).toBe(200);
    });

    it('deve buscar todas as transações', async () => {
        const transacoes = await TransacaoService.getAll();
        expect(Array.isArray(transacoes)).toBe(true);
    });

    it('deve lançar erro ao buscar transação inexistente', async () => {
        await expect(TransacaoService.getById(999)).rejects.toThrow('Transação não encontrada');
    });
});