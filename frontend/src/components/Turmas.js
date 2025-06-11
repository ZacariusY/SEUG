import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Turmas() {
  const [turmas, setTurmas] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [locais, setLocais] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [ordenacao, setOrdenacao] = useState({ campo: 'nome', direcao: 'asc' });

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
      turma.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      turma.diaSemana.toLowerCase().includes(filtro.toLowerCase()) ||
      getNomeDisciplina(turma.disciplinaId).toLowerCase().includes(filtro.toLowerCase()) ||
      getNomeLocal(turma.localId).toLowerCase().includes(filtro.toLowerCase())
    );
  };

  const ordenarTurmas = (turmasFiltradas) => {
    return [...turmasFiltradas].sort((a, b) => {
      let valorA = a[ordenacao.campo];
      let valorB = b[ordenacao.campo];
      
      if (ordenacao.campo === 'disciplinaId') {
        valorA = getNomeDisciplina(a.disciplinaId);
        valorB = getNomeDisciplina(b.disciplinaId);
      } else if (ordenacao.campo === 'localId') {
        valorA = getNomeLocal(a.localId);
        valorB = getNomeLocal(b.localId);
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

  const editarTurma = (id) => {
    window.location.href = `/turmas/editar/${id}`;
  };

  const desativarTurma = async (id) => {
    if (window.confirm('Tem certeza que deseja desativar esta turma?')) {
      try {
        await axios.patch(`${API_URL_TURMAS}/${id}/status`);
        carregarTurmas();
        alert('Turma desativada com sucesso!');
      } catch (error) {
        alert('Erro ao desativar turma: ' + error.message);
      }
    }
  };

  const turmasFiltradas = filtrarTurmas();
  const turmasOrdenadas = ordenarTurmas(turmasFiltradas);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Gerenciamento de Turmas</h1>
        <div>
          <a href="/turmas/novo" className="btn btn-primary me-2">Nova Turma</a>
          <a href="/turmas/reativar" className="btn btn-success">Reativar</a>
        </div>
      </div>
      
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="card-title mb-0">Pesquisar Turmas</h5>
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
          <h5 className="card-title mb-0">Lista de Turmas Ativas</h5>
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
                    onClick={() => handleOrdenacao('diaSemana')}
                  >
                    Dia da Semana {ordenacao.campo === 'diaSemana' && (ordenacao.direcao === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Horário</th>
                  <th>Disciplina</th>
                  <th>Local</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {turmasOrdenadas
                  .filter(turma => turma.ativo)
                  .map(turma => (
                  <tr key={turma.id}>
                    <td>{turma.id}</td>
                    <td>{turma.nome}</td>
                    <td>{turma.diaSemana}</td>
                    <td>{turma.horarioInicio} - {turma.horarioTermino}</td>
                    <td>{getNomeDisciplina(turma.disciplinaId)}</td>
                    <td>{getNomeLocal(turma.localId)}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => editarTurma(turma.id)}
                      >
                        Alterar
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => desativarTurma(turma.id)}
                      >
                        Desativar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {turmasOrdenadas.filter(turma => turma.ativo).length === 0 && (
              <div className="text-center py-4">
                <p>Nenhuma turma encontrada.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Turmas; 