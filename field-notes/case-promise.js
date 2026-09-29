(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('.case-promise').forEach(banner => {
    const slides = Array.from(banner.querySelectorAll('.promise-slide'));
    const toggle = banner.querySelector('.promise-toggle');
    let index = 0, paused = reduced.matches, visible = false, timer;
    const sync = () => {
      clearInterval(timer);
      toggle.textContent = paused ? '▶' : 'Ⅱ';
      toggle.setAttribute('aria-label', paused ? '광고 문구 자동 전환 재생' : '광고 문구 자동 전환 일시정지');
      if (!paused && visible && !document.hidden) timer = setInterval(() => {
        slides[index].classList.remove('is-active');
        index = (index + 1) % slides.length;
        slides[index].classList.add('is-active');
      }, 2000);
    };
    toggle.addEventListener('click', () => { paused = !paused; sync(); });
    document.addEventListener('visibilitychange', sync);
    reduced.addEventListener('change', () => { paused = reduced.matches; sync(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }).observe(banner);
    } else { visible = true; }
    sync();
  });
})();
