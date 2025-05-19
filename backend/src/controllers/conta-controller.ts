import { Request, Response } from 'express';
import { ContaService } from '../services/conta-service';

export class ContaController {
    async create(req: Request, res: Response) {
        try {
            const { nome, tipo, saldo } = req.body;
            const novaConta = await ContaService.create(nome, tipo, saldo);
            res.status(201).json(novaConta);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Erro inesperado' });
            }
        }
    }
    
    async getAll(req: Request, res: Response) {
        try {
            const contas = await ContaService.getAll();
            res.status(200).json(contas);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Erro inesperado' });
            }
        }
    }
    async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const conta = await ContaService.getById(Number(id));
            res.status(200).json(conta);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Erro inesperado' });
            }
        }
    }
    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { nome, tipo, saldo } = req.body;
            const contaAtualizada = await ContaService.update(Number(id), nome, tipo, saldo);
            res.status(200).json(contaAtualizada);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Erro inesperado' });
            }
        }
    }
    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await ContaService.delete(Number(id));
            res.status(204).send();
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Erro inesperado' });
            }
        }
    }
}