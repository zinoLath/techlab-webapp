import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Backend from '../services/backend.ts';
import type { Transacao, Conta } from '../services/types.ts';
import { TipoTransacao, TipoTransacaoLabels } from '../services/enums.ts';

const Transacoes: React.FC = () => {
    const { contaId } = useParams<{ contaId?: string }>();
    const [mensagem, setMensagem] = useState<string>('Carregando...');
    const [transacoes, setTransacoes] = useState<Transacao[]>([]);
    const [mostrarTransacoes, setMostrarTransacoes] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [contaOrigem, setContaOrigem] = useState<string | undefined>(contaId);
    const [contaDestino, setContaDestino] = useState<string | undefined>(undefined);
    const [tipoTransacao, setTipoTransacao] = useState<string>('');
    const [filtroConta, setFiltroConta] = useState<string | undefined>(contaId);
    const [filtroTipo, setFiltroTipo] = useState<string | undefined>(undefined);
    const [filtroDataInicio, setFiltroDataInicio] = useState<Date | undefined>(undefined);
    const [filtroDataFim, setFiltroDataFim] = useState<Date | undefined>(undefined);


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
    
    const carregarTransacoes = async () => {
        setMostrarTransacoes(false);
        setMensagem('Carregando transações...');
        const fetchTransacoes = async () => {
            try {
                const endpoint = '/transacao'
                const params = new URLSearchParams();
                if (filtroConta) {
                    params.append('conta', filtroConta);
                }
                if (filtroTipo) {
                    params.append('tipo', filtroTipo);
                }
                if (filtroDataInicio) {
                    params.append('dataInicio', filtroDataInicio.toISOString());
                }
                if (filtroDataFim) {
                    params.append('dataFim', filtroDataFim.toISOString());
                }
                const response = await Backend.get(endpoint, {
                    params: params,
                });
                const data = await response.data;
                if (!Array.isArray(data)) {
                    throw new Error('Formato de dados inválido');
                }
                if (data.length === 0) {
                    setMensagem('Nenhuma transação encontrada');
                    return;
                }
                setTransacoes(data);
                setMostrarTransacoes(true);
                setMensagem('');
            } catch (error) {
                setMensagem('Erro ao carregar transações: ' + String(error));
                console.error(error);
            }
        };

        fetchTransacoes();
    }    
    useEffect(() => {
        carregarTransacoes();
    }
    , [filtroConta, filtroTipo, filtroDataInicio, filtroDataFim, contasCache]);
    
    

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
                await Backend.post('/transacao/transferir', {
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
        <div className='mx-1 md:mx-4 lg:mx-8 xl:mx-16'>
            <h1  className='text-center text-5xl font-bold p-8 pb-1'>Transações</h1>
            <div className='relative text-center my-2'>
                <button
                    className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 my-2 disabled:bg-blue-700 disabled:opacity-50'
                    onClick={() => setIsPopupOpen(!isPopupOpen)}
                    disabled={isPopupOpen}
                >
                    Adicionar Transação
                </button>
                {isPopupOpen && (
                    <div className='absolute text-center top-19 left-1/2 transform -translate-x-1/2 mx-auto bg-white border border-gray-300 shadow-lg rounded p-4 w-1/1 md:w-3/4
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
                            }}
                        />
                        <p className='text-sm text-gray-600'>Descrição</p>
                        <textarea
                            id="descricao"
                            className="text-black border border-gray-300 rounded px-4 py-2 t w-full"
                            rows={3}
                            placeholder="Digite uma descrição para a transação"
                        ></textarea>
                        <p className='text-sm text-gray-600'>Data</p>
                        <input
                            type="date"
                            id="data"
                            className="text-black border border-gray-300 rounded px-4 py-2 t w-full"
                            defaultValue={new Date().toISOString().split('T')[0]}
                        />

                        <button
                            className='mt-4 bg-red-500 text-white px-4 mx-2 py-2 rounded hover:bg-red-700'
                            onClick={() => setIsPopupOpen(false)}
                        >
                            Cancelar
                        </button>
                        <button
                            className='mt-4 bg-green-500 text-white px-4 mx-2 py-2 rounded hover:bg-green-700'
                            onClick={() => {handleConfirmarTransacao(); setIsPopupOpen(false)}}
                        >
                            Confirmar
                        </button>
                    </div>
                )}
            </div>
            <div>
                <h2 className='text-center text-2xl font-bold mb-4'>Filtros de Transações</h2>
                <div className='flex flex-col md:flex-row justify-center items-center gap-4 mb-4'>
                    <label>
                        Conta:
                        <select
                            className="border border-gray-300 rounded px-4 py-2 t w-full md:w-auto ml-1"
                            value={filtroConta || ''}
                            onChange={(e) => {setFiltroConta(e.target.value || undefined); carregarTransacoes()}}
                        >
                            <option value="">Todas as Contas</option>
                            {Object.values(contasCache).map((conta) => (
                                <option key={conta.id} value={conta.id}>
                                    {conta.nome}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Tipo:
                        <select
                            className="border border-gray-300 rounded px-4 py-2 t w-full md:w-auto ml-1"
                            value={filtroTipo || ''}
                            onChange={(e) => {
                                setFiltroTipo(e.target.value || undefined); carregarTransacoes()}
                            }
                        >
                            <option value="">Todos os Tipos</option>
                            <option value={TipoTransacao.Debito}>Débito</option>
                            <option value={TipoTransacao.Credito}>Crédito</option>
                        </select>
                    </label>
                    <label>
                        De: 
                        <input
                            type="date"
                            className=" border border-gray-300 rounded px-4 py-2 t w-full md:w-auto ml-1"
                            placeholder='Data Início'
                            onChange={(e) => {setFiltroDataInicio(e.target.value ? new Date(e.target.value) : undefined); carregarTransacoes()}}
                        />
                    </label>
                    <label>
                        Até:
                        <input
                            type="date"
                            className="border border-gray-300 rounded px-4 py-2 t w-full md:w-auto ml-1"
                            placeholder='Data Início'
                            onChange={(e) => {setFiltroDataFim(e.target.value ? new Date(e.target.value) : undefined); carregarTransacoes()}}
                        />
                    </label>
                </div>
            </div>
            {!mostrarTransacoes ? (
                <p>{mensagem}</p>
            ) : (
                <table className='border-2 m-auto w-full border-spacing-10 rounded'>
                    <thead className=' bg-gray-900 text-white'>
                        <tr>
                            <th className='mx-5 border-1'>ID</th>
                            <th className='mx-5 border-1 max-w-fit'>Conta</th>
                            <th className='mx-5 border-1'>Tipo</th>
                            <th className='mx-5 border-1'>Valor</th>
                            <th className='mx-5 border-1'>Data</th>
                            <th className='mx-5 border-1'>Descrição</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transacoes.length > 0 ? (
                            transacoes.map((transacao) => (
                                <tr key={transacao.id} className='even:bg-gray-800 odd:bg-gray-700'>
                                    <td className='text-center border-1 px-2'>{transacao.id}</td>
                                    <td className='text-wrap border-1 px-2 max-w-fit'>{transacao.conta.nome}</td>
                                    <td className='text-center border-1 px-2'>{TipoTransacaoLabels[Number(transacao.tipo)]}</td>
                                    <td className='border-1 px-2'>R$ {transacao.valor.toFixed(2)}</td>
                                    <td className='text-center border-1 px-2'>{new Date(transacao.data).toLocaleDateString()}</td>
                                    <td className='text-wrap border-1 px-2'>{transacao.descricao}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className='text-center'>
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