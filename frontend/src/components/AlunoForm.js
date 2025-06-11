import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { ThemedInput } from './ThemedInput';

function AlunoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  
  const [formData, setFormData] = useState({
    nome: '',
    email: ''
  });
  
  const [errors, setErrors] = useState({});

  const API_URL = 'http://localhost:3001/alunos';

  const carregarAluno = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      setFormData({
        nome: response.data.nome || '',
        email: response.data.email || ''
      });
    } catch (error) {
      alert('Erro ao carregar aluno: ' + error.message);
      navigate('/alunos');
    }
  }, [id, navigate]);

  useEffect(() => {
    if (isEdit) {
      carregarAluno();
    }
  }, [id, isEdit, carregarAluno]);

  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
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
    
    if (!formData.email.trim()) {
      novosErros.email = 'Email é obrigatório';
    } else if (!validarEmail(formData.email)) {
      novosErros.email = 'Email inválido';
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
      if (isEdit) {
        await axios.put(`${API_URL}/${id}`, formData);
        alert('Aluno atualizado com sucesso!');
      } else {
        await axios.post(API_URL, formData);
        alert('Aluno cadastrado com sucesso!');
      }
      
      navigate('/alunos');
    } catch (error) {
      alert('Erro ao salvar aluno: ' + error.message);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{isEdit ? 'Alterar Aluno' : 'Novo Aluno'}</h1>
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/alunos')}
        >
          Voltar
        </button>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">
            {isEdit ? 'Alterar dados do aluno' : 'Cadastrar novo aluno'}
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
                  <label htmlFor="email" className="form-label">
                    Email <span className="text-danger">*</span>
                  </label>
                  <ThemedInput
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    maxLength="100"
                    placeholder="exemplo@email.com"
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
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
                onClick={() => navigate('/alunos')}
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

export default AlunoForm; 