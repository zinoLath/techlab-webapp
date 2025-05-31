import { Conta } from '../database/entities/conta.ts';

export class ContaService {
    // Criar uma nova Conta
    static async create(nome: string, tipo: number, saldo: number = 0): Promise<Conta> {
        if(saldo < 0) {
            throw new Error('Saldo não pode ser negativo');
        }
        const novaConta = new Conta();
        novaConta.nome = nome;
        novaConta.saldo = saldo;
        novaConta.tipo = tipo;

        await novaConta.save();
        return novaConta;
    }

    // Requisitar todas as Contas
    static async getAll(): Promise<Conta[]> {
        return await Conta.find();
    }

    // Requisitar uma Conta por ID
    static async getById(id: number): Promise<Conta> {
        const conta = await Conta.findOneBy({ id: Number(id) });

        if (!conta) {
            throw new Error('Conta não encontrada');
        }
        return conta;
    }

    // Atualizar uma Conta por ID
    static async update(id: number, nome: string, tipo: number, saldo: number): Promise<Conta> {
        const conta = await Conta.findOneBy({ id: Number(id) });
        if (!conta) {
            throw new Error('Conta não encontrada');
        }
        if(saldo && saldo < 0) {
            throw new Error('Saldo não pode ser negativo');
        }

        conta.nome = nome ?? conta.nome;
        conta.saldo = saldo ?? conta.saldo;
        conta.tipo = tipo ?? conta.tipo;

        await conta.save();
        return conta;
    }

    // Deletar uma Conta por ID
    static async delete(id: number): Promise<boolean> {
        const conta = await Conta.findOneBy({ id: Number(id) });
        if (!conta) {
            throw new Error('Conta não encontrada');
        }

        await conta.remove();
        return true;
    }
}