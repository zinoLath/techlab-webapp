import React, { useState } from 'react';
import { useEffect } from 'react';
import Backend from '../services/backend.ts';
import type { Conta } from '../services/types.ts';
import { TipoConta, TipoContaLabels } from '../services/enums.ts';

const Contas: React.FC = () => {
    const [mensagem, setMensagem] = useState<string>("Carregando...");
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
    const handleEditarConfirmar = (id: number) => {
        const nome = (document.getElementById('edit-nome') as HTMLInputElement).value;
        const tipo = (document.getElementById('edit-tipo') as HTMLSelectElement).value;
        const saldo = parseFloat((document.getElementById('edit-saldo') as HTMLInputElement).value);
        if (!nome || isNaN(saldo)) {
            alert('Preencha todos os campos corretamente.');
            return;
        }
        const contaAtualizada: Conta = {
            id,
            nome,
            tipo: parseInt(tipo),
            saldo,
        };
        Backend.put(`/conta/${id}`, contaAtualizada)
            .then(() => {
                setContas((prevContas) =>
                    prevContas.map((conta) => (conta.id === id ? contaAtualizada : conta))
                );
                setEdicao(null);
                setMensagem('Conta atualizada com sucesso!');
            }
            )
            .catch((error) => {
                console.error('Erro ao atualizar conta:', error);
                alert('Erro ao atualizar conta');
            }
            );
    };
    const handleEditarCancelar = () => {
        setEdicao(null);
        setMensagem('Edição cancelada.');
    };

    const handleExcluir = (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir esta conta?')) {
            Backend.delete(`/conta/${id}`)
                .then(() => {
                    setContas((prevContas) => prevContas.filter((conta) => conta.id !== id));
                })
                .catch((error) => {
                    console.error('Erro ao excluir conta:', error);
                    alert('Erro ao excluir conta: ' + String(error));
                });
        }
    };
    const [estadoAdicionar, setEstadoAdicionar] = useState(false);

    const handleAdicionar = () => {
        setEstadoAdicionar(true);
        setMostrarContas(true);
        setMensagem('Adicionando nova conta...');
    };
    const handleAdicionarConfirmar = () => {
        const nome = (document.getElementById('add-nome') as HTMLInputElement).value;
        const tipo = (document.getElementById('add-tipo') as HTMLSelectElement).value;
        const saldo = parseFloat((document.getElementById('add-saldo') as HTMLInputElement).value);
        
        if (!nome || isNaN(saldo)) {
            alert('Preencha todos os campos corretamente.');
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
                alert('Erro ao adicionar conta');
            });
    };
    const handleAdicionarCancelar = () => {
        setEstadoAdicionar(false);
        setMensagem('Adição de conta cancelada.');
    };

    return (
        <div>
            <h1>Lista de Contas</h1>
            <button
                onClick={handleAdicionar}
            >
                Adicionar Conta
            </button>
            {!mostrarContas ? (
                <p>{mensagem}</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Tipo</th>
                            <th>Saldo</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(contas.length > 0 || estadoAdicionar) ? (
                            contas.map((conta) => (
                                conta.id != edicao ? (
                                    <tr key={conta.id}>
                                        <td>{conta.id}</td>
                                        <td>{conta.nome}</td>
                                        <td>{TipoContaLabels[conta.tipo]}</td>
                                        <td>R$ {conta.saldo.toFixed(2)}</td>
                                        <td>
                                            <button onClick={() => handleEditar(conta.id)}>Editar</button>
                                            <button onClick={() => handleExcluir(conta.id)}>Excluir</button>
                                        </td>
                                    </tr>
                                ) : (
                                    <tr key={conta.id}>
                                        <td>{conta.id}</td>
                                        <td><input id="edit-nome" placeholder={conta.nome}></input></td>
                                        <td>
                                            <select id="edit-tipo" defaultValue={conta.tipo}>
                                                <option value={TipoConta.Corrente}>Corrente</option>
                                                <option value={TipoConta.Poupanca}>Poupança</option>
                                                <option value={TipoConta.Investimento}>Investimento</option>
                                                <option value={TipoConta.CartaoCredito}>Cartão de Crédito</option>
                                            </select>
                                        </td>
                                        <td> <input id="edit-saldo" placeholder={String(conta.saldo)}></input></td>
                                        <td>
                                            <button onClick={() => handleEditarConfirmar(conta.id)}>Confirmar</button>
                                            <button onClick={() => handleEditarCancelar()}>Cancelar</button>
                                        </td>
                                    </tr>
                                )
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} style={{ textAlign: 'center' }}>
                                    Nenhuma conta encontrada
                                </td>
                            </tr>
                        )}
                        {estadoAdicionar && (
                            <tr key={"novaconta"}>
                                <td></td>
                                <td><input id="add-nome"></input></td>
                                <td>
                                    <select id="add-tipo">
                                        <option value={TipoConta.Corrente}>Corrente</option>
                                        <option value={TipoConta.Poupanca}>Poupança</option>
                                        <option value={TipoConta.Investimento}>Investimento</option>
                                        <option value={TipoConta.CartaoCredito}>Cartão de Crédito</option>
                                    </select>
                                </td>
                                <td> <input id="add-saldo"></input></td>
                                <td>
                                    <button onClick={handleAdicionarConfirmar}>
                                        Confirmar
                                    </button>
                                    <button onClick={handleAdicionarCancelar}>
                                        Cancelar
                                    </button>
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