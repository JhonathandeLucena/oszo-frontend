import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

function ProfissionaisList({ onEdit, onNew }) {
  const [profissionais, setProfissionais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProfissionais();
  }, []);

  const loadProfissionais = async () => {
    try {
      setLoading(true);
      const data = await apiService.getProfissionais();
      setProfissionais(data);
      setError('');
    } catch (err) {
      setError('Erro ao carregar profissionais: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este profissional?')) {
      try {
        await apiService.deleteProfissional(id);
        await loadProfissionais();
      } catch (err) {
        setError('Erro ao excluir profissional: ' + err.message);
      }
    }
  };

  const handleEdit = (id) => {
    onEdit(id);
    onNew();
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="table-container">
      <div className="table-header">
        <h2>Profissionais</h2>
        <button className="btn btn-primary" onClick={onNew}>
          Novo Profissional
        </button>
      </div>
      
      {error && <div className="error-message" style={{padding: '20px'}}>{error}</div>}
      
      {profissionais.length === 0 ? (
        <div style={{padding: '20px', textAlign: 'center'}}>
          Nenhum profissional cadastrado
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Especialidade</th>
              <th>CRM</th>
              <th>Telefone</th>
              <th>Email</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {profissionais.map(profissional => (
              <tr key={profissional.id}>
                <td>{profissional.nome}</td>
                <td>{profissional.especialidade}</td>
                <td>{profissional.crm}</td>
                <td>{profissional.telefone || '-'}</td>
                <td>{profissional.email || '-'}</td>
                <td>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => handleEdit(profissional.id)}
                    style={{marginRight: '5px'}}
                  >
                    Editar
                  </button>
                  <button 
                    className="btn btn-danger" 
                    onClick={() => handleDelete(profissional.id)}
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

export default ProfissionaisList;

