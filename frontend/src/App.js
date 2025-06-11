import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Pesquisa from './components/Pesquisa';
import Alunos from './components/Alunos';
import AlunoForm from './components/AlunoForm';
import AlunoReativar from './components/AlunoReativar';
import Professores from './components/Professores';
import ProfessorForm from './components/ProfessorForm';
import ProfessorReativar from './components/ProfessorReativar';
import Disciplinas from './components/Disciplinas';
import DisciplinaForm from './components/DisciplinaForm';
import DisciplinaReativar from './components/DisciplinaReativar';
import Turmas from './components/Turmas';
import TurmaForm from './components/TurmaForm';
import TurmaReativar from './components/TurmaReativar';
import Locais from './components/Locais';
import LocalForm from './components/LocalForm';
import LocalReativar from './components/LocalReativar';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pesquisa" element={<Pesquisa />} />
            
            {/* Rotas para Alunos */}
            <Route path="/alunos" element={<Alunos />} />
            <Route path="/alunos/novo" element={<AlunoForm />} />
            <Route path="/alunos/editar/:id" element={<AlunoForm />} />
            <Route path="/alunos/reativar" element={<AlunoReativar />} />
            
            {/* Rotas para Professores */}
            <Route path="/professores" element={<Professores />} />
            <Route path="/professores/novo" element={<ProfessorForm />} />
            <Route path="/professores/editar/:id" element={<ProfessorForm />} />
            <Route path="/professores/reativar" element={<ProfessorReativar />} />
            
            {/* Rotas para Disciplinas */}
            <Route path="/disciplinas" element={<Disciplinas />} />
            <Route path="/disciplinas/novo" element={<DisciplinaForm />} />
            <Route path="/disciplinas/editar/:id" element={<DisciplinaForm />} />
            <Route path="/disciplinas/reativar" element={<DisciplinaReativar />} />
            
            {/* Rotas para Turmas */}
            <Route path="/turmas" element={<Turmas />} />
            <Route path="/turmas/novo" element={<TurmaForm />} />
            <Route path="/turmas/editar/:id" element={<TurmaForm />} />
            <Route path="/turmas/reativar" element={<TurmaReativar />} />
            
            {/* Rotas para Locais */}
            <Route path="/locais" element={<Locais />} />
            <Route path="/locais/novo" element={<LocalForm />} />
            <Route path="/locais/editar/:id" element={<LocalForm />} />
            <Route path="/locais/reativar" element={<LocalReativar />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
