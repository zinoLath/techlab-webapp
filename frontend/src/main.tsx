import { StrictMode } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createRoot } from 'react-dom/client'
import './index.css'
import Contas from './pages/contas.tsx'
import Transacoes from './pages/transacoes.tsx'

createRoot(document.getElementById('root')!).render(
  <>
  <header className='text-center bg-gray-800 text-white p-4 border-b-2 border-gray-700'>
    <h1 className='text-5xl font-black mb-5'>Gerenciador de Contas e Transações</h1>
    <nav>
      <ul className="flex m-auto justify-center gap-4 text-2xl">
        <a href="/contas">
          <li className='display-block p-2 w-[10em] bg-green-600 rounded hover:bg-green-700'>
            Contas
          </li>
        </a>
        <a href="/transacoes">
          <li className='display-block p-2 w-[10em] bg-yellow-600 rounded hover:bg-yellow-700'>
            Transações
          </li>
        </a>
      </ul>
    </nav>
  </header>
  <Router>
    <StrictMode>
      <Routes>
        <Route path="/" element={<Contas />} />
        <Route path="/contas" element={<Contas />} />
        <Route path="/transacoes/:contaId" element={<Transacoes />} />
        <Route path="/transacoes" element={<Transacoes />} />
      </Routes>
    </StrictMode>
  </Router>
  </>
  ,
)
