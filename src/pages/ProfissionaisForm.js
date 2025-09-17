import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

function ProfissionaisForm({ editingId, onCancel }) {
  const [formData, setFormData] = useState({
    nome: '',
    especialidade: '',
    crm: '',
    telefone: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (editingId) {
      loadProfissional();
    }
  }, [editingId]);

  const loadProfissional = async () => {
    try {
      setLoading(true);
      const profissional = await apiService.getProfissional(editingId);
      setFormData({
        nome: profissional.nome || '',
        especialidade: profissional.especialidade || '',
        crm: profissional.crm || '',
        telefone: profissional.telefone || '',
        email: profissional.email || ''
      });
    } catch (err) {
      setError('Erro ao carregar profissional: ' + err.message);
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
        await apiService.updateProfissional(editingId, formData);
        setSuccess('Profissional atualizado com sucesso!');
      } else {
        await apiService.createProfissional(formData);
        setSuccess('Profissional criado com sucesso!');
        setFormData({
          nome: '',
          especialidade: '',
          crm: '',
          telefone: '',
          email: ''
        });
      }
    } catch (err) {
      setError('Erro ao salvar profissional: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>{editingId ? 'Editar Profissional' : 'Novo Profissional'}</h2>
      
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
          <label htmlFor="especialidade">Especialidade *</label>
          <input
            type="text"
            id="especialidade"
            name="especialidade"
            value={formData.especialidade}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="Ex: Cardiologia, Dermatologia, etc."
          />
        </div>

        <div className="form-group">
          <label htmlFor="crm">CRM *</label>
          <input
            type="text"
            id="crm"
            name="crm"
            value={formData.crm}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="Ex: CRM/SP 123456"
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

export default ProfissionaisForm;

