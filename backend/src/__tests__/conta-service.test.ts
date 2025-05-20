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
});