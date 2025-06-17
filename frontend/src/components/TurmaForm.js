import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ThemedInput, ThemedSelect } from './ThemedInput';

function TurmaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  
  const [formData, setFormData] = useState({
    nome: '',
    diaSemana: '',
    horarioInicio: '',
    horarioTermino: '',
    disciplinaId: '',
    localId: ''
  });
  
  const [disciplinas, setDisciplinas] = useState([]);
  const [locais, setLocais] = useState([]);
  const [errors, setErrors] = useState({});

  const API_URL_TURMAS = 'http://localhost:3001/api/turmas';
  const API_URL_DISCIPLINAS = 'http://localhost:3001/api/disciplinas';
  const API_URL_LOCAIS = 'http://localhost:3001/api/locais';

  const carregarDisciplinas = useCallback(async () => {
    try {
      const response = await axios.get(API_URL_DISCIPLINAS);
      setDisciplinas(response.data.filter(d => d.ativo));
    } catch (error) {
      alert('Erro ao carregar disciplinas: ' + error.message);
    }
  }, []);

  const carregarLocais = useCallback(async () => {
    try {
      const response = await axios.get(API_URL_LOCAIS);
      setLocais(response.data.filter(l => l.ativo));
    } catch (error) {
      alert('Erro ao carregar locais: ' + error.message);
    }
  }, []);

  const carregarTurma = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL_TURMAS}/${id}`);
      setFormData({
        nome: response.data.nome || '',
        diaSemana: response.data.diaSemana || '',
        horarioInicio: response.data.horarioInicio || '',
        horarioTermino: response.data.horarioTermino || '',
        disciplinaId: response.data.disciplinaId || '',
        localId: response.data.localId || ''
      });
    } catch (error) {
      alert('Erro ao carregar turma: ' + error.message);
      navigate('/turmas');
    }
  }, [id, navigate]);

  useEffect(() => {
    carregarDisciplinas();
    carregarLocais();
    if (isEdit) {
      carregarTurma();
    }
  }, [id, isEdit, carregarDisciplinas, carregarLocais, carregarTurma]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpar erro quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validarHorario = (inicio, termino) => {
    if (!inicio || !termino) return true; // Se algum estiver vazio, será validado pela obrigatoriedade
    
    const [horaInicio, minutoInicio] = inicio.split(':').map(Number);
    const [horaTermino, minutoTermino] = termino.split(':').map(Number);
    
    const minutosInicio = horaInicio * 60 + minutoInicio;
    const minutosTermino = horaTermino * 60 + minutoTermino;
    
    return minutosTermino > minutosInicio;
  };

  const validarFormulario = () => {
    const novosErros = {};
    
    if (!formData.nome.trim()) {
      novosErros.nome = 'Nome é obrigatório';
    }
    
    if (!formData.diaSemana.trim()) {
      novosErros.diaSemana = 'Dia da semana é obrigatório';
    }
    
    if (!formData.horarioInicio.trim()) {
      novosErros.horarioInicio = 'Horário de início é obrigatório';
    }
    
    if (!formData.horarioTermino.trim()) {
      novosErros.horarioTermino = 'Horário de término é obrigatório';
    }
    
    if (formData.horarioInicio && formData.horarioTermino && 
        !validarHorario(formData.horarioInicio, formData.horarioTermino)) {
      novosErros.horarioTermino = 'Horário de término deve ser posterior ao de início';
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
        disciplinaId: formData.disciplinaId && formData.disciplinaId !== "" ? parseInt(formData.disciplinaId) : null,
        localId: formData.localId && formData.localId !== "" ? parseInt(formData.localId) : null
      };
      
      if (isEdit) {
        await axios.put(`${API_URL_TURMAS}/${id}`, dataToSend);
        alert('Turma atualizada com sucesso!');
      } else {
        await axios.post(API_URL_TURMAS, dataToSend);
        alert('Turma cadastrada com sucesso!');
      }
      
      navigate('/turmas');
    } catch (error) {
      alert('Erro ao salvar turma: ' + error.message);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{isEdit ? 'Alterar Turma' : 'Nova Turma'}</h1>
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/turmas')}
        >
          Voltar
        </button>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">
            {isEdit ? 'Alterar dados da turma' : 'Cadastrar nova turma'}
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
                    placeholder="Ex: Turma A, Turma Noturno"
                  />
                  {errors.nome && <div className="invalid-feedback">{errors.nome}</div>}
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="diaSemana" className="form-label">
                    Dia da Semana <span className="text-danger">*</span>
                  </label>
                  <ThemedSelect
                    className={`form-select ${errors.diaSemana ? 'is-invalid' : ''}`}
                    id="diaSemana"
                    name="diaSemana"
                    value={formData.diaSemana}
                    onChange={handleInputChange}
                  >
                    <option value="">Selecione...</option>
                    <option value="Segunda-feira">Segunda-feira</option>
                    <option value="Terça-feira">Terça-feira</option>
                    <option value="Quarta-feira">Quarta-feira</option>
                    <option value="Quinta-feira">Quinta-feira</option>
                    <option value="Sexta-feira">Sexta-feira</option>
                    <option value="Sábado">Sábado</option>
                    <option value="Domingo">Domingo</option>
                  </ThemedSelect>
                  {errors.diaSemana && <div className="invalid-feedback">{errors.diaSemana}</div>}
                </div>
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-3">
                <div className="mb-3">
                  <label htmlFor="horarioInicio" className="form-label">
                    Horário Início <span className="text-danger">*</span>
                  </label>
                  <ThemedInput
                    type="time"
                    className={`form-control ${errors.horarioInicio ? 'is-invalid' : ''}`}
                    id="horarioInicio"
                    name="horarioInicio"
                    value={formData.horarioInicio}
                    onChange={handleInputChange}
                  />
                  {errors.horarioInicio && <div className="invalid-feedback">{errors.horarioInicio}</div>}
                </div>
              </div>
              
              <div className="col-md-3">
                <div className="mb-3">
                  <label htmlFor="horarioTermino" className="form-label">
                    Horário Término <span className="text-danger">*</span>
                  </label>
                  <ThemedInput
                    type="time"
                    className={`form-control ${errors.horarioTermino ? 'is-invalid' : ''}`}
                    id="horarioTermino"
                    name="horarioTermino"
                    value={formData.horarioTermino}
                    onChange={handleInputChange}
                  />
                  {errors.horarioTermino && <div className="invalid-feedback">{errors.horarioTermino}</div>}
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="disciplinaId" className="form-label">Disciplina</label>
                  <ThemedSelect
                    className="form-select"
                    id="disciplinaId"
                    name="disciplinaId"
                    value={formData.disciplinaId}
                    onChange={handleInputChange}
                  >
                    <option value="">Selecione uma disciplina (opcional)</option>
                    {disciplinas.map(disciplina => (
                      <option key={disciplina.id} value={disciplina.id}>
                        {disciplina.nome} ({disciplina.codigo})
                      </option>
                    ))}
                  </ThemedSelect>
                </div>
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="localId" className="form-label">Local</label>
                  <ThemedSelect
                    className="form-select"
                    id="localId"
                    name="localId"
                    value={formData.localId}
                    onChange={handleInputChange}
                  >
                    <option value="">Selecione um local (opcional)</option>
                    {locais.map(local => (
                      <option key={local.id} value={local.id}>
                        {local.nome} - {local.local}
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
                onClick={() => navigate('/turmas')}
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

export default TurmaForm; 