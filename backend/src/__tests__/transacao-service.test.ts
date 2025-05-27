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

    it('deve transferir valor entre contas', async () => {
        const contaOrigem = await ContaService.create('Conta Origem', 0, 100);
        const contaDestino = await ContaService.create('Conta Destino', 0, 100);
        expect(contaOrigem).toBeInstanceOf(Conta);
        expect(contaDestino).toBeInstanceOf(Conta);
        const { transOrigem, transDestino } = await TransacaoService.transfer(contaOrigem.id, contaDestino.id, 50, 'Transferência Teste', new Date());
        expect(transOrigem).toBeInstanceOf(Transacao);
        expect(transDestino).toBeInstanceOf(Transacao);
        expect(transOrigem.descricao).toBe('Transferência Teste');
        expect(transOrigem.valor).toBe(50);
        expect(transDestino.descricao).toBe('Transferência Teste');
        expect(transDestino.valor).toBe(50);
        const contaOrigemAtualizada = await ContaService.getById(contaOrigem.id);
        const contaDestinoAtualizada = await ContaService.getById(contaDestino.id);
        expect(contaOrigemAtualizada.saldo).toBe(50);
        expect(contaDestinoAtualizada.saldo).toBe(150);
    });
    it('deve lançar erro ao transferir valor negativo', async () => {
        const contaOrigem = await ContaService.create('Conta Origem', 0, 100);
        const contaDestino = await ContaService.create('Conta Destino', 0, 100);
        expect(contaOrigem).toBeInstanceOf(Conta);
        expect(contaDestino).toBeInstanceOf(Conta);
        await expect(TransacaoService.transfer(contaOrigem.id, contaDestino.id, -50, 'Transferência Teste', new Date())).rejects.toThrow('Valor não pode ser negativo');
    });
    it('deve lançar erro ao transferir valor maior que o saldo da conta de origem', async () => {
        const contaOrigem = await ContaService.create('Conta Origem', 0, 100);
        const contaDestino = await ContaService.create('Conta Destino', 0, 100);
        expect(contaOrigem).toBeInstanceOf(Conta);
        expect(contaDestino).toBeInstanceOf(Conta);
        await expect(TransacaoService.transfer(contaOrigem.id, contaDestino.id, 150, 'Transferência Teste', new Date())).rejects.toThrow('Saldo insuficiente na conta de origem');
    });
    it('deve requisitar transações por conta', async () => {
        const conta = await ContaService.create('Conta Teste', 0, 100);
        expect(conta).toBeInstanceOf(Conta);
        const transacao = await TransacaoService.create(TipoTransacao.Debito, conta.id, 100, 'Transação Teste', new Date());
        expect(transacao).toBeInstanceOf(Transacao);
        expect(transacao.descricao).toBe('Transação Teste');
        expect(transacao.valor).toBe(100);
        const transacoes = await TransacaoService.getByContaId(conta.id);
        expect(Array.isArray(transacoes)).toBe(true);
        expect(transacoes.length).toBeGreaterThan(0);
        expect(transacoes[0].descricao).toBe('Transação Teste');
        expect(transacoes[0].valor).toBe(100);
        expect(transacoes[0].conta.id).toBe(conta.id);
    });
});