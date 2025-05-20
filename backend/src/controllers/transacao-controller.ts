import { Request, Response } from 'express';
import { TransacaoService } from '../services/transacao-service.ts';

export class TransacaoController {
    static async create(req: Request, res: Response) {
        try {
            const { tipo, conta, vlaor, descricao, data } = req.body;
            const novaTransacao = await TransacaoService.create(tipo, conta, vlaor, descricao, data);
            res.status(201).json(novaTransacao);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Erro inesperado' });
            }
        }
    }
    static async getAll(req: Request, res: Response) {
        try {
            const transacoes = await TransacaoService.getAll();
            res.status(200).json(transacoes);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Erro inesperado' });
            }
        }
    }
    static async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const transacao = await TransacaoService.getById(Number(id));
            res.status(200).json(transacao);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Erro inesperado' });
            }
        }
    }
    static async transfer(req: Request, res: Response) {
        try {
            const { contaOrigem, contaDestino, valor, descricao, data } = req.body;
            const { transOrigem, transDestino } = await TransacaoService.transfer(contaOrigem, contaDestino, valor, descricao, data);
            res.status(200).json({ origem: transOrigem, destino: transDestino });
        }catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Erro inesperado' });
            }
        }
    }
}