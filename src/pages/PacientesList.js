import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

function PacientesList({ onEdit, onNew }) {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPacientes();
  }, []);

  const loadPacientes = async () => {
    try {
      setLoading(true);
      const data = await apiService.getPacientes();
      setPacientes(data);
      setError('');
    } catch (err) {
      setError('Erro ao carregar pacientes: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este paciente?')) {
      try {
        await apiService.deletePaciente(id);
        await loadPacientes();
      } catch (err) {
        setError('Erro ao excluir paciente: ' + err.message);
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

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="table-container">
      <div className="table-header">
        <h2>Pacientes</h2>
        <button className="btn btn-primary" onClick={onNew}>
          Novo Paciente
        </button>
      </div>
      
      {error && <div className="error-message" style={{padding: '20px'}}>{error}</div>}
      
      {pacientes.length === 0 ? (
        <div style={{padding: '20px', textAlign: 'center'}}>
          Nenhum paciente cadastrado
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Data Nascimento</th>
              <th>Telefone</th>
              <th>Email</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pacientes.map(paciente => (
              <tr key={paciente.id}>
                <td>{paciente.nome}</td>
                <td>{paciente.cpf}</td>
                <td>{formatDate(paciente.data_nascimento)}</td>
                <td>{paciente.telefone || '-'}</td>
                <td>{paciente.email || '-'}</td>
                <td>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => handleEdit(paciente.id)}
                    style={{marginRight: '5px'}}
                  >
                    Editar
                  </button>
                  <button 
                    className="btn btn-danger" 
                    onClick={() => handleDelete(paciente.id)}
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

export default PacientesList;

