document.addEventListener('DOMContentLoaded', async () => {
  Utils.requireAuth();
  const feed = document.querySelector('#feed');

  async function loadFeed() {
    feed.innerHTML = '<p class="text-center text-muted mt-4">Loading...</p>';
    const res = await fetch(`${CONFIG.API_BASE_URL}/post`, {
      headers: Utils.getHeaders(),
    });
    const posts = await res.json();
    renderFeed(posts);
  }

  async function renderFeed(posts) {
    feed.innerHTML = '';
    const token = Utils.getToken();
    const payload = token ? JSON.parse(atob(token.split('.')[1])) : {};
    const currentUserId = payload?.uid;

    posts.forEach((p) => {
      const likeCount = p.likes.length;
      const commentCount = p.comments.length;
      const isMine = p.user.id === currentUserId;

      const commentsPreview = p.comments
        .slice(0, 2)
        .map(c => `
          <div class="comment d-flex justify-content-between align-items-center">
            <span><b>@${c.user.username}</b> ${c.content}</span>
            ${c.user.id === currentUserId
              ? `<button class="btn btn-sm btn-outline-danger btn-delete-comment" data-id="${c.id}">🗑</button>`
              : ''
            }
          </div>
        `).join('');

      const postHTML = `
        <div class="col-md-6 col-lg-5 mb-4">
          <div class="card">
            <img src="${CONFIG.IMAGE_BASE_URL}${p.image_url}" alt="post" class="card-img-top">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="fw-bold mb-0">@${p.user.username}</h6>
                ${isMine ? `<button class="btn btn-sm btn-outline-danger btn-delete-post" data-id="${p.id}">Hapus</button>` : ''}
              </div>
              <p>${p.caption || ''}</p>
              <div class="d-flex align-items-center gap-2">
                <button class="btn btn-sm btn-outline-primary btn-like" data-id="${p.id}">
                  ❤️ ${likeCount}
                </button>
                <button class="btn btn-sm btn-outline-secondary btn-comment" data-id="${p.id}">
                  💬 ${commentCount}
                </button>
              </div>
              <div id="comments-${p.id}" class="mt-3 comment-section">${commentsPreview}</div>
            </div>
          </div>
        </div>`;
      feed.insertAdjacentHTML('beforeend', postHTML);
    });
  }


  feed.addEventListener('click', async (e) => {
    if (e.target.classList.contains('btn-like')) {
      const id = e.target.dataset.id;
      await fetch(`${CONFIG.API_BASE_URL}/like/toggle?post_id=${id}`, {
        method: 'POST',
        headers: Utils.getHeaders(),
      });
      loadFeed();
    }

    if (e.target.classList.contains('btn-comment')) {
      const id = e.target.dataset.id;
      const res = await fetch(`${CONFIG.API_BASE_URL}/comment?post_id=${id}`, {
        headers: Utils.getHeaders(),
      });
      const comments = await res.json();
      const commentHTML = comments.map(
        (c) => `<p><b>@${c.user.username}</b>: ${c.content}</p>`
      ).join('');
      document.querySelector(`#comments-${id}`).innerHTML = `
        ${commentHTML}
        <div class="input-group mt-2">
          <input class="form-control comment-input" placeholder="Tulis komentar..." data-id="${id}">
          <button class="btn btn-primary btn-send-comment" data-id="${id}">Kirim</button>
        </div>`;
    }

    if (e.target.classList.contains('btn-send-comment')) {
      const id = e.target.dataset.id;
      const input = document.querySelector(`.comment-input[data-id="${id}"]`);
      if (!input.value.trim()) return;
      await fetch(`${CONFIG.API_BASE_URL}/comment/create?post_id=${id}`, {
        method: 'POST',
        headers: Utils.getHeaders(),
        body: JSON.stringify({ content: input.value }),
      });
      input.value = '';
      loadFeed();
    }

    if (e.target.classList.contains('btn-delete-post')) {
      const id = e.target.dataset.id;
      const confirm = await Swal.fire({
        icon: 'warning',
        title: 'Hapus postingan ini?',
        text: 'Tindakan ini tidak dapat dibatalkan.',
        showCancelButton: true,
        confirmButtonText: 'Ya, hapus',
        cancelButtonText: 'Batal',
      });
      if (confirm.isConfirmed) {
        const res = await fetch(`${CONFIG.API_BASE_URL}/post/delete?id=${id}`, {
          method: 'POST',
          headers: Utils.getHeaders(),
        });
        const data = await res.json();
        if (data.status === 'deleted') {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Postingan dihapus',
            showConfirmButton: false,
            timer: 1200,
          });
          loadFeed();
        } else {
          Swal.fire({ icon: 'error', title: 'Gagal menghapus post' });
        }
      }
    }

    if (e.target.classList.contains('btn-delete-comment')) {
      const id = e.target.dataset.id;
      const confirm = await Swal.fire({
        icon: 'warning',
        title: 'Hapus komentar ini?',
        showCancelButton: true,
        confirmButtonText: 'Ya, hapus',
        cancelButtonText: 'Batal',
      });
      if (confirm.isConfirmed) {
        const res = await fetch(`${CONFIG.API_BASE_URL}/comment/delete?id=${id}`, {
          method: 'POST',
          headers: Utils.getHeaders(),
        });
        const data = await res.json();
        if (data.status === 'deleted') {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Komentar dihapus',
            showConfirmButton: false,
            timer: 1200,
          });
          loadFeed();
        } else {
          Swal.fire({ icon: 'error', title: 'Gagal menghapus komentar' });
        }
      }
    }
  });

  loadFeed();
});
