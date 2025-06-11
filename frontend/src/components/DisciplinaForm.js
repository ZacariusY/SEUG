import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ThemedInput, ThemedSelect } from './ThemedInput';

function DisciplinaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  
  const [formData, setFormData] = useState({
    nome: '',
    codigo: '',
    periodo: '',
    professorId: ''
  });
  
  const [professores, setProfessores] = useState([]);
  const [errors, setErrors] = useState({});

  const API_URL_DISCIPLINAS = 'http://localhost:3001/disciplinas';
  const API_URL_PROFESSORES = 'http://localhost:3001/professores';

  const carregarProfessores = useCallback(async () => {
    try {
      const response = await axios.get(API_URL_PROFESSORES);
      setProfessores(response.data.filter(p => p.ativo));
    } catch (error) {
      alert('Erro ao carregar professores: ' + error.message);
    }
  }, []);

  const carregarDisciplina = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL_DISCIPLINAS}/${id}`);
      setFormData({
        nome: response.data.nome || '',
        codigo: response.data.codigo || '',
        periodo: response.data.periodo || '',
        professorId: response.data.professorId || ''
      });
    } catch (error) {
      alert('Erro ao carregar disciplina: ' + error.message);
      navigate('/disciplinas');
    }
  }, [id, navigate]);

  useEffect(() => {
    carregarProfessores();
    if (isEdit) {
      carregarDisciplina();
    }
  }, [id, isEdit, carregarProfessores, carregarDisciplina]);

  const validarCodigo = (codigo) => {
    // Código deve conter apenas letras e números, mínimo 3 caracteres
    return /^[A-Za-z0-9]{3,10}$/.test(codigo);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'codigo') {
      // Transformar em maiúsculo e remover caracteres especiais
      const codigoLimpo = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      setFormData(prev => ({ ...prev, [name]: codigoLimpo }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Limpar erro quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validarFormulario = () => {
    const novosErros = {};
    
    if (!formData.nome.trim()) {
      novosErros.nome = 'Nome é obrigatório';
    }
    
    if (!formData.codigo.trim()) {
      novosErros.codigo = 'Código é obrigatório';
    } else if (!validarCodigo(formData.codigo)) {
      novosErros.codigo = 'Código deve conter apenas letras e números (3-10 caracteres)';
    }
    
    if (!formData.periodo.trim()) {
      novosErros.periodo = 'Período é obrigatório';
    }
    
    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }
    
    try {
      const dataToSend = {
        ...formData,
        professorId: formData.professorId ? parseInt(formData.professorId) : null
      };
      
      if (isEdit) {
        await axios.put(`${API_URL_DISCIPLINAS}/${id}`, dataToSend);
        alert('Disciplina atualizada com sucesso!');
      } else {
        await axios.post(API_URL_DISCIPLINAS, dataToSend);
        alert('Disciplina cadastrada com sucesso!');
      }
      
      navigate('/disciplinas');
    } catch (error) {
      alert('Erro ao salvar disciplina: ' + error.message);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{isEdit ? 'Alterar Disciplina' : 'Nova Disciplina'}</h1>
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/disciplinas')}
        >
          Voltar
        </button>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">
            {isEdit ? 'Alterar dados da disciplina' : 'Cadastrar nova disciplina'}
          </h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="nome" className="form-label">
                    Nome <span className="text-danger">*</span>
                  </label>
                  <ThemedInput
                    type="text"
                    className={`form-control ${errors.nome ? 'is-invalid' : ''}`}
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    maxLength="100"
                  />
                  {errors.nome && <div className="invalid-feedback">{errors.nome}</div>}
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="codigo" className="form-label">
                    Código <span className="text-danger">*</span>
                  </label>
                  <ThemedInput
                    type="text"
                    className={`form-control ${errors.codigo ? 'is-invalid' : ''}`}
                    id="codigo"
                    name="codigo"
                    value={formData.codigo}
                    onChange={handleInputChange}
                    maxLength="10"
                    placeholder="Ex: MAT001, FIS123"
                  />
                  {errors.codigo && <div className="invalid-feedback">{errors.codigo}</div>}
                  <div className="form-text">Use apenas letras e números (3-10 caracteres)</div>
                </div>
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="periodo" className="form-label">
                    Período <span className="text-danger">*</span>
                  </label>
                  <ThemedSelect
                    className={`form-select ${errors.periodo ? 'is-invalid' : ''}`}
                    id="periodo"
                    name="periodo"
                    value={formData.periodo}
                    onChange={handleInputChange}
                  >
                    <option value="">Selecione...</option>
                    <option value="1º Período">1º Período</option>
                    <option value="2º Período">2º Período</option>
                    <option value="3º Período">3º Período</option>
                    <option value="4º Período">4º Período</option>
                    <option value="5º Período">5º Período</option>
                    <option value="6º Período">6º Período</option>
                    <option value="7º Período">7º Período</option>
                    <option value="8º Período">8º Período</option>
                    <option value="9º Período">9º Período</option>
                    <option value="10º Período">10º Período</option>
                  </ThemedSelect>
                  {errors.periodo && <div className="invalid-feedback">{errors.periodo}</div>}
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="professorId" className="form-label">Professor</label>
                  <ThemedSelect
                    className="form-select"
                    id="professorId"
                    name="professorId"
                    value={formData.professorId}
                    onChange={handleInputChange}
                  >
                    <option value="">Selecione um professor (opcional)</option>
                    {professores.map(professor => (
                      <option key={professor.id} value={professor.id}>
                        {professor.nome}
                      </option>
                    ))}
                  </ThemedSelect>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <button type="submit" className="btn btn-primary me-2">
                {isEdit ? 'Atualizar' : 'Cadastrar'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/disciplinas')}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DisciplinaForm; 