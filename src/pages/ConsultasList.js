import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

function ConsultasList({ onEdit, onNew }) {
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadConsultas();
  }, []);

  const loadConsultas = async () => {
    try {
      setLoading(true);
      const data = await apiService.getConsultas();
      setConsultas(data);
      setError('');
    } catch (err) {
      setError('Erro ao carregar consultas: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta consulta?')) {
      try {
        await apiService.deleteConsulta(id);
        await loadConsultas();
      } catch (err) {
        setError('Erro ao excluir consulta: ' + err.message);
      }
    }
  };

  const handleEdit = (id) => {
    onEdit(id);
    onNew();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'agendada': return '#007bff';
      case 'confirmada': return '#28a745';
      case 'cancelada': return '#dc3545';
      case 'realizada': return '#6c757d';
      default: return '#333';
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="table-container">
      <div className="table-header">
        <h2>Consultas</h2>
        <button className="btn btn-primary" onClick={onNew}>
          Nova Consulta
        </button>
      </div>
      
      {error && <div className="error-message" style={{padding: '20px'}}>{error}</div>}
      
      {consultas.length === 0 ? (
        <div style={{padding: '20px', textAlign: 'center'}}>
          Nenhuma consulta agendada
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Profissional</th>
              <th>Data</th>
              <th>Hora</th>
              <th>Tipo</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {consultas.map(consulta => (
              <tr key={consulta.id}>
                <td>{consulta.paciente?.nome || 'N/A'}</td>
                <td>{consulta.profissional?.nome || 'N/A'}</td>
                <td>{formatDate(consulta.data)}</td>
                <td>{consulta.hora}</td>
                <td>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    backgroundColor: consulta.tipo === 'online' ? '#e3f2fd' : '#f3e5f5',
                    color: consulta.tipo === 'online' ? '#1976d2' : '#7b1fa2'
                  }}>
                    {consulta.tipo}
                  </span>
                </td>
                <td>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    backgroundColor: getStatusColor(consulta.status) + '20',
                    color: getStatusColor(consulta.status)
                  }}>
                    {consulta.status}
                  </span>
                </td>
                <td>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => handleEdit(consulta.id)}
                    style={{marginRight: '5px'}}
                  >
                    Editar
                  </button>
                  <button 
                    className="btn btn-danger" 
                    onClick={() => handleDelete(consulta.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ConsultasList;

