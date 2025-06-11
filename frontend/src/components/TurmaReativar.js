import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function TurmaReativar() {
  const [turmas, setTurmas] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [locais, setLocais] = useState([]);
  const [filtro, setFiltro] = useState('');
  const navigate = useNavigate();

  const API_URL_TURMAS = 'http://localhost:3001/turmas';
  const API_URL_DISCIPLINAS = 'http://localhost:3001/disciplinas';
  const API_URL_LOCAIS = 'http://localhost:3001/locais';

  useEffect(() => {
    carregarTurmas();
    carregarDisciplinas();
    carregarLocais();
  }, []);

  const carregarTurmas = async () => {
    try {
      const response = await axios.get(API_URL_TURMAS);
      setTurmas(response.data);
    } catch (error) {
      alert('Erro ao carregar turmas: ' + error.message);
    }
  };

  const carregarDisciplinas = async () => {
    try {
      const response = await axios.get(API_URL_DISCIPLINAS);
      setDisciplinas(response.data);
    } catch (error) {
      alert('Erro ao carregar disciplinas: ' + error.message);
    }
  };

  const carregarLocais = async () => {
    try {
      const response = await axios.get(API_URL_LOCAIS);
      setLocais(response.data);
    } catch (error) {
      alert('Erro ao carregar locais: ' + error.message);
    }
  };

  const getNomeDisciplina = (disciplinaId) => {
    const disciplina = disciplinas.find(d => d.id === disciplinaId);
    return disciplina ? disciplina.nome : 'N/A';
  };

  const getNomeLocal = (localId) => {
    const local = locais.find(l => l.id === localId);
    return local ? local.nome : 'N/A';
  };

  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
  };

  const filtrarTurmas = () => {
    return turmas.filter(turma =>
      !turma.ativo && (
        turma.nome.toLowerCase().includes(filtro.toLowerCase()) ||
        turma.diaSemana.toLowerCase().includes(filtro.toLowerCase()) ||
        getNomeDisciplina(turma.disciplinaId).toLowerCase().includes(filtro.toLowerCase()) ||
        getNomeLocal(turma.localId).toLowerCase().includes(filtro.toLowerCase())
      )
    );
  };

  const reativarTurma = async (id, nome) => {
    if (window.confirm(`Tem certeza que deseja reativar a turma ${nome}?`)) {
      try {
        await axios.patch(`${API_URL_TURMAS}/${id}/status`);
        carregarTurmas();
        alert('Turma reativada com sucesso!');
      } catch (error) {
        alert('Erro ao reativar turma: ' + error.message);
      }
    }
  };

  const turmasFiltradas = filtrarTurmas();

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Reativar Turmas</h1>
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/turmas')}
        >
          Voltar
        </button>
      </div>
      
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="card-title mb-0">Pesquisar Turmas Inativas</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Pesquisar por nome, dia da semana, disciplina ou local..."
                value={filtro}
                onChange={handleFiltroChange}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">Turmas Inativas</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Dia da Semana</th>
                  <th>Horário</th>
                  <th>Disciplina</th>
                  <th>Local</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {turmasFiltradas.map(turma => (
                  <tr key={turma.id}>
                    <td>{turma.id}</td>
                    <td>{turma.nome}</td>
                    <td>{turma.diaSemana}</td>
                    <td>{turma.horarioInicio} - {turma.horarioTermino}</td>
                    <td>{getNomeDisciplina(turma.disciplinaId)}</td>
                    <td>{getNomeLocal(turma.localId)}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => reativarTurma(turma.id, turma.nome)}
                      >
                        Reativar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {turmasFiltradas.length === 0 && (
              <div className="text-center py-4">
                <p>Nenhuma turma inativa encontrada.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TurmaReativar; 