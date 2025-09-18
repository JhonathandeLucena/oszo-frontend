// URL base da API do backend no Render
const API_URL =
  process.env.REACT_APP_API_URL || "https://oszo-backend.onrender.com/api";

// Função genérica de requisição
async function request(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });

    // Se não for OK, captura o erro em texto (para não quebrar JSON)
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status} - ${text}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

//
// ====================== Pacientes ======================
//
export async function getPacientes() {
  return request("/pacientes");
}

export async function getPaciente(id) {
  return request(`/pacientes/${id}`);
}

export async function createPaciente(data) {
  return request("/pacientes", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updatePaciente(id, data) {
  return request(`/pacientes/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deletePaciente(id) {
  return request(`/pacientes/${id}`, {
    method: "DELETE",
  });
}

//
// ====================== Profissionais ======================
//
export async function getProfissionais() {
  return request("/profissionais");
}

export async function getProfissional(id) {
  return request(`/profissionais/${id}`);
}

export async function createProfissional(data) {
  return request("/profissionais", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateProfissional(id, data) {
  return request(`/profissionais/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteProfissional(id) {
  return request(`/profissionais/${id}`, {
    method: "DELETE",
  });
}

//
// ====================== Consultas ======================
//
export async function getConsultas() {
  return request("/consultas");
}

export async function getConsulta(id) {
  return request(`/consultas/${id}`);
}

export async function createConsulta(data) {
  return request("/consultas", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateConsulta(id, data) {
  return request(`/consultas/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteConsulta(id) {
  return request(`/consultas/${id}`, {
    method: "DELETE",
  });
}

export default {
  getPacientes,
  getPaciente,
  createPaciente,
  updatePaciente,
  deletePaciente,
  getProfissionais,
  getProfissional,
  createProfissional,
  updateProfissional,
  deleteProfissional,
  getConsultas,
  getConsulta,
  createConsulta,
  updateConsulta,
  deleteConsulta,
};
