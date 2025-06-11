import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Disciplinas() {
  const [disciplinas, setDisciplinas] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [ordenacao, setOrdenacao] = useState({ campo: 'nome', direcao: 'asc' });

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
      disciplina.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      disciplina.codigo.toLowerCase().includes(filtro.toLowerCase()) ||
      disciplina.periodo.toLowerCase().includes(filtro.toLowerCase()) ||
      getNomeProfessor(disciplina.professorId).toLowerCase().includes(filtro.toLowerCase())
    );
  };

  const ordenarDisciplinas = (disciplinasFiltradas) => {
    return [...disciplinasFiltradas].sort((a, b) => {
      let valorA = a[ordenacao.campo];
      let valorB = b[ordenacao.campo];
      
      if (ordenacao.campo === 'professorId') {
        valorA = getNomeProfessor(a.professorId);
        valorB = getNomeProfessor(b.professorId);
      }
      
      if (typeof valorA === 'string') {
        valorA = valorA.toLowerCase();
        valorB = valorB.toLowerCase();
      }
      
      if (ordenacao.direcao === 'asc') {
        return valorA > valorB ? 1 : -1;
      } else {
        return valorA < valorB ? 1 : -1;
      }
    });
  };

  const handleOrdenacao = (campo) => {
    setOrdenacao(prev => ({
      campo,
      direcao: prev.campo === campo && prev.direcao === 'asc' ? 'desc' : 'asc'
    }));
  };

  const editarDisciplina = (id) => {
    window.location.href = `/disciplinas/editar/${id}`;
  };

  const desativarDisciplina = async (id) => {
    if (window.confirm('Tem certeza que deseja desativar esta disciplina?')) {
      try {
        await axios.patch(`${API_URL_DISCIPLINAS}/${id}/status`);
        carregarDisciplinas();
        alert('Disciplina desativada com sucesso!');
      } catch (error) {
        alert('Erro ao desativar disciplina: ' + error.message);
      }
    }
  };

  const disciplinasFiltradas = filtrarDisciplinas();
  const disciplinasOrdenadas = ordenarDisciplinas(disciplinasFiltradas);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Gerenciamento de Disciplinas</h1>
        <div>
          <a href="/disciplinas/novo" className="btn btn-primary me-2">Nova Disciplina</a>
          <a href="/disciplinas/reativar" className="btn btn-success">Reativar</a>
        </div>
      </div>
      
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="card-title mb-0">Pesquisar Disciplinas</h5>
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
          <h5 className="card-title mb-0">Lista de Disciplinas Ativas</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleOrdenacao('nome')}
                  >
                    Nome {ordenacao.campo === 'nome' && (ordenacao.direcao === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleOrdenacao('codigo')}
                  >
                    Código {ordenacao.campo === 'codigo' && (ordenacao.direcao === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Período</th>
                  <th>Professor</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {disciplinasOrdenadas
                  .filter(disciplina => disciplina.ativo)
                  .map(disciplina => (
                  <tr key={disciplina.id}>
                    <td>{disciplina.id}</td>
                    <td>{disciplina.nome}</td>
                    <td>{disciplina.codigo}</td>
                    <td>{disciplina.periodo}</td>
                    <td>{getNomeProfessor(disciplina.professorId)}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => editarDisciplina(disciplina.id)}
                      >
                        Alterar
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => desativarDisciplina(disciplina.id)}
                      >
                        Desativar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {disciplinasOrdenadas.filter(disciplina => disciplina.ativo).length === 0 && (
              <div className="text-center py-4">
                <p>Nenhuma disciplina encontrada.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Disciplinas; 