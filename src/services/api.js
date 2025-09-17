const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://oszo-backend.onrender.com/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro na requisição');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Pacientes
  async getPacientes() {
    return this.request('/pacientes');
  }

  async getPaciente(id) {
    return this.request(`/pacientes/${id}`);
  }

  async createPaciente(data) {
    return this.request('/pacientes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePaciente(id, data) {
    return this.request(`/pacientes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePaciente(id) {
    return this.request(`/pacientes/${id}`, {
      method: 'DELETE',
    });
  }

  // Profissionais
  async getProfissionais() {
    return this.request('/profissionais');
  }

  async getProfissional(id) {
    return this.request(`/profissionais/${id}`);
  }

  async createProfissional(data) {
    return this.request('/profissionais', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProfissional(id, data) {
    return this.request(`/profissionais/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProfissional(id) {
    return this.request(`/profissionais/${id}`, {
      method: 'DELETE',
    });
  }

  // Consultas
  async getConsultas() {
    return this.request('/consultas');
  }

  async getConsulta(id) {
    return this.request(`/consultas/${id}`);
  }

  async createConsulta(data) {
    return this.request('/consultas', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateConsulta(id, data) {
    return this.request(`/consultas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteConsulta(id) {
    return this.request(`/consultas/${id}`, {
      method: 'DELETE',
    });
  }

  // Agenda
  async getSlots(profissionalId, data) {
    return this.request(`/scripts/agenda/slots?profissional_id=${profissionalId}&data=${data}`);
  }

  async createSlots(data) {
    return this.request('/scripts/agenda/slots', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export default new ApiService();

