import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function TurmaAlunos() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [turma, setTurma] = useState(null);
  const [alunosTurma, setAlunosTurma] = useState([]);
  const [todosAlunos, setTodosAlunos] = useState([]);
  const [alunosSelecionados, setAlunosSelecionados] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const API_URL_TURMAS = 'http://localhost:3001/api/turmas';
  const API_URL_ALUNOS = 'http://localhost:3001/api/alunos';

  useEffect(() => {
    carregarDadosTurma();
    carregarAlunosTurma();
    carregarTodosAlunos();
  }, [id]);

  const carregarDadosTurma = async () => {
    try {
      const response = await axios.get(`${API_URL_TURMAS}/${id}`);
      setTurma(response.data);
    } catch (error) {
      alert('Erro ao carregar dados da turma: ' + error.message);
      navigate('/turmas');
    }
  };

  const carregarAlunosTurma = async () => {
    try {
      const response = await axios.get(`${API_URL_TURMAS}/${id}/alunos`);
      setAlunosTurma(response.data);
    } catch (error) {
      alert('Erro ao carregar alunos da turma: ' + error.message);
    }
  };

  const carregarTodosAlunos = async () => {
    try {
      const response = await axios.get(API_URL_ALUNOS);
      setTodosAlunos(response.data.filter(aluno => aluno.ativo));
    } catch (error) {
      alert('Erro ao carregar alunos: ' + error.message);
    }
  };

  const getAlunosDisponiveis = () => {
    const idsAlunosTurma = alunosTurma.map(aluno => aluno.id);
    return todosAlunos.filter(aluno => !idsAlunosTurma.includes(aluno.id));
  };

  const handleSelecionarAluno = (alunoId) => {
    setAlunosSelecionados(prev => {
      if (prev.includes(alunoId)) {
        return prev.filter(id => id !== alunoId);
      } else {
        return [...prev, alunoId];
      }
    });
  };

  const adicionarAlunos = async () => {
    if (alunosSelecionados.length === 0) {
      alert('Selecione pelo menos um aluno para adicionar.');
      return;
    }

    setCarregando(true);
    try {
      for (const alunoId of alunosSelecionados) {
        await axios.post(`${API_URL_TURMAS}/${id}/alunos`, { alunoId });
      }
      
      alert(`${alunosSelecionados.length} aluno(s) adicionado(s) com sucesso!`);
      setAlunosSelecionados([]);
      setMostrarModal(false);
      carregarAlunosTurma();
    } catch (error) {
      alert('Erro ao adicionar alunos: ' + error.message);
    } finally {
      setCarregando(false);
    }
  };

  const removerAluno = async (alunoId, nomeAluno) => {
    if (window.confirm(`Tem certeza que deseja remover ${nomeAluno} desta turma?`)) {
      try {
        await axios.delete(`${API_URL_TURMAS}/${id}/alunos/${alunoId}`);
        alert('Aluno removido da turma com sucesso!');
        carregarAlunosTurma();
      } catch (error) {
        alert('Erro ao remover aluno: ' + error.message);
      }
    }
  };

  if (!turma) {
    return <div className="container mt-4"><p>Carregando...</p></div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Alunos da Turma: {turma.nome}</h1>
        <div>
          <button
            className="btn btn-primary me-2"
            onClick={() => setMostrarModal(true)}
          >
            Adicionar Alunos
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/turmas')}
          >
            Voltar para Turmas
          </button>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <h5 className="card-title mb-0">
            Informações da Turma
          </h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <p><strong>Nome:</strong> {turma.nome}</p>
              <p><strong>Dia da Semana:</strong> {turma.diaSemana}</p>
            </div>
            <div className="col-md-6">
              <p><strong>Horário:</strong> {turma.horarioInicio} - {turma.horarioTermino}</p>
              <p><strong>Total de Alunos:</strong> {alunosTurma.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">Alunos Matriculados</h5>
        </div>
        <div className="card-body">
          {alunosTurma.length === 0 ? (
            <div className="text-center py-4">
              <p>Nenhum aluno matriculado nesta turma.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Telefone</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {alunosTurma.map(aluno => (
                    <tr key={aluno.id}>
                      <td>{aluno.id}</td>
                      <td>{aluno.nome}</td>
                      <td>{aluno.email}</td>
                      <td>{aluno.telefone}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => removerAluno(aluno.id, aluno.nome)}
                        >
                          Remover
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal para adicionar alunos */}
      {mostrarModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Adicionar Alunos à Turma</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setMostrarModal(false);
                    setAlunosSelecionados([]);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                {getAlunosDisponiveis().length === 0 ? (
                  <p>Todos os alunos ativos já estão matriculados nesta turma.</p>
                ) : (
                  <>
                    <p>Selecione os alunos que deseja adicionar à turma:</p>
                    <div className="row">
                      {getAlunosDisponiveis().map(aluno => (
                        <div key={aluno.id} className="col-md-6 mb-2">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`aluno-${aluno.id}`}
                              checked={alunosSelecionados.includes(aluno.id)}
                              onChange={() => handleSelecionarAluno(aluno.id)}
                            />
                            <label className="form-check-label" htmlFor={`aluno-${aluno.id}`}>
                              {aluno.nome} ({aluno.email})
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setMostrarModal(false);
                    setAlunosSelecionados([]);
                  }}
                >
                  Cancelar
                </button>
                {getAlunosDisponiveis().length > 0 && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={adicionarAlunos}
                    disabled={carregando || alunosSelecionados.length === 0}
                  >
                    {carregando ? 'Adicionando...' : `Adicionar ${alunosSelecionados.length} Aluno(s)`}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TurmaAlunos; 