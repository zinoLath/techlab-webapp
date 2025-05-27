import { StrictMode } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createRoot } from 'react-dom/client'
import './index.css'
import Contas from './pages/contas.tsx'
import Transacoes from './pages/transacoes.tsx'

createRoot(document.getElementById('root')!).render(
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
  ,
)
