import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Transacoes from '../pages/transacoes.tsx';

jest.mock('../services/backend.ts', () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
}));
import Backend from '../services/backend.ts';

describe('Transacoes Page', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders loading message initially', () => {
        render(
            <MemoryRouter>
                <Transacoes />
            </MemoryRouter>
        );
        expect(screen.getByText('Carregando transações...')).toBeInTheDocument();
    });

    test('fetches and displays transactions', async () => {
        const mockTransacoes = [
            {
                id: '1',
                conta: 'Conta 1',
                tipo: 'debito',
                valor: 100,
                data: '2023-10-01',
                descricao: 'Compra de café',
            },
        ];
        (Backend.get as jest.Mock).mockImplementation(() => Promise.resolve({ data: mockTransacoes }));

        render(
            <MemoryRouter>
                <Transacoes />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Compra de café')).toBeInTheDocument();
        });
    });

    test('displays no transactions message when none are found', async () => {
        (Backend.get as jest.Mock).mockImplementation(() => Promise.resolve({ data: [] }));

        render(
            <MemoryRouter>
                <Transacoes />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Nenhuma transação encontrada')).toBeInTheDocument();
        });
    });

    test('handles transaction addition popup', () => {
        render(
            <MemoryRouter>
                <Transacoes />
            </MemoryRouter>
        );

        const addButton = screen.getByText('Adicionar Transação');
        fireEvent.click(addButton);

        expect(screen.getByText('Adição de Transação')).toBeInTheDocument();
    });

    test('validates transaction addition fields', async () => {
        render(
            <MemoryRouter>
                <Transacoes />
            </MemoryRouter>
        );

        const addButton = screen.getByText('Adicionar Transação');
        fireEvent.click(addButton);

        const confirmButton = screen.getByText('Confirmar');
        fireEvent.click(confirmButton);

        await waitFor(() => {
            expect(screen.getByText('Preencha todos os campos corretamente.')).toBeInTheDocument();
        });
    });

    test('filters transactions by account', async () => {
        const mockTransacoes = [
            {
                id: '1',
                conta: 'Conta 1',
                tipo: 'debito',
                valor: 100,
                data: '2023-10-01',
                descricao: 'Compra de café',
            },
        ];
        (Backend.get as jest.Mock).mockImplementation(() => Promise.resolve({ data: mockTransacoes }));

        render(
            <MemoryRouter>
                <Transacoes />
            </MemoryRouter>
        );

        const accountFilter = screen.getByLabelText('Conta:');
        fireEvent.change(accountFilter, { target: { value: 'Conta 1' } });

        await waitFor(() => {
            expect(screen.getByText('Compra de café')).toBeInTheDocument();
        });
    });
});