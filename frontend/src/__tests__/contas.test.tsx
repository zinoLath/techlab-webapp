import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Contas from '../pages/contas';

jest.mock('../services/backend.ts', () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
}));
import Backend from '../services/backend.ts';

describe('Contas Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders loading message initially', () => {
        render(<Contas />);
        expect(screen.getByText('Carregando contas...')).toBeInTheDocument();
    });

    test('renders "Nenhuma conta encontrada" when no accounts are returned', async () => {
        (Backend.get as jest.Mock).mockResolvedValueOnce(Promise.resolve({ data: [] }));
        render(<Contas />);
        await waitFor(() => {
            expect(screen.getByText('Nenhuma conta encontrada')).toBeInTheDocument();
        });
    });

    test('renders accounts table when accounts are fetched', async () => {
        const mockAccounts = [
            { id: 1, nome: 'Conta 1', tipo: 0, saldo: 10000 },
            { id: 2, nome: 'Conta 2', tipo: 1, saldo: 20000 },
        ];
        (Backend.get as jest.Mock).mockResolvedValueOnce({ data: mockAccounts });
        render(<Contas />);
        await waitFor(() => {
            expect(screen.getByText('Conta 1')).toBeInTheDocument();
            expect(screen.getByText('Conta 2')).toBeInTheDocument();
        });
    });

    test('handles account addition', async () => {
        const mockAccounts = { id: 3, nome: 'Conta Nova', tipo: 0, saldo: 5000 };
        (Backend.post as jest.Mock).mockResolvedValueOnce(Promise.resolve({ data: mockAccounts }));
        render(<Contas />);
        fireEvent.click(screen.getByText('Adicionar Conta'));
        const nomeInput = screen.getByLabelText('Nome:');
        const tipoSelect = screen.getByLabelText('Tipo:');
        const saldoInput = screen.getByLabelText('Saldo:');
        fireEvent.change(nomeInput, { target: { value: 'Conta Nova' } });
        fireEvent.change(tipoSelect, { target: { value: '0' } });
        fireEvent.change(saldoInput, { target: { value: '50,00' } });
        fireEvent.click(screen.getByText('Confirmar'));
        await waitFor(() => {
            expect(screen.getByText('Conta Nova')).toBeInTheDocument();
        });
    });

    test('handles account editing', async () => {
        const mockAccounts = [{ id: 1, nome: 'Conta 1', tipo: 0, saldo: 10000 }];
        (Backend.get as jest.Mock).mockResolvedValueOnce(Promise.resolve({ data: mockAccounts }));
        (Backend.put as jest.Mock).mockResolvedValueOnce({});
        render(<Contas />);
        await waitFor(() => {
            fireEvent.click(screen.getByText('Editar'));
        });
        const nomeInput = screen.getByLabelText('Nome:');
        fireEvent.change(nomeInput, { target: { value: 'Conta Editada' } });
        fireEvent.click(screen.getByText('Confirmar'));
        await waitFor(() => {
            expect(screen.getByText('Conta Editada')).toBeInTheDocument();
        });
    });

    test('handles account deletion', async () => {
        const mockAccounts = [{ id: 1, nome: 'Conta 1', tipo: 0, saldo: 10000 }];
        (Backend.get as jest.Mock).mockResolvedValueOnce(Promise.resolve({ data: mockAccounts }));
        (Backend.delete as jest.Mock).mockResolvedValueOnce({});
        render(<Contas />);
        await waitFor(() => {
            fireEvent.click(screen.getByText('Excluir'));
        });
        await waitFor(() => {
            expect(screen.queryByText('Conta 1')).not.toBeInTheDocument();
        });
    });

    test('displays error message when fetching accounts fails', async () => {
        (Backend.get as jest.Mock).mockRejectedValueOnce(new Error('Erro ao carregar contas'));
        render(<Contas />);
        await waitFor(() => {
            expect(screen.getByText('Erro ao carregar contas: Error: Erro ao carregar contas')).toBeInTheDocument();
        });
    });
});