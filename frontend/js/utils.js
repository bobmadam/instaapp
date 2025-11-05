const Utils = {
  getToken() {
    return localStorage.getItem('token');
  },
  setToken(token) {
    localStorage.setItem('token', token);
  },
  clearToken() {
    localStorage.removeItem('token');
  },
  isLoggedIn() {
    return !!localStorage.getItem('token');
  },
  requireAuth() {
    if (!this.isLoggedIn()) window.location.href = 'login.html';
  },
  getHeaders() {
    return {
      Authorization: 'Bearer ' + this.getToken(),
      'Content-Type': 'application/json'
    };
  },
};
window.Utils = Utils;
