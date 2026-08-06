const API_URL = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

const api = {
  get: async (endpoint) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return res.json();
  },

  post: async (endpoint, data) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  put: async (endpoint, data) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  delete: async (endpoint) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return res.json();
  }
};

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

function isLoggedIn() {
  return !!getToken();
}

function isAdmin() {
  const user = getUser();
  return user && user.role === 'admin';
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login.html';
}