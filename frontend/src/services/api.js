const API_URL = 'http://localhost:5000/api';

const getAuthToken = () => localStorage.getItem('token');
const setAuthToken = (token) => localStorage.setItem('token', token);
const removeAuthToken = () => localStorage.removeItem('token');
const getUser = () => JSON.parse(localStorage.getItem('user') || '{}');
const setUser = (user) => localStorage.setItem('user', JSON.stringify(user));

// Auth Services
export const authService = {
  register: async (name, email, password) => {
    const response = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (!response.ok) throw new Error('Registration failed');
    const data = await response.json();
    setAuthToken(data.token);
    setUser(data.user);
    return data;
  },

  login: async (email, password) => {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error('Login failed');
    const data = await response.json();
    setAuthToken(data.token);
    setUser(data.user);
    return data;
  },

  logout: () => {
    removeAuthToken();
    localStorage.removeItem('user');
  },

  isAuthenticated: () => !!getAuthToken(),
};

// Incidents Services
export const incidentService = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/incidents`, {
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
    });
    if (!response.ok) throw new Error('Failed to fetch incidents');
    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_URL}/incidents/${id}`, {
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
    });
    if (!response.ok) throw new Error('Failed to fetch incident');
    return response.json();
  },

  create: async (title, description, severity, status) => {
    const response = await fetch(`${API_URL}/incidents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify({ title, description, severity, status }),
    });
    if (!response.ok) throw new Error('Failed to create incident');
    return response.json();
  },

  update: async (id, title, description, severity, status) => {
    const response = await fetch(`${API_URL}/incidents/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify({ title, description, severity, status }),
    });
    if (!response.ok) throw new Error('Failed to update incident');
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/incidents/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
    });
    if (!response.ok) throw new Error('Failed to delete incident');
  },
};

// Audit Log Services
export const auditService = {
  getIncidentLogs: async (incident_id) => {
    const response = await fetch(`${API_URL}/audit/incidents/${incident_id}/logs`, {
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
    });
    if (!response.ok) throw new Error('Failed to fetch audit logs');
    return response.json();
  },
};
