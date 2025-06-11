import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Alunos() {
  const [alunos, setAlunos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [ordenacao, setOrdenacao] = useState({ campo: 'nome', direcao: 'asc' });

  const API_URL = 'http://localhost:3001/alunos';

  useEffect(() => {
    carregarAlunos();
  }, []);

  const carregarAlunos = async () => {
    try {
      const response = await axios.get(API_URL);
      setAlunos(response.data);
    } catch (error) {
      alert('Erro ao carregar alunos: ' + error.message);
    }
  };

  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
  };

  const filtrarAlunos = () => {
    return alunos.filter(aluno =>
      aluno.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      aluno.email.toLowerCase().includes(filtro.toLowerCase())
    );
  };

  const ordenarAlunos = (alunosFiltrados) => {
    return [...alunosFiltrados].sort((a, b) => {
      let valorA = a[ordenacao.campo];
      let valorB = b[ordenacao.campo];
      
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

  const editarAluno = (id) => {
    window.location.href = `/alunos/editar/${id}`;
  };

  const desativarAluno = async (id) => {
    if (window.confirm('Tem certeza que deseja desativar este aluno?')) {
      try {
        await axios.patch(`${API_URL}/${id}/status`);
        carregarAlunos();
        alert('Aluno desativado com sucesso!');
      } catch (error) {
        alert('Erro ao desativar aluno: ' + error.message);
      }
    }
  };

  const alunosFiltrados = filtrarAlunos();
  const alunosOrdenados = ordenarAlunos(alunosFiltrados);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Gerenciamento de Alunos</h1>
        <div>
          <a href="/alunos/novo" className="btn btn-primary me-2">Novo Aluno</a>
          <a href="/alunos/reativar" className="btn btn-success">Reativar</a>
        </div>
      </div>
      
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="card-title mb-0">Pesquisar Alunos</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Pesquisar por nome ou email..."
                value={filtro}
                onChange={handleFiltroChange}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">Lista de Alunos Ativos</h5>
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
                    onClick={() => handleOrdenacao('email')}
                  >
                    Email {ordenacao.campo === 'email' && (ordenacao.direcao === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {alunosOrdenados
                  .filter(aluno => aluno.ativo)
                  .map(aluno => (
                  <tr key={aluno.id}>
                    <td>{aluno.id}</td>
                    <td>{aluno.nome}</td>
                    <td>{aluno.email}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => editarAluno(aluno.id)}
                      >
                        Alterar
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => desativarAluno(aluno.id)}
                      >
                        Desativar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {alunosOrdenados.filter(aluno => aluno.ativo).length === 0 && (
              <div className="text-center py-4">
                <p>Nenhum aluno encontrado.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Alunos; 