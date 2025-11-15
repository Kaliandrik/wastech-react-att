import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Dashboard } from './pages/Dashboard'
import { Profile } from './pages/Profile'
import { Ferramentas } from './pages/Ferramentas';
import Home from './pages/Home';
import Login from './pages/login';
import Cadastro from './pages/cadastro';
import RecuperarSenha from './pages/recuperar-senha'; // ← ADICIONE ESTA IMPORT
import './styles/tailwind.css'
import './styles/global.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        {/* Rota raiz agora vai para a Home */}
        <Route path="/" element={<Home />} />
        
        {/* Mantenha suas rotas existentes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/ferramentas" element={<Ferramentas />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} /> {/* ← ADICIONE ESTA ROTA */}
        
        {/* Rota para Home também */}
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  </StrictMode>,
)