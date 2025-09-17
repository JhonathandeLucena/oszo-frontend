import React, { useState } from 'react';
import './App.css';

// Páginas
import PacientesList from './pages/PacientesList';
import PacientesForm from './pages/PacientesForm';
import ProfissionaisList from './pages/ProfissionaisList';
import ProfissionaisForm from './pages/ProfissionaisForm';
import ConsultasList from './pages/ConsultasList';
import ConsultasForm from './pages/ConsultasForm';
import Agenda from './pages/Agenda';

function App() {
  const [currentPage, setCurrentPage] = useState('pacientes');
  const [editingId, setEditingId] = useState(null);

  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'pacientes':
        return <PacientesList onEdit={handleEdit} onNew={() => setCurrentPage('pacientes-form')} />;
      case 'pacientes-form':
        return <PacientesForm editingId={editingId} onCancel={() => { setCurrentPage('pacientes'); handleCancelEdit(); }} />;
      case 'profissionais':
        return <ProfissionaisList onEdit={handleEdit} onNew={() => setCurrentPage('profissionais-form')} />;
      case 'profissionais-form':
        return <ProfissionaisForm editingId={editingId} onCancel={() => { setCurrentPage('profissionais'); handleCancelEdit(); }} />;
      case 'consultas':
        return <ConsultasList onEdit={handleEdit} onNew={() => setCurrentPage('consultas-form')} />;
      case 'consultas-form':
        return <ConsultasForm editingId={editingId} onCancel={() => { setCurrentPage('consultas'); handleCancelEdit(); }} />;
      case 'agenda':
        return <Agenda />;
      default:
        return <PacientesList onEdit={handleEdit} onNew={() => setCurrentPage('pacientes-form')} />;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Sistema de Agendamento Médico</h1>
        <nav>
          <button 
            className={currentPage.startsWith('pacientes') ? 'active' : ''}
            onClick={() => { setCurrentPage('pacientes'); handleCancelEdit(); }}
          >
            Pacientes
          </button>
          <button 
            className={currentPage.startsWith('profissionais') ? 'active' : ''}
            onClick={() => { setCurrentPage('profissionais'); handleCancelEdit(); }}
          >
            Profissionais
          </button>
          <button 
            className={currentPage.startsWith('consultas') ? 'active' : ''}
            onClick={() => { setCurrentPage('consultas'); handleCancelEdit(); }}
          >
            Consultas
          </button>
          <button 
            className={currentPage === 'agenda' ? 'active' : ''}
            onClick={() => { setCurrentPage('agenda'); handleCancelEdit(); }}
          >
            Agenda
          </button>
        </nav>
      </header>
      <main>
        {renderPage()}
      </main>
    </div>
  );
}

export default App;

