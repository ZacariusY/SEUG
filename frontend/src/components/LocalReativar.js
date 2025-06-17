import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LocalReativar() {
  const [locais, setLocais] = useState([]);
  const [filtro, setFiltro] = useState('');
  const navigate = useNavigate();

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
      !local.ativo && (
        local.nome.toLowerCase().includes(filtro.toLowerCase()) ||
        local.local.toLowerCase().includes(filtro.toLowerCase()) ||
        local.descricao.toLowerCase().includes(filtro.toLowerCase()) ||
        local.capacidade.toString().includes(filtro)
      )
    );
  };

  const reativarLocal = async (id, nome) => {
    if (window.confirm(`Tem certeza que deseja reativar a sala ${nome}?`)) {
      try {
        await axios.patch(`${API_URL}/${id}/status`);
        carregarLocais();
        alert('Sala reativada com sucesso!');
      } catch (error) {
        alert('Erro ao reativar sala: ' + error.message);
      }
    }
  };

  const locaisFiltrados = filtrarLocais();

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Reativar Salas</h1>
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/locais')}
        >
          Voltar
        </button>
      </div>
      
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="card-title mb-0">Pesquisar Salas Inativas</h5>
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
          <h5 className="card-title mb-0">Salas Inativas</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Local</th>
                  <th>Capacidade</th>
                  <th>Descrição</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {locaisFiltrados.map(local => (
                  <tr key={local.id}>
                    <td>{local.id}</td>
                    <td>{local.nome}</td>
                    <td>{local.local}</td>
                    <td>{local.capacidade}</td>
                    <td>{local.descricao}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => reativarLocal(local.id, local.nome)}
                      >
                        Reativar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {locaisFiltrados.length === 0 && (
              <div className="text-center py-4">
                <p>Nenhuma sala inativa encontrada.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LocalReativar; 