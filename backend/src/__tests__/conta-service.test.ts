import { ContaService } from '../services/conta-service';
import { AppDataSource } from '../database/database-config';
import { Conta } from '../database/entidades';

beforeAll(async () => {
  await AppDataSource.initialize();
});

afterAll(async () => {
  await AppDataSource.destroy();
});

describe('ContaService', () => {
    it('deve criar uma nova conta', async () => {
        const conta = await ContaService.create('Conta Teste', 0, 100);
        expect(conta).toBeInstanceOf(Conta);
        expect(conta.nome).toBe('Conta Teste');
        expect(conta.saldo).toBe(100);
    });

    it('deve buscar todas as contas', async () => {
        const contas = await ContaService.getAll();
        expect(Array.isArray(contas)).toBe(true);
    });

    it('deve lançar erro ao buscar conta inexistente', async () => {
        await expect(ContaService.getById(999)).rejects.toThrow('Conta não encontrada');
    });

    it('deve lançar erro ao criar conta com saldo negativo', async () => {
        await expect(ContaService.create('Conta Negativa', 0, -100)).rejects.toThrow('Saldo não pode ser negativo');
    });

    it('deve lançar erro ao atualizar conta com saldo negativo', async () => {
        const conta = await ContaService.create('Conta Atualizar', 0, 100);
        await expect(ContaService.update(conta.id, 'Conta Atualizada', 0, -50)).rejects.toThrow('Saldo não pode ser negativo');
    });

    it('deve atualizar uma conta existente', async () => {
        const conta = await ContaService.create('Conta Atualizar', 0, 100);
        const contaAtualizada = await ContaService.update(conta.id, 'Conta Atualizada', 1, 200);
        expect(contaAtualizada.nome).toBe('Conta Atualizada');
        expect(contaAtualizada.tipo).toBe(1);
        expect(contaAtualizada.saldo).toBe(200);
    });

    it('deve deletar uma conta existente', async () => {
        const conta = await ContaService.create('Conta Deletar', 0, 100);
        const resultado = await ContaService.delete(conta.id);
        expect(resultado).toBe(true);
        await expect(ContaService.getById(conta.id)).rejects.toThrow('Conta não encontrada');
    });
});