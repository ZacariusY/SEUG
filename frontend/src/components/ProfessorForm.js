import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { ThemedInput, ThemedSelect } from './ThemedInput';

function ProfessorForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    titulacao: '',
    departamento: ''
  });
  
  const [errors, setErrors] = useState({});

  const API_URL = 'http://localhost:3001/professores';

  const carregarProfessor = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      setFormData({
        nome: response.data.nome || '',
        cpf: response.data.cpf || '',
        titulacao: response.data.titulacao || '',
        departamento: response.data.departamento || ''
      });
    } catch (error) {
      alert('Erro ao carregar professor: ' + error.message);
      navigate('/professores');
    }
  }, [id, navigate]);

  useEffect(() => {
    if (isEdit) {
      carregarProfessor();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEdit]);

  const validarCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]/g, '');
    
    if (cpf.length !== 11) return false;
    
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf[i]) * (10 - i);
    }
    let resto = soma % 11;
    let dv1 = resto < 2 ? 0 : 11 - resto;
    
    if (parseInt(cpf[9]) !== dv1) return false;
    
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf[i]) * (11 - i);
    }
    resto = soma % 11;
    let dv2 = resto < 2 ? 0 : 11 - resto;
    
    return parseInt(cpf[10]) === dv2;
  };

  const formatarCPF = (cpf) => {
    // Remove tudo que não for dígito
    cpf = cpf.replace(/[^\d]/g, '');
    
    // Aplica a formatação: XXX.XXX.XXX-XX
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');        // 123.4
    cpf = cpf.replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3'); // 123.456.7
    cpf = cpf.replace(/\.(\d{3})(\d{2})$/, '.$1-$2');     // 123.456.789-01
    
    return cpf;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'cpf') {
      const cpfFormatado = formatarCPF(value);
      setFormData(prev => ({ ...prev, [name]: cpfFormatado }));
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
    
    if (!formData.cpf.trim()) {
      novosErros.cpf = 'CPF é obrigatório';
    } else if (!validarCPF(formData.cpf)) {
      novosErros.cpf = 'CPF inválido';
    }
    
    if (!formData.titulacao.trim()) {
      novosErros.titulacao = 'Titulação é obrigatória';
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
        cpf: formData.cpf.replace(/[^\d]/g, '') // Enviar apenas números
      };
      
      if (isEdit) {
        await axios.put(`${API_URL}/${id}`, dataToSend);
        alert('Professor atualizado com sucesso!');
      } else {
        await axios.post(API_URL, dataToSend);
        alert('Professor cadastrado com sucesso!');
      }
      
      navigate('/professores');
    } catch (error) {
      alert('Erro ao salvar professor: ' + error.message);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{isEdit ? 'Alterar Professor' : 'Novo Professor'}</h1>
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/professores')}
        >
          Voltar
        </button>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">
            {isEdit ? 'Alterar dados do professor' : 'Cadastrar novo professor'}
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
                  <label htmlFor="cpf" className="form-label">
                    CPF <span className="text-danger">*</span>
                  </label>
                  <ThemedInput
                    type="text"
                    className={`form-control ${errors.cpf ? 'is-invalid' : ''}`}
                    id="cpf"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleInputChange}
                    maxLength="14"
                    placeholder="000.000.000-00"
                  />
                  {errors.cpf && <div className="invalid-feedback">{errors.cpf}</div>}
                </div>
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="titulacao" className="form-label">
                    Titulação <span className="text-danger">*</span>
                  </label>
                  <ThemedSelect
                    className={`form-select ${errors.titulacao ? 'is-invalid' : ''}`}
                    id="titulacao"
                    name="titulacao"
                    value={formData.titulacao}
                    onChange={handleInputChange}
                  >
                    <option value="">Selecione...</option>
                    <option value="Graduação">Graduação</option>
                    <option value="Especialização">Especialização</option>
                    <option value="Mestrado">Mestrado</option>
                    <option value="Doutorado">Doutorado</option>
                    <option value="Pós-Doutorado">Pós-Doutorado</option>
                  </ThemedSelect>
                  {errors.titulacao && <div className="invalid-feedback">{errors.titulacao}</div>}
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="departamento" className="form-label">Departamento</label>
                  <ThemedInput
                    type="text"
                    className="form-control"
                    id="departamento"
                    name="departamento"
                    value={formData.departamento}
                    onChange={handleInputChange}
                    maxLength="100"
                  />
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
                onClick={() => navigate('/professores')}
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

export default ProfessorForm; 