(() => {
  const button = document.querySelector('.case-share');
  if (!button) return;
  const status = document.createElement('div');
  status.className = 'case-share-status';
  status.setAttribute('role', 'status');
  status.hidden = true;
  document.body.appendChild(status);
  let timeout;
  function notify(message) {
    clearTimeout(timeout);
    status.textContent = message;
    status.hidden = false;
    timeout = setTimeout(() => { status.hidden = true; }, 3500);
  }
  function manualCopy(url) {
    const dialog = document.createElement('dialog');
    dialog.className = 'case-share-dialog';
    const label = document.createElement('label');
    label.textContent = '아래 링크를 복사해 공유해주세요.';
    const input = document.createElement('input');
    input.value = url;
    input.readOnly = true;
    input.setAttribute('aria-label', '공유할 현장사례 링크');
    label.appendChild(input);
    const close = document.createElement('button');
    close.type = 'button';
    close.textContent = '닫기';
    close.addEventListener('click', () => dialog.close());
    dialog.append(label, close);
    dialog.addEventListener('close', () => { dialog.remove(); button.focus(); });
    document.body.appendChild(dialog);
    dialog.showModal();
    input.select();
  }
  button.addEventListener('click', async () => {
    const url = document.querySelector('link[rel="canonical"]')?.href || location.href;
    const title = document.querySelector('h1')?.textContent.trim() || document.title;
    if (typeof navigator.share === 'function') {
      try { await navigator.share({ title, url }); return; }
      catch (error) { if (error.name === 'AbortError') return; }
    }
    try {
      await navigator.clipboard.writeText(url);
      notify('링크를 복사했습니다. 원하는 곳에 붙여넣어 주세요.');
    } catch { manualCopy(url); }
  });
})();
