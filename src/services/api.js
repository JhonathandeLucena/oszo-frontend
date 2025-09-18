const API_BASE = "https://oszo-backend.onrender.com/api";

async function request(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Erro na requisição");
    }
    if (res.status === 204) return null;
    return res.json();
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
}

export default {
  getPacientes: () => request("/pacientes"),
  getPaciente: (id) => request(`/pacientes/${id}`),
  createPaciente: (data) =>
    request("/pacientes", { method: "POST", body: JSON.stringify(data) }),
  updatePaciente: (id, data) =>
    request(`/pacientes/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deletePaciente: (id) => request(`/pacientes/${id}`, { method: "DELETE" }),

  getProfissionais: () => request("/profissionais"),
  getProfissional: (id) => request(`/profissionais/${id}`),
  createProfissional: (data) =>
    request("/profissionais", { method: "POST", body: JSON.stringify(data) }),
  updateProfissional: (id, data) =>
    request(`/profissionais/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteProfissional: (id) => request(`/profissionais/${id}`, { method: "DELETE" }),

  getConsultas: () => request("/consultas"),
  getConsulta: (id) => request(`/consultas/${id}`),
  createConsulta: (data) =>
    request("/consultas", { method: "POST", body: JSON.stringify(data) }),
  updateConsulta: (id, data) =>
    request(`/consultas/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteConsulta: (id) => request(`/consultas/${id}`, { method: "DELETE" }),
};
