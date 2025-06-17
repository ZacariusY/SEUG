import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AlunoReativar() {
  const [alunos, setAlunos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const navigate = useNavigate();

  const API_URL = 'http://localhost:3001/api/alunos';

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
      !aluno.ativo && (
        aluno.nome.toLowerCase().includes(filtro.toLowerCase()) ||
        aluno.email.toLowerCase().includes(filtro.toLowerCase())
      )
    );
  };

  const reativarAluno = async (id, nome) => {
    if (window.confirm(`Tem certeza que deseja reativar o aluno ${nome}?`)) {
      try {
        await axios.patch(`${API_URL}/${id}/status`);
        carregarAlunos();
        alert('Aluno reativado com sucesso!');
      } catch (error) {
        alert('Erro ao reativar aluno: ' + error.message);
      }
    }
  };

  const alunosFiltrados = filtrarAlunos();

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Reativar Alunos</h1>
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/alunos')}
        >
          Voltar
        </button>
      </div>
      
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="card-title mb-0">Pesquisar Alunos Inativos</h5>
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
          <h5 className="card-title mb-0">Alunos Inativos</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {alunosFiltrados.map(aluno => (
                  <tr key={aluno.id}>
                    <td>{aluno.id}</td>
                    <td>{aluno.nome}</td>
                    <td>{aluno.email}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => reativarAluno(aluno.id, aluno.nome)}
                      >
                        Reativar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {alunosFiltrados.length === 0 && (
              <div className="text-center py-4">
                <p>Nenhum aluno inativo encontrado.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AlunoReativar; 