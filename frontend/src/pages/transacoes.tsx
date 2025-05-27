import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Backend from '../services/backend.ts';
import type { Transacao, Conta } from '../services/types.ts';

const Transacoes: React.FC = () => {
    const { contaId } = useParams<{ contaId?: string }>();
    const [mensagem, setMensagem] = useState<string>('Carregando...');
    const [transacoes, setTransacoes] = useState<Transacao[]>([]);
    const [mostrarTransacoes, setMostrarTransacoes] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const [contasCache, setContasCache] = useState<Record<string, Conta>>({});
    useEffect(() => {
        const fetchContas = async () => {
            try {
                const response = await Backend.get('/conta');
                const data = await response.data;
                if (!Array.isArray(data)) {
                    throw new Error('Formato de dados inválido');
                }
                const contasMap = data.reduce((acc, conta) => {
                    acc[conta.id] = conta;
                    return acc;
                }, {} as Record<string, Conta>);
                setContasCache(contasMap);
            } catch (error) {
                console.error('Erro ao carregar contas:', error);
            }
        };

        fetchContas();
    }, []);

    useEffect(() => {
        setMostrarTransacoes(false);
        setMensagem('Carregando transações...');
        const fetchTransacoes = async () => {
            try {
                const endpoint = contaId !== undefined ? `/transacao/conta/${contaId}` : '/transacao';
                console.log(`Buscando transações no endpoint: ${endpoint}`);
                const response = await Backend.get(endpoint);
                const data = await response.data;
                if (!Array.isArray(data)) {
                    throw new Error('Formato de dados inválido');
                }
                if (data.length === 0) {
                    setMensagem('Nenhuma transação encontrada');
                    return;
                }
                const transacoesComConta = data.map((transacao) => ({
                    ...transacao,
                    conta: contasCache[transacao.contaId],
                }))
                setTransacoes(transacoesComConta);
                setMostrarTransacoes(true);
                setMensagem('');
            } catch (error) {
                setMensagem('Erro ao carregar transações: ' + String(error));
                console.error(error);
            }
        };

        fetchTransacoes();
    }, [contaId, contasCache]);

    return (
        <div>
            <div className='relative'>
                <button
                    className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
                    onClick={() => setIsPopupOpen(!isPopupOpen)}
                >
                    Adicionar Transação
                </button>
                {isPopupOpen && (
                    <div className='absolute text-center top-12 left-1/2 transform -translate-x-1/2 mx-auto bg-white border border-gray-300 shadow-lg rounded p-4 w-1/1 md:w-3/4
                        lg:w-1/2 xl:w-1/3'>
                        <h2 className='text-lg font-bold mb-2 text-black'>Adição de Transação</h2>
                        <p className='text-sm text-gray-600'>Este é um exemplo de popup.</p>
                        <select
                            className="text-black border border-gray-300 rounded px-4 py-2 t w-full"
                            disabled={!!contaId}
                            defaultValue={contaId || ''}
                        >
                            <option value="" disabled>
                                Selecione uma conta
                            </option>
                            {Object.values(contasCache).map((conta) => (
                                <option key={conta.id} value={conta.id}>
                                    {conta.nome}
                                </option>
                            ))}
                        </select>
                        <button
                            className='mt-4 bg-red-100 text-white px-4 mx-2 py-2 hover:py-10 rounded hover:bg-red-100'
                            onClick={() => setIsPopupOpen(false)}
                        >
                            Cancelar
                        </button>
                        <button
                            className='mt-4 bg-green-500 text-white px-4 mx-2 py-2 hover:py-10 rounded hover:bg-green-100'
                            onClick={() => setIsPopupOpen(false)}
                        >
                            Confirmar
                        </button>
                    </div>
                )}
            </div>
            <h1>Transações da Conta {contaId}</h1>
            {!mostrarTransacoes ? (
                <p>{mensagem}</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Conta</th>
                            <th>Tipo</th>
                            <th>Valor</th>
                            <th>Data</th>
                            <th>Descrição</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transacoes.length > 0 ? (
                            transacoes.map((transacao) => (
                                <tr key={transacao.id}>
                                    <td>{transacao.id}</td>
                                    <td>{transacao.conta.nome}</td>
                                    <td>{transacao.tipo}</td>
                                    <td>R$ {transacao.valor.toFixed(2)}</td>
                                    <td>{new Date(transacao.data).toLocaleDateString()}</td>
                                    <td>{transacao.descricao}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center' }}>
                                    Nenhuma transação encontrada
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Transacoes;