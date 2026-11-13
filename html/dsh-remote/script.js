(() => {
  'use strict';
  const dialog = document.querySelector('#lightbox');
  const image = document.querySelector('#lightbox-image');
  let opener;
  document.querySelectorAll('[data-image]').forEach(button => {
    button.addEventListener('click', () => {
      opener = button;
      image.src = button.dataset.image;
      image.alt = button.dataset.title;
      document.querySelector('#lightbox-title').textContent = button.dataset.title;
      dialog.showModal();
      document.body.style.overflow = 'hidden';
      document.querySelector('.lightbox-body').scrollTop = 0;
    });
  });
  document.querySelector('#close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => { document.body.style.overflow = ''; opener?.focus({ preventScroll: true }); });
  let toastTimer;
  const notify = text => {
    const toast = document.querySelector('#toast');
    toast.textContent = text;
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 2800);
  };
  document.querySelector('#copy').addEventListener('click', async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText('dsh-remote-harness');
      notify('已复制插件包名');
    } catch {
      const range = document.createRange();
      range.selectNodeContents(document.querySelector('.copy-field code'));
      const selection = window.getSelection();
      selection.removeAllRanges(); selection.addRange(range);
      notify('请长按或按 Ctrl / ⌘ + C 复制已选中的包名');
    }
  });
  document.querySelector('#year').textContent = new Date().getFullYear();
  if ('IntersectionObserver' in window) {
    const links = [...document.querySelectorAll('.nav-link')];
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) links.forEach(link => {
        const active = link.hash === '#' + entry.target.id;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-15% 0px -65% 0px' });
    document.querySelectorAll('main > section').forEach(section => observer.observe(section));
  }
})();
