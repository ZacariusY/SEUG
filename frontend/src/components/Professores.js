import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Professores() {
  const [professores, setProfessores] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [ordenacao, setOrdenacao] = useState({ campo: 'nome', direcao: 'asc' });

  const API_URL = 'http://localhost:3001/api/professores';

  useEffect(() => {
    carregarProfessores();
  }, []);

  const carregarProfessores = async () => {
    try {
      const response = await axios.get(API_URL);
      setProfessores(response.data);
    } catch (error) {
      alert('Erro ao carregar professores: ' + error.message);
    }
  };

  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
  };

  const filtrarProfessores = () => {
    return professores.filter(professor =>
      professor.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      professor.cpf.includes(filtro) ||
      professor.titulacao.toLowerCase().includes(filtro.toLowerCase()) ||
      professor.departamento.toLowerCase().includes(filtro.toLowerCase())
    );
  };

  const ordenarProfessores = (professoresFiltrados) => {
    return [...professoresFiltrados].sort((a, b) => {
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

  const editarProfessor = (id) => {
    window.location.href = `/professores/editar/${id}`;
  };

  const desativarProfessor = async (id) => {
    if (window.confirm('Tem certeza que deseja desativar este professor?')) {
      try {
        await axios.patch(`${API_URL}/${id}/status`);
        carregarProfessores();
        alert('Professor desativado com sucesso!');
      } catch (error) {
        alert('Erro ao desativar professor: ' + error.message);
      }
    }
  };

  const professoresFiltrados = filtrarProfessores();
  const professoresOrdenados = ordenarProfessores(professoresFiltrados);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Gerenciamento de Professores</h1>
        <div>
          <a href="/professores/novo" className="btn btn-primary me-2">Novo Professor</a>
          <a href="/professores/reativar" className="btn btn-success">Reativar</a>
        </div>
      </div>
      
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="card-title mb-0">Pesquisar Professores</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Pesquisar por nome, CPF, titulação ou departamento..."
                value={filtro}
                onChange={handleFiltroChange}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">Lista de Professores Ativos</h5>
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
                  <th>CPF</th>
                  <th 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleOrdenacao('titulacao')}
                  >
                    Titulação {ordenacao.campo === 'titulacao' && (ordenacao.direcao === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Departamento</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {professoresOrdenados
                  .filter(professor => professor.ativo)
                  .map(professor => (
                  <tr key={professor.id}>
                    <td>{professor.id}</td>
                    <td>{professor.nome}</td>
                    <td>{professor.cpf}</td>
                    <td>{professor.titulacao}</td>
                    <td>{professor.departamento}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => editarProfessor(professor.id)}
                      >
                        Alterar
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => desativarProfessor(professor.id)}
                      >
                        Desativar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {professoresOrdenados.filter(professor => professor.ativo).length === 0 && (
              <div className="text-center py-4">
                <p>Nenhum professor encontrado.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Professores; 