import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ThemedInput, ThemedTextarea } from './ThemedInput';

function LocalForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  
  const [formData, setFormData] = useState({
    nome: '',
    local: '',
    capacidade: '',
    descricao: ''
  });
  
  const [errors, setErrors] = useState({});

  const API_URL = 'http://localhost:3001/api/locais';

  const carregarLocal = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      setFormData({
        nome: response.data.nome || '',
        local: response.data.local || '',
        capacidade: response.data.capacidade || '',
        descricao: response.data.descricao || ''
      });
    } catch (error) {
      alert('Erro ao carregar local: ' + error.message);
      navigate('/locais');
    }
  }, [id, navigate]);

  useEffect(() => {
    if (isEdit) {
      carregarLocal();
    }
  }, [id, isEdit, carregarLocal]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'capacidade') {
      // Permitir apenas números
      const capacidadeNumero = value.replace(/[^\d]/g, '');
      setFormData(prev => ({ ...prev, [name]: capacidadeNumero }));
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
    
    if (!formData.local.trim()) {
      novosErros.local = 'Local é obrigatório';
    }
    
    if (!formData.capacidade || formData.capacidade === "" || parseInt(formData.capacidade) <= 0) {
      novosErros.capacidade = 'Capacidade deve ser maior que zero';
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
        capacidade: formData.capacidade && formData.capacidade !== "" ? parseInt(formData.capacidade) : 0
      };
      
      if (isEdit) {
        await axios.put(`${API_URL}/${id}`, dataToSend);
        alert('Sala atualizada com sucesso!');
      } else {
        await axios.post(API_URL, dataToSend);
        alert('Sala cadastrada com sucesso!');
      }
      
      navigate('/locais');
    } catch (error) {
      alert('Erro ao salvar sala: ' + error.message);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{isEdit ? 'Alterar Sala' : 'Nova Sala'}</h1>
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/locais')}
        >
          Voltar
        </button>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">
            {isEdit ? 'Alterar dados da sala' : 'Cadastrar nova sala'}
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
                    placeholder="Ex: Sala 101, Laboratório de Informática"
                  />
                  {errors.nome && <div className="invalid-feedback">{errors.nome}</div>}
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="local" className="form-label">
                    Local <span className="text-danger">*</span>
                  </label>
                  <ThemedInput
                    type="text"
                    className={`form-control ${errors.local ? 'is-invalid' : ''}`}
                    id="local"
                    name="local"
                    value={formData.local}
                    onChange={handleInputChange}
                    maxLength="100"
                    placeholder="Ex: Bloco A - 1º Andar, Prédio Principal"
                  />
                  {errors.local && <div className="invalid-feedback">{errors.local}</div>}
                </div>
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="capacidade" className="form-label">
                    Capacidade <span className="text-danger">*</span>
                  </label>
                  <ThemedInput
                    type="text"
                    className={`form-control ${errors.capacidade ? 'is-invalid' : ''}`}
                    id="capacidade"
                    name="capacidade"
                    value={formData.capacidade}
                    onChange={handleInputChange}
                    placeholder="Número de pessoas"
                  />
                  {errors.capacidade && <div className="invalid-feedback">{errors.capacidade}</div>}
                  <div className="form-text">Número máximo de pessoas que a sala comporta</div>
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="descricao" className="form-label">Descrição</label>
                  <ThemedTextarea
                    className="form-control"
                    id="descricao"
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleInputChange}
                    rows="3"
                    maxLength="255"
                    placeholder="Descrição adicional, equipamentos disponíveis..."
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
                onClick={() => navigate('/locais')}
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

export default LocalForm; 