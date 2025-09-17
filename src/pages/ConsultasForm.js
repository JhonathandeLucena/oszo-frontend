import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

function ConsultasForm({ editingId, onCancel }) {
  const [formData, setFormData] = useState({
    paciente_id: '',
    profissional_id: '',
    data: '',
    hora: '',
    tipo: 'presencial',
    link_meet: '',
    observacoes: '',
    status: 'agendada'
  });
  const [pacientes, setPacientes] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadPacientes();
    loadProfissionais();
    if (editingId) {
      loadConsulta();
    }
  }, [editingId]);

  useEffect(() => {
    if (formData.profissional_id && formData.data) {
      loadSlots();
    }
  }, [formData.profissional_id, formData.data]);

  const loadPacientes = async () => {
    try {
      const data = await apiService.getPacientes();
      setPacientes(data);
    } catch (err) {
      console.error('Erro ao carregar pacientes:', err);
    }
  };

  const loadProfissionais = async () => {
    try {
      const data = await apiService.getProfissionais();
      setProfissionais(data);
    } catch (err) {
      console.error('Erro ao carregar profissionais:', err);
    }
  };

  const loadSlots = async () => {
    try {
      const data = await apiService.getSlots(formData.profissional_id, formData.data);
      setSlots(data.slots || []);
    } catch (err) {
      console.error('Erro ao carregar slots:', err);
      setSlots([]);
    }
  };

  const loadConsulta = async () => {
    try {
      setLoading(true);
      const consulta = await apiService.getConsulta(editingId);
      setFormData({
        paciente_id: consulta.paciente_id || '',
        profissional_id: consulta.profissional_id || '',
        data: consulta.data || '',
        hora: consulta.hora || '',
        tipo: consulta.tipo || 'presencial',
        link_meet: consulta.link_meet || '',
        observacoes: consulta.observacoes || '',
        status: consulta.status || 'agendada'
      });
    } catch (err) {
      setError('Erro ao carregar consulta: ' + err.message);
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
        await apiService.updateConsulta(editingId, formData);
        setSuccess('Consulta atualizada com sucesso!');
      } else {
        await apiService.createConsulta(formData);
        setSuccess('Consulta criada com sucesso!');
        setFormData({
          paciente_id: '',
          profissional_id: '',
          data: '',
          hora: '',
          tipo: 'presencial',
          link_meet: '',
          observacoes: '',
          status: 'agendada'
        });
        setSlots([]);
      }
    } catch (err) {
      setError('Erro ao salvar consulta: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>{editingId ? 'Editar Consulta' : 'Nova Consulta'}</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="paciente_id">Paciente *</label>
          <select
            id="paciente_id"
            name="paciente_id"
            value={formData.paciente_id}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="">Selecione um paciente</option>
            {pacientes.map(paciente => (
              <option key={paciente.id} value={paciente.id}>
                {paciente.nome} - {paciente.cpf}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="profissional_id">Profissional *</label>
          <select
            id="profissional_id"
            name="profissional_id"
            value={formData.profissional_id}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="">Selecione um profissional</option>
            {profissionais.map(profissional => (
              <option key={profissional.id} value={profissional.id}>
                {profissional.nome} - {profissional.especialidade}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="data">Data *</label>
          <input
            type="date"
            id="data"
            name="data"
            value={formData.data}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="hora">Horário *</label>
          {slots.length > 0 ? (
            <select
              id="hora"
              name="hora"
              value={formData.hora}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="">Selecione um horário</option>
              {slots.map(slot => (
                <option key={slot.id} value={slot.hora_inicio}>
                  {slot.hora_inicio}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="time"
              id="hora"
              name="hora"
              value={formData.hora}
              onChange={handleChange}
              required
              disabled={loading}
            />
          )}
          {formData.profissional_id && formData.data && slots.length === 0 && (
            <div style={{fontSize: '12px', color: '#666', marginTop: '5px'}}>
              Nenhum slot disponível para esta data
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="tipo">Tipo *</label>
          <select
            id="tipo"
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="presencial">Presencial</option>
            <option value="online">Online</option>
          </select>
        </div>

        {formData.tipo === 'online' && (
          <div className="form-group">
            <label htmlFor="link_meet">Link do Meet *</label>
            <input
              type="url"
              id="link_meet"
              name="link_meet"
              value={formData.link_meet}
              onChange={handleChange}
              required={formData.tipo === 'online'}
              disabled={loading}
              placeholder="https://meet.google.com/..."
            />
          </div>
        )}

        {editingId && (
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="agendada">Agendada</option>
              <option value="confirmada">Confirmada</option>
              <option value="cancelada">Cancelada</option>
              <option value="realizada">Realizada</option>
            </select>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="observacoes">Observações</label>
          <textarea
            id="observacoes"
            name="observacoes"
            value={formData.observacoes}
            onChange={handleChange}
            disabled={loading}
            rows="3"
            placeholder="Observações sobre a consulta..."
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

export default ConsultasForm;

