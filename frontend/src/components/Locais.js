import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Locais() {
  const [locais, setLocais] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [ordenacao, setOrdenacao] = useState({ campo: 'nome', direcao: 'asc' });

  const API_URL = 'http://localhost:3001/api/locais';

  useEffect(() => {
    carregarLocais();
  }, []);

  const carregarLocais = async () => {
    try {
      const response = await axios.get(API_URL);
      setLocais(response.data);
    } catch (error) {
      alert('Erro ao carregar locais: ' + error.message);
    }
  };

  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
  };

  const filtrarLocais = () => {
    return locais.filter(local =>
      local.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      local.local.toLowerCase().includes(filtro.toLowerCase()) ||
      local.descricao.toLowerCase().includes(filtro.toLowerCase()) ||
      local.capacidade.toString().includes(filtro)
    );
  };

  const ordenarLocais = (locaisFiltrados) => {
    return [...locaisFiltrados].sort((a, b) => {
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

  const editarLocal = (id) => {
    window.location.href = `/locais/editar/${id}`;
  };

  const desativarLocal = async (id) => {
    if (window.confirm('Tem certeza que deseja desativar este local?')) {
      try {
        await axios.patch(`${API_URL}/${id}/status`);
        carregarLocais();
        alert('Local desativado com sucesso!');
      } catch (error) {
        alert('Erro ao desativar local: ' + error.message);
      }
    }
  };

  const locaisFiltrados = filtrarLocais();
  const locaisOrdenados = ordenarLocais(locaisFiltrados);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Gerenciamento de Salas</h1>
        <div>
          <a href="/locais/novo" className="btn btn-primary me-2">Nova Sala</a>
          <a href="/locais/reativar" className="btn btn-success">Reativar</a>
        </div>
      </div>
      
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="card-title mb-0">Pesquisar Salas</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Pesquisar por nome, local, descrição ou capacidade..."
                value={filtro}
                onChange={handleFiltroChange}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">Lista de Salas Ativas</h5>
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
                  <th>Local</th>
                  <th 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleOrdenacao('capacidade')}
                  >
                    Capacidade {ordenacao.campo === 'capacidade' && (ordenacao.direcao === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Descrição</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {locaisOrdenados
                  .filter(local => local.ativo)
                  .map(local => (
                  <tr key={local.id}>
                    <td>{local.id}</td>
                    <td>{local.nome}</td>
                    <td>{local.local}</td>
                    <td>{local.capacidade}</td>
                    <td>{local.descricao}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => editarLocal(local.id)}
                      >
                        Alterar
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => desativarLocal(local.id)}
                      >
                        Desativar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {locaisOrdenados.filter(local => local.ativo).length === 0 && (
              <div className="text-center py-4">
                <p>Nenhuma sala encontrada.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Locais; 