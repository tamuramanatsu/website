(() => {
  const first = 8;
  const last = 13;
  const image = document.querySelector('#page-image');
  const status = document.querySelector('#page-status');
  const previous = document.querySelector('#previous');
  const next = document.querySelector('#next');
  const error = document.querySelector('#load-error');
  let page = first;
  const filename = number => `page-${String(number).padStart(2, '0')}.webp`;
  const readHash = () => {
    const match = /^#p=(\d+)$/.exec(location.hash);
    return match ? Math.max(first, Math.min(last, Number(match[1]))) : first;
  };
  function show(number, updateHash = true) {
    page = Math.max(first, Math.min(last, number));
    error.hidden = true;
    image.src = filename(page);
    image.alt = `『不完全な三角形』「まずは手縫いから」本文${page}ページ`;
    status.replaceChildren(document.createTextNode(`p.${page} `));
    const count = document.createElement('span');
    count.textContent = `${page - first + 1} / ${last - first + 1}`;
    status.append(count);
    previous.disabled = page === first;
    next.disabled = page === last;
    // Hashes also work when opened directly from the filesystem.
    if (updateHash && location.hash !== `#p=${page}`) location.replace(`#p=${page}`);
    if (page < last) { const preload = new Image(); preload.src = filename(page + 1); }
  }
  previous.addEventListener('click', () => show(page - 1));
  next.addEventListener('click', () => show(page + 1));
  document.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName) || event.target.isContentEditable) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      show(page + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  window.addEventListener('hashchange', () => { if (readHash() !== page) show(readHash(), false); });
  image.addEventListener('error', () => { error.hidden = false; });
  image.addEventListener('load', () => { error.hidden = true; });
  document.querySelector('.reader-controls').hidden = false;
  show(readHash(), false);
})();
