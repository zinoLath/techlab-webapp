import { StrictMode } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createRoot } from 'react-dom/client'
import './index.css'
import Contas from './contas.tsx'

createRoot(document.getElementById('root')!).render(
  <Router>
    <StrictMode>
      <Routes>
        <Route path="/" element={<Contas />} />
      </Routes>
    </StrictMode>
  </Router>
  ,
)
