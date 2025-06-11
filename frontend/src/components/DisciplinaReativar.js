import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function DisciplinaReativar() {
  const [disciplinas, setDisciplinas] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [filtro, setFiltro] = useState('');
  const navigate = useNavigate();

  const API_URL_DISCIPLINAS = 'http://localhost:3001/disciplinas';
  const API_URL_PROFESSORES = 'http://localhost:3001/professores';

  useEffect(() => {
    carregarDisciplinas();
    carregarProfessores();
  }, []);

  const carregarDisciplinas = async () => {
    try {
      const response = await axios.get(API_URL_DISCIPLINAS);
      setDisciplinas(response.data);
    } catch (error) {
      alert('Erro ao carregar disciplinas: ' + error.message);
    }
  };

  const carregarProfessores = async () => {
    try {
      const response = await axios.get(API_URL_PROFESSORES);
      setProfessores(response.data);
    } catch (error) {
      alert('Erro ao carregar professores: ' + error.message);
    }
  };

  const getNomeProfessor = (professorId) => {
    const professor = professores.find(p => p.id === professorId);
    return professor ? professor.nome : 'N/A';
  };

  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
  };

  const filtrarDisciplinas = () => {
    return disciplinas.filter(disciplina =>
      !disciplina.ativo && (
        disciplina.nome.toLowerCase().includes(filtro.toLowerCase()) ||
        disciplina.codigo.toLowerCase().includes(filtro.toLowerCase()) ||
        disciplina.periodo.toLowerCase().includes(filtro.toLowerCase()) ||
        getNomeProfessor(disciplina.professorId).toLowerCase().includes(filtro.toLowerCase())
      )
    );
  };

  const reativarDisciplina = async (id, nome) => {
    if (window.confirm(`Tem certeza que deseja reativar a disciplina ${nome}?`)) {
      try {
        await axios.patch(`${API_URL_DISCIPLINAS}/${id}/status`);
        carregarDisciplinas();
        alert('Disciplina reativada com sucesso!');
      } catch (error) {
        alert('Erro ao reativar disciplina: ' + error.message);
      }
    }
  };

  const disciplinasFiltradas = filtrarDisciplinas();

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Reativar Disciplinas</h1>
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/disciplinas')}
        >
          Voltar
        </button>
      </div>
      
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="card-title mb-0">Pesquisar Disciplinas Inativas</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Pesquisar por nome, código, período ou professor..."
                value={filtro}
                onChange={handleFiltroChange}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">Disciplinas Inativas</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Código</th>
                  <th>Período</th>
                  <th>Professor</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {disciplinasFiltradas.map(disciplina => (
                  <tr key={disciplina.id}>
                    <td>{disciplina.id}</td>
                    <td>{disciplina.nome}</td>
                    <td>{disciplina.codigo}</td>
                    <td>{disciplina.periodo}</td>
                    <td>{getNomeProfessor(disciplina.professorId)}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => reativarDisciplina(disciplina.id, disciplina.nome)}
                      >
                        Reativar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {disciplinasFiltradas.length === 0 && (
              <div className="text-center py-4">
                <p>Nenhuma disciplina inativa encontrada.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DisciplinaReativar; 