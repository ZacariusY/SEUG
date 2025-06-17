import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Pesquisa() {
  const navigate = useNavigate();
  const [resultados, setResultados] = useState([]);
  const [termo, setTermo] = useState('');
  const [categoria, setCategoria] = useState('professores');
  const [carregando, setCarregando] = useState(false);
  const [filtroTabela, setFiltroTabela] = useState('');
  const [alunosTurmas, setAlunosTurmas] = useState({});

  const categorias = [
    { value: 'professores', label: 'Professores', endpoint: 'professores' },
    { value: 'alunos', label: 'Alunos', endpoint: 'alunos' },
    { value: 'disciplinas', label: 'Disciplinas', endpoint: 'disciplinas' },
    { value: 'turmas', label: 'Turmas', endpoint: 'turmas' },
    { value: 'locais', label: 'Locais', endpoint: 'locais' }
  ];

  const pesquisar = async () => {
    if (!termo.trim()) {
      setResultados([]);
      setAlunosTurmas({});
      return;
    }

    setCarregando(true);
    try {
      const categoriaInfo = categorias.find(c => c.value === categoria);
      const response = await axios.get(`http://localhost:3001/api/${categoriaInfo.endpoint}`);
      
      const resultadosFiltrados = response.data
        .filter(item => {
          if (!item.ativo) return false;
          const termoBusca = termo.toLowerCase();
          return item.nome && item.nome.toLowerCase().includes(termoBusca);
        });
      
      setResultados(resultadosFiltrados);

      // Se for pesquisa de turmas, buscar os alunos de cada turma
      if (categoria === 'turmas' && resultadosFiltrados.length > 0) {
        const alunosData = {};
        for (const turma of resultadosFiltrados) {
          try {
            const alunosResponse = await axios.get(`http://localhost:3001/api/turmas/${turma.id}/alunos`);
            alunosData[turma.id] = alunosResponse.data;
          } catch (error) {
            console.error(`Erro ao carregar alunos da turma ${turma.id}:`, error);
            alunosData[turma.id] = [];
          }
        }
        setAlunosTurmas(alunosData);
      } else {
        setAlunosTurmas({});
      }
    } catch (error) {
      console.error('Erro na pesquisa:', error);
      alert('Erro ao realizar pesquisa: ' + error.message);
    }
    setCarregando(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      pesquisar();
    }
  };

  const filtrarResultados = () => {
    if (!filtroTabela.trim()) {
      return resultados;
    }
    
    return resultados.filter(item => {
      const termoBusca = filtroTabela.toLowerCase();
      return item.nome && item.nome.toLowerCase().includes(termoBusca);
    });
  };

  const resultadosFiltrados = filtrarResultados();

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Pesquisa de Registros</h1>
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/')}
        >
          Voltar
        </button>
      </div>

      {/* Área de Pesquisa */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Pesquisar</h5>
          <div className="row">
            <div className="col-md-3">
              <select 
                className="form-select"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              >
                {categorias.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-7">
              <input
                type="text"
                className="form-control"
                placeholder="Digite o nome para pesquisar..."
                value={termo}
                onChange={(e) => setTermo(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            <div className="col-md-2">
              <button 
                className="btn btn-primary w-100"
                onClick={pesquisar}
                disabled={carregando}
              >
                {carregando ? 'Buscando...' : 'Pesquisar'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de Resultados */}
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">Resultados da Pesquisa</h5>
        </div>
        <div className="card-body">
          {resultados.length > 0 ? (
            <>
              {/* Campo de filtro da tabela */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Filtrar resultados da tabela..."
                    value={filtroTabela}
                    onChange={(e) => setFiltroTabela(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <span className="text-muted">
                    Mostrando {resultadosFiltrados.length} de {resultados.length} resultados
                  </span>
                </div>
              </div>

              {/* Tabela */}
              <div className="table-responsive">
                {categoria === 'turmas' ? (
                  // Tabela especial para turmas com alunos
                  <div>
                    {resultadosFiltrados.map((turma) => (
                      <div key={turma.id} className="mb-4">
                        <div className="card">
                          <div className="card-header bg-primary text-white">
                            <h6 className="mb-0">
                              <strong>Turma:</strong> {turma.nome} | 
                              <strong> Dia:</strong> {turma.diaSemana} | 
                              <strong> Horário:</strong> {turma.horarioInicio}-{turma.horarioTermino}
                              <span className="float-end">
                                <span className={`badge ${turma.ativo ? 'bg-success' : 'bg-danger'}`}>
                                  {turma.ativo ? 'Ativo' : 'Inativo'}
                                </span>
                              </span>
                            </h6>
                          </div>
                          <div className="card-body">
                            <h6 className="text-muted mb-3">
                              Alunos Matriculados ({alunosTurmas[turma.id]?.length || 0})
                            </h6>
                            {alunosTurmas[turma.id] && alunosTurmas[turma.id].length > 0 ? (
                              <div className="table-responsive">
                                                                 <table className="table table-sm table-striped">
                                   <thead>
                                     <tr>
                                       <th>ID</th>
                                       <th>Nome do Aluno</th>
                                       <th>Email</th>
                                     </tr>
                                   </thead>
                                   <tbody>
                                     {alunosTurmas[turma.id].map((aluno) => (
                                       <tr key={aluno.id}>
                                         <td>{aluno.id}</td>
                                         <td>{aluno.nome}</td>
                                         <td>{aluno.email}</td>
                                       </tr>
                                     ))}
                                   </tbody>
                                 </table>
                              </div>
                            ) : (
                              <div className="text-center py-3">
                                <span className="text-muted">Nenhum aluno matriculado nesta turma</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Tabela padrão para outras categorias
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Categoria</th>
                        <th>Status</th>
                        <th>Detalhes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resultadosFiltrados.map((item) => (
                        <tr key={item.id}>
                          <td>{item.id}</td>
                          <td>{item.nome}</td>
                          <td>
                            <span className="badge bg-secondary">
                              {categorias.find(c => c.value === categoria)?.label}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${item.ativo ? 'bg-success' : 'bg-danger'}`}>
                              {item.ativo ? 'Ativo' : 'Inativo'}
                            </span>
                          </td>
                          <td>
                            {categoria === 'professores' && (
                              <small className="text-muted">
                                CPF: {item.cpf} | {item.titulacao}
                              </small>
                            )}
                            {categoria === 'alunos' && (
                              <small className="text-muted">
                                Email: {item.email}
                              </small>
                            )}
                            {categoria === 'disciplinas' && (
                              <small className="text-muted">
                                Código: {item.codigo} | {item.periodo}
                              </small>
                            )}
                            {categoria === 'locais' && (
                              <small className="text-muted">
                                Local: {item.local} | Capacidade: {item.capacidade}
                              </small>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted">
                Faça uma pesquisa acima para ver os resultados em formato de tabela.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Pesquisa; 