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
    const [contaOrigem, setContaOrigem] = useState<string | undefined>(contaId);
    const [contaDestino, setContaDestino] = useState<string | undefined>(undefined);
    const [tipoTransacao, setTipoTransacao] = useState<string>('');


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

    const handleConfirmarTransacao = async () => {
        const valor = Number((document.getElementById('valor') as HTMLInputElement).value.replace(/\D/g, ''));
        const descricao = (document.getElementById('descricao') as HTMLTextAreaElement).value;
        const data = (document.getElementById('data') as HTMLInputElement).value;
        if (!valor || isNaN(Number(valor)) || !descricao || !data) {
            alert('Preencha todos os campos corretamente.');
            return;
        }
        try {
            if (tipoTransacao === 'transferencia') {
                if (!contaOrigem || !contaDestino || valor <= 0) {
                    alert('Preencha todos os campos corretamente para realizar a transferência.');
                    return;
                }
                await Backend.post('/transfer', {
                    contaOrigem,
                    contaDestino,
                    valor,
                    descricao,
                    data,
                });
                alert('Transferência realizada com sucesso!');
            } else {
                if (!contaOrigem || valor <= 0) {
                    alert('Preencha todos os campos corretamente para realizar a transação.');
                    return;
                }
                await Backend.post('/transacao', {
                    conta: contaOrigem,
                    tipo: tipoTransacao,
                    valor,
                    descricao,
                    data,
                });
                alert('Transação realizada com sucesso!');
            }
            setIsPopupOpen(false);
            setTipoTransacao('');
            setContaOrigem(contaId);
            setContaDestino(undefined);
        } catch (error) {
            console.error('Erro ao realizar a transação:', error);
            alert('Erro ao realizar a transação. Tente novamente.');
        }
    };

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
                        <p className='text-sm text-gray-600'>Tipo da Transação</p>
                        <select
                            id='transacaoTipo'
                            className="text-black border border-gray-300 rounded px-4 py-2 t w-full"
                            defaultValue=""
                            onChange={(e) => setTipoTransacao(e.target.value)}
                        >
                            <option value="" disabled>
                                Selecione um tipo
                            </option>
                            <option value="debito">Débito</option>
                            <option value="credito">Crédito</option>
                            <option value="transferencia">Transferência</option>
                        </select>
                        <p className='text-sm text-gray-600'>Conta de Origem</p>
                        <select
                            id='contaId'
                            className="text-black border border-gray-300 rounded px-4 py-2 t w-full"
                            disabled={!!contaId}
                            defaultValue={contaId || ''}
                            onChange={(e) => setContaOrigem(e.target.value)}
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
                        {tipoTransacao === 'transferencia' && (
                            <>
                                <p className='text-sm text-gray-600'>Conta de Destino</p>
                                <select
                                    id='contaDestinoId'
                                    className="text-black border border-gray-300 rounded px-4 py-2 t w-full"
                                    defaultValue=""
                                    onChange={(e) => setContaDestino(e.target.value)}
                                >
                                    <option value="" disabled>
                                        Selecione uma conta
                                    </option>
                                    {Object.values(contasCache).map((conta) => (
                                        <option key={conta.id} value={conta.id} disabled={conta.id === Number(contaOrigem)}>
                                            {conta.nome}
                                        </option>
                                    ))}
                                </select>
                            </>
                        )}
                        <p className='text-sm text-gray-600'>Valor</p>
                        <input
                            type="text"
                            id="valor"
                            className="text-black border border-gray-300 rounded px-4 py-2 t w-full"
                            onChange={(e) => {
                                const valor = e.target.value.replace(/\D/g, '');
                                const valorFormatado = (Number(valor) / 100).toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                });
                                e.target.value = valorFormatado;
                                console.log('Valor:', valorFormatado);
                            }}
                        />
                        <p className='text-sm text-gray-600'>Descrição</p>
                        <textarea
                            id="descricao"
                            className="text-black border border-gray-300 rounded px-4 py-2 t w-full"
                            rows={3}
                            placeholder="Digite uma descrição para a transação"
                            onChange={(e) => console.log('Descrição:', e.target.value)}
                        ></textarea>
                        <p className='text-sm text-gray-600'>Data</p>
                        <input
                            type="date"
                            id="data"
                            className="text-black border border-gray-300 rounded px-4 py-2 t w-full"
                            onChange={(e) => console.log('Data:', e.target.value)}
                            defaultValue={new Date().toISOString().split('T')[0]}
                        />

                        <button
                            className='mt-4 bg-red-100 text-white px-4 mx-2 py-2 hover:py-10 rounded hover:bg-red-100'
                            onClick={() => setIsPopupOpen(false)}
                        >
                            Cancelar
                        </button>
                        <button
                            className='mt-4 bg-green-500 text-white px-4 mx-2 py-2 hover:py-10 rounded hover:bg-green-100'
                            onClick={() => {handleConfirmarTransacao(); setIsPopupOpen(false)}}
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