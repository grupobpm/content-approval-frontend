const API_BASE_URL = 'https://3000-i9z8akoqy2wyrn78voppt-f7c441f1.manusvm.computer/api';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
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
      console.error('Erro na API:', error);
      throw error;
    }
  }

  // Métodos de autenticação
  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (data.token) {
      this.setToken(data.token);
    }
    
    return data;
  }

  async register(userData) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (data.token) {
      this.setToken(data.token);
    }
    
    return data;
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.setToken(null);
    }
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Métodos de cards de conteúdo
  async getContentCards(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/content-cards?${queryString}` : '/content-cards';
    return this.request(endpoint);
  }

  async getContentCard(id) {
    return this.request(`/content-cards/${id}`);
  }

  async createContentCard(cardData) {
    return this.request('/content-cards', {
      method: 'POST',
      body: JSON.stringify(cardData),
    });
  }

  async updateContentCard(id, cardData) {
    return this.request(`/content-cards/${id}`, {
      method: 'PUT',
      body: JSON.stringify(cardData),
    });
  }

  async approveContentCard(id, status, comments = '') {
    return this.request(`/content-cards/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ status, comments }),
    });
  }

  async deleteContentCard(id) {
    return this.request(`/content-cards/${id}`, {
      method: 'DELETE',
    });
  }

  // Métodos de comentários
  async getComments(cardId) {
    return this.request(`/content-cards/${cardId}/comments`);
  }

  async addComment(cardId, text, isInternal = false, parentComment = null) {
    return this.request(`/content-cards/${cardId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ text, isInternal, parentComment }),
    });
  }

  // Métodos de usuários
  async getUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/users?${queryString}` : '/users';
    return this.request(endpoint);
  }

  async searchUsers(query) {
    return this.request(`/users/search?q=${encodeURIComponent(query)}`);
  }

  async updateUser(id, userData) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async changePassword(id, currentPassword, newPassword) {
    return this.request(`/users/${id}/password`, {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }
}

export const apiClient = new ApiClient();
export default apiClient;

