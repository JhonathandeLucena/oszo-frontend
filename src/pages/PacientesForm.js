import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

function PacientesForm({ editingId, onCancel }) {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    data_nascimento: '',
    telefone: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (editingId) {
      loadPaciente();
    }
  }, [editingId]);

  const loadPaciente = async () => {
    try {
      setLoading(true);
      const paciente = await apiService.getPaciente(editingId);
      setFormData({
        nome: paciente.nome || '',
        cpf: paciente.cpf || '',
        data_nascimento: paciente.data_nascimento || '',
        telefone: paciente.telefone || '',
        email: paciente.email || ''
      });
    } catch (err) {
      setError('Erro ao carregar paciente: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (editingId) {
        await apiService.updatePaciente(editingId, formData);
        setSuccess('Paciente atualizado com sucesso!');
      } else {
        await apiService.createPaciente(formData);
        setSuccess('Paciente criado com sucesso!');
        setFormData({
          nome: '',
          cpf: '',
          data_nascimento: '',
          telefone: '',
          email: ''
        });
      }
    } catch (err) {
      setError('Erro ao salvar paciente: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>{editingId ? 'Editar Paciente' : 'Novo Paciente'}</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nome">Nome *</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="cpf">CPF *</label>
          <input
            type="text"
            id="cpf"
            name="cpf"
            value={formData.cpf}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="000.000.000-00"
          />
        </div>

        <div className="form-group">
          <label htmlFor="data_nascimento">Data de Nascimento *</label>
          <input
            type="date"
            id="data_nascimento"
            name="data_nascimento"
            value={formData.data_nascimento}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="telefone">Telefone</label>
          <input
            type="tel"
            id="telefone"
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
            disabled={loading}
            placeholder="(11) 99999-9999"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
            placeholder="email@exemplo.com"
          />
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Salvando...' : (editingId ? 'Atualizar' : 'Criar')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PacientesForm;

