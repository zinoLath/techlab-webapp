import React, { useState } from 'react';
import { useEffect } from 'react';
import Backend from '../services/backend.ts';
import type { Conta } from '../services/types.ts';
import { TipoConta, TipoContaLabels } from '../services/enums.ts';

const FormularioConta: React.FC<{
    mensagem: string;
    onConfirmar: (nome:string, tipo:string, saldo:number) => void;
    onCancelar: () => void;
    defaultConta?: Conta;
}> = ({ mensagem, onConfirmar, onCancelar, defaultConta }) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const nome = form.nome.value;
        const tipo = form.tipo.value;
        const saldo = parseFloat(form.saldo.value.replace(/\D/g, '')) * 100; // Converte para centavos
        onConfirmar(nome, tipo, saldo);   
    }
    return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        { mensagem && <p className="text-white">{mensagem}</p> }
        <label>
            Nome:
            <input name="nome" defaultValue={defaultConta ? defaultConta.nome : ""} className="bg-gray-800 p-1 mx-5 roundedl" />
        </label>
        <label>
            Tipo:
            <select name="tipo" defaultValue={defaultConta ? defaultConta.tipo : ""} className="bg-gray-800 p-2 mx-5 rounded">
                <option value={TipoConta.Corrente}>Corrente</option>
                <option value={TipoConta.Poupanca}>Poupança</option>
                <option value={TipoConta.Investimento}>Investimento</option>
                <option value={TipoConta.CartaoCredito}>Cartão de Crédito</option>
            </select>
        </label>
        <label>
            Saldo: 
            <input 
                name="saldo" 
                defaultValue={(Number(defaultConta ? defaultConta.saldo : "0") / 100).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                })}
                className="bg-gray-800 p-1 mx-5 rounded" 
                onChange={(e) => {
                    const valor = e.target.value.replace(/\D/g, '');
                    const valorFormatado = (Number(valor) / 100).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                    });
                    e.target.value = valorFormatado;
                }}
            />
        </label>
        <div className="flex justify-center gap-2">
            <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                Confirmar
            </button>
            <button type="button" onClick={() => onCancelar()} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                Cancelar
            </button>
        </div>
    </form>);
}

const Contas: React.FC = () => {
    const [mensagem, setMensagem] = useState<string>("Carregando...");
    const [mensagemEditar, setMensagemEditar] = useState<string>("");
    const [mensagemAdicionar, setMensagemAdicionar] = useState<string>("");
    const [mostrarContas, setMostrarContas] = useState(false);
    const [contas, setContas] = useState<Conta[]>([]);
    useEffect(() => {
        setMostrarContas(false);
        setMensagem('Carregando contas...');
        const fetchContas = async () => {
            try {
                const response = await Backend.get('/conta');
                const data = await response.data;
                if (!Array.isArray(data)) {
                    throw new Error('Formato de dados inválido');
                }
                if (data.length === 0) {
                    setMensagem('Nenhuma conta encontrada');
                    return;
                }
                setContas(data);
                setMostrarContas(true);
                setMensagem('');
            } catch (error) {
                setMensagem('Erro ao carregar contas: ' + String(error));
                console.error(error);
            }
        };

        fetchContas();
    }, []);

    const [edicao, setEdicao] = useState<number | null>(null);
    const handleEditar = (id: number) => {
        setEdicao(id);
    };
    const handleEditarConfirmar = (id:number, nome: string, tipo: string, saldo: number) => {
        if (!nome || isNaN(saldo)) {
            setMensagemEditar('Preencha todos os campos corretamente.');
            return;
        }
        const contaAtualizada: Conta = {
            id,
            nome,
            tipo: parseInt(tipo),
            saldo,
        };
        console.log('Atualizando conta:', contaAtualizada);
        setMensagemEditar('Atualizando conta...');
        Backend.put(`/conta/${id}`, contaAtualizada)
            .then(() => {
                setContas((prevContas) =>
                    prevContas.map((conta) => (conta.id === id ? contaAtualizada : conta))
                );
                setEdicao(null);
                setMensagemEditar('');
            }
            )
            .catch((error) => {
                console.error('Erro ao atualizar conta:', error);
                setMensagemEditar('Erro ao atualizar conta');
            }
            );
    };
    const handleEditarCancelar = () => {
        setEdicao(null);
    };

    const handleExcluir = (id: number) => {
        Backend.delete(`/conta/${id}`)
                .then(() => {
                    setContas((prevContas) => prevContas.filter((conta) => conta.id !== id));
                })
                .catch((error) => {
                    console.error('Erro ao excluir conta:', error);
                    setMensagem('Erro ao excluir conta: ' + String(error));
                });
    };
    const [estadoAdicionar, setEstadoAdicionar] = useState(false);

    const handleAdicionar = () => {
        setEstadoAdicionar(true);
        setMostrarContas(true);
        setMensagem('Adicionando nova conta...');
    };
    const handleAdicionarConfirmar = (nome: string, tipo: string, saldo: number) => {
        if (!nome || isNaN(saldo)) {
            setMensagemAdicionar('Preencha todos os campos corretamente.');
            return;
        }

        const novaConta: Conta = {
            id: 0,
            nome,
            tipo: parseInt(tipo),
            saldo,
        };

        Backend.post('/conta', novaConta)
            .then((response) => {
                setContas((prevContas) => [...prevContas, response.data]);
                setEstadoAdicionar(false);
                setMensagem('Conta adicionada com sucesso!');
            })
            .catch((error) => {
                console.error('Erro ao adicionar conta:', error);
                setMensagemAdicionar('Erro ao adicionar conta');
            });
    };
    const handleAdicionarCancelar = () => {
        setEstadoAdicionar(false);
        setMensagem('');
    };

    return (
        <div className='mx-1 md:mx-4 lg:mx-8 xl:mx-16'>
            <h1 className='text-center text-5xl font-bold p-8'>Lista de Contas</h1>
            <button
                onClick={handleAdicionar}
                disabled={estadoAdicionar || edicao !== null}
                className="block mx-auto mb-5 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-700 disabled:opacity-50"
            >
                Adicionar Conta
            </button>
            {mensagem && <p className='text-center text-white'>{mensagem}</p>}
            {mostrarContas && (
                <table className='border-collapse border-1 m-auto bg-gray-900 w-full'>
                    <thead>
                        <tr>
                            <th className='w-15 text-center'>ID</th>
                            <th className='w-50'>Nome</th>
                            <th className='w-35'>Tipo</th>
                            <th className='w-32 truncate'>Saldo</th>
                            <th className='w-32 md:w-85'>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(contas.length > 0 || estadoAdicionar) ? (
                            contas.map((conta) => (
                                conta.id != edicao ? (
                                    <tr key={conta.id} className='even:bg-gray-800 odd:bg-gray-700'>
                                        <td className='text-center'>{conta.id}</td>
                                        <td className='text-wrap text-center'>{conta.nome}</td>
                                        <td className='text-center'>{TipoContaLabels[conta.tipo]}</td>
                                        <td className='truncate'>{(Number(conta.saldo) / 100).toLocaleString('pt-BR', {
                                                            style: 'currency',
                                                            currency: 'BRL',
                                                        })}</td>
                                        <td className='flex justify-center gap-2 flex-col md:flex-row m-1'>
                                            <button 
                                                onClick={() => handleEditar(conta.id)}
                                                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-500 disabled:bg-yellow-600 disabled:opacity-50"
                                                disabled={edicao !== null || estadoAdicionar}
                                            >
                                                Editar
                                            </button>
                                            <button 
                                                onClick={() => handleExcluir(conta.id)}
                                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 disabled:bg-red-600 disabled:opacity-50"
                                                disabled={edicao !== null || estadoAdicionar}
                                            >
                                                Excluir
                                            </button>
                                        </td>
                                    </tr>
                                ) : ( 
                                    <tr key={conta.id} className="bg-gray-650 text-center">
                                        <td colSpan={5} className="p-4">
                                            <FormularioConta 
                                                mensagem={mensagemEditar} 
                                                onConfirmar={(nome, tipo, saldo) => handleEditarConfirmar(conta.id, nome, tipo, saldo)} 
                                                onCancelar={handleEditarCancelar} 
                                                defaultConta={conta} 
                                            />
                                        </td>
                                    </tr>
                                )
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center' }}>
                                    Nenhuma conta encontrada
                                </td>
                            </tr>
                        )}
                        {estadoAdicionar && (
                            <tr key={"nova-conta"} className="bg-gray-650 text-center">
                                <td colSpan={5} className="p-4">
                                    <FormularioConta 
                                        mensagem={mensagemAdicionar} 
                                        onConfirmar={handleAdicionarConfirmar} 
                                        onCancelar={handleAdicionarCancelar} 
                                    />
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Contas;