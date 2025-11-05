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

  function renderFeed(posts) {
    feed.innerHTML = '';
    posts.forEach((p) => {
        const likeCount = p.likes.length;
        const commentCount = p.comments.length;

        const commentsPreview = p.comments
        .slice(0, 2)
        .map(c => `<div class="comment"><b>@${c.user.username}</b> ${c.content}</div>`)
        .join('');

        const postHTML = `
        <div class="col-md-6 col-lg-5 mb-4">
            <div class="card">
            <img src="${CONFIG.IMAGE_BASE_URL}${p.image_url}" alt="post" class="card-img-top">
            <div class="card-body">
                <h6 class="fw-bold">@${p.user.username}</h6>
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
  });

  loadFeed();
});
