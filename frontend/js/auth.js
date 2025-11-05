// js/auth.js
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('#loginForm');
  const registerBtn = document.querySelector('#registerBtn');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const res = await fetch(`${CONFIG.API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    });
    const data = await res.json();
    if (data.token) {
      Utils.setToken(data.token);
      Swal.fire({
        icon: 'success',
        title: 'Berhasil login!',
        showConfirmButton: false,
        timer: 1200,
      }).then(() => {
        window.location.href = 'index.html';
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Login gagal',
        text: data.error || 'Periksa kembali username dan password Anda.',
      });
    }
  });

  registerBtn.addEventListener('click', async () => {
    const res = await fetch(`${CONFIG.API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    });
    const data = await res.json();
    if (data.status === 'success') {
      Swal.fire({
        icon: 'success',
        title: 'Akun berhasil dibuat!',
        text: 'Silakan login menggunakan akun Anda.',
        confirmButtonText: 'Oke',
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Registrasi gagal',
        text: data.message || 'Coba gunakan username lain.',
      });
    }
  });
});
