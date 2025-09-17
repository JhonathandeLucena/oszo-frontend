import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

function Agenda() {
  const [profissionais, setProfissionais] = useState([]);
  const [selectedProfissional, setSelectedProfissional] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProfissionais();
  }, []);

  useEffect(() => {
    if (selectedProfissional && selectedDate) {
      loadSlots();
    } else {
      setSlots([]);
    }
  }, [selectedProfissional, selectedDate]);

  const loadProfissionais = async () => {
    try {
      const data = await apiService.getProfissionais();
      setProfissionais(data);
    } catch (err) {
      setError('Erro ao carregar profissionais: ' + err.message);
    }
  };

  const loadSlots = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiService.getSlots(selectedProfissional, selectedDate);
      setSlots(data.slots || []);
    } catch (err) {
      setError('Erro ao carregar horários: ' + err.message);
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleProfissionalChange = (e) => {
    setSelectedProfissional(e.target.value);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const selectedProfissionalData = profissionais.find(p => p.id == selectedProfissional);

  return (
    <div className="agenda-container">
      <h2>Agenda de Horários</h2>
      
      <div className="agenda-filters">
        <div className="form-group">
          <label htmlFor="profissional">Profissional</label>
          <select
            id="profissional"
            value={selectedProfissional}
            onChange={handleProfissionalChange}
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
          <label htmlFor="data">Data</label>
          <input
            type="date"
            id="data"
            value={selectedDate}
            onChange={handleDateChange}
          />
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {selectedProfissionalData && selectedDate && (
        <div style={{marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px'}}>
          <h3>Agenda de {selectedProfissionalData.nome}</h3>
          <p><strong>Especialidade:</strong> {selectedProfissionalData.especialidade}</p>
          <p><strong>Data:</strong> {formatDate(selectedDate)}</p>
        </div>
      )}

      {loading && <div>Carregando horários...</div>}

      {!loading && selectedProfissional && selectedDate && (
        <div>
          <h4>Horários Disponíveis</h4>
          {slots.length === 0 ? (
            <div style={{padding: '20px', textAlign: 'center', color: '#666'}}>
              Nenhum horário disponível para esta data
            </div>
          ) : (
            <div className="slots-grid">
              {slots.map(slot => (
                <div 
                  key={slot.id} 
                  className={`slot-item ${slot.disponivel ? 'available' : 'unavailable'}`}
                >
                  <div style={{fontWeight: 'bold'}}>{slot.hora_inicio}</div>
                  <div style={{fontSize: '12px', marginTop: '5px'}}>
                    {slot.disponivel ? 'Disponível' : 'Ocupado'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!selectedProfissional && !selectedDate && (
        <div style={{padding: '40px', textAlign: 'center', color: '#666'}}>
          Selecione um profissional e uma data para visualizar os horários disponíveis
        </div>
      )}
    </div>
  );
}

export default Agenda;

