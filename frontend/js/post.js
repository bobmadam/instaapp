document.addEventListener('DOMContentLoaded', () => {
  Utils.requireAuth();

  const form = document.querySelector('#createForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const res = await fetch(`${CONFIG.API_BASE_URL}/post/create`, {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + Utils.getToken() },
      body: formData,
    });
    const data = await res.json();
    if (data.status === 'success') {
      Swal.fire({
        icon: 'success',
        title: 'Post berhasil diunggah!',
        showConfirmButton: false,
        timer: 1200,
      }).then(() => window.location.href = 'index.html');
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Gagal mengunggah',
        text: 'Pastikan gambar dan caption valid.',
      });
    }
  });
});
