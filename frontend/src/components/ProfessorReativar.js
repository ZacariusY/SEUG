import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ProfessorReativar() {
  const [professores, setProfessores] = useState([]);
  const [filtro, setFiltro] = useState('');
  const navigate = useNavigate();

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
      !professor.ativo && (
        professor.nome.toLowerCase().includes(filtro.toLowerCase()) ||
        professor.cpf.includes(filtro) ||
        professor.titulacao.toLowerCase().includes(filtro.toLowerCase()) ||
        professor.departamento.toLowerCase().includes(filtro.toLowerCase())
      )
    );
  };

  const reativarProfessor = async (id, nome) => {
    if (window.confirm(`Tem certeza que deseja reativar o professor ${nome}?`)) {
      try {
        await axios.patch(`${API_URL}/${id}/status`);
        carregarProfessores();
        alert('Professor reativado com sucesso!');
      } catch (error) {
        alert('Erro ao reativar professor: ' + error.message);
      }
    }
  };

  const professoresFiltrados = filtrarProfessores();

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Reativar Professores</h1>
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/professores')}
        >
          Voltar
        </button>
      </div>
      
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="card-title mb-0">Pesquisar Professores Inativos</h5>
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
          <h5 className="card-title mb-0">Professores Inativos</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>CPF</th>
                  <th>Titulação</th>
                  <th>Departamento</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {professoresFiltrados.map(professor => (
                  <tr key={professor.id}>
                    <td>{professor.id}</td>
                    <td>{professor.nome}</td>
                    <td>{professor.cpf}</td>
                    <td>{professor.titulacao}</td>
                    <td>{professor.departamento}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => reativarProfessor(professor.id, professor.nome)}
                      >
                        Reativar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {professoresFiltrados.length === 0 && (
              <div className="text-center py-4">
                <p>Nenhum professor inativo encontrado.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfessorReativar; 