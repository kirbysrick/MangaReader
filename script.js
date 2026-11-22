(() => {
  'use strict';
  const data = window.MANGA;
  const $ = (id) => document.getElementById(id);
  const chapterSelect = $('chapterSelect');
  const modeSelect = $('modeSelect');
  const directionSelect = $('directionSelect');
  const reader = $('reader');
  const pageIndicator = $('pageIndicator');
  const prevButton = $('prevButton');
  const nextButton = $('nextButton');
  const chapterList = $('chapterList');
  const prefix = `manga-reader:${location.pathname}:`;
  const stored = (key, fallback) => { try { return localStorage.getItem(prefix + key) ?? fallback; } catch { return fallback; } };
  const save = (key, value) => { try { localStorage.setItem(prefix + key, String(value)); } catch {} };
  const chapters = Array.isArray(data?.chapters) ? data.chapters.filter(c => c && typeof c.id === 'string' && Array.isArray(c.pages)) : [];
  let chapterIndex = Math.max(0, chapters.findIndex(c => c.id === stored('chapter', chapters[0]?.id || '')));
  let pageIndex = 0;

  $('mangaTitle').textContent = data?.title || 'Manga Reader';
  document.title = `${data?.title || 'Manga'} | Manga Reader`;
  $('mangaDescription').textContent = data?.description || '';
  $('chapterCount').textContent = `${chapters.length} chapter${chapters.length === 1 ? '' : 's'}`;
  modeSelect.value = stored('mode', 'single') === 'vertical' ? 'vertical' : 'single';
  directionSelect.value = stored('direction', 'rtl') === 'ltr' ? 'ltr' : 'rtl';
  document.documentElement.dataset.theme = stored('theme', 'dark') === 'light' ? 'light' : 'dark';
  $('themeToggle').textContent = document.documentElement.dataset.theme === 'dark' ? '☀' : '☾';

  function progressKey(chapter) { return `page:${chapter.id}`; }
  function getPage(chapter) { const n = Number(stored(progressKey(chapter), '0')); return Number.isInteger(n) ? Math.max(0, Math.min(n, chapter.pages.length - 1)) : 0; }
  function setChapter(index, restorePage = true) {
    if (index < 0 || index >= chapters.length) return;
    chapterIndex = index;
    const chapter = chapters[chapterIndex];
    pageIndex = restorePage ? getPage(chapter) : 0;
    chapterSelect.value = chapter.id;
    save('chapter', chapter.id);
    render();
    document.querySelector('.reader-panel').scrollIntoView({behavior:'smooth', block:'start'});
  }
  function turn(delta) {
    const ch = chapters[chapterIndex];
    if (!ch || !ch.pages.length) return;
    const next = pageIndex + delta;
    if (next >= 0 && next < ch.pages.length) {
      pageIndex = next;
      save(progressKey(ch), pageIndex);
      renderPage();
    } else if (next >= ch.pages.length && chapterIndex + 1 < chapters.length) {
      setChapter(chapterIndex + 1, false);
    } else if (next < 0 && chapterIndex > 0) {
      setChapter(chapterIndex - 1, false);
      pageIndex = chapters[chapterIndex].pages.length - 1;
      save(progressKey(chapters[chapterIndex]), pageIndex);
      renderPage();
    }
  }
  function makeImage(src, number) {
    const image = document.createElement('img');
    image.src = src;
    image.alt = `Page ${number}`;
    image.loading = modeSelect.value === 'vertical' && number > 2 ? 'lazy' : 'eager';
    image.decoding = 'async';
    image.addEventListener('error', () => {
      const warning = document.createElement('div');
      warning.className = 'empty-state error-state';
      warning.textContent = `Could not load page ${number}: ${src}. Check the filename in manga.js (capitalization matters on GitHub Pages).`;
      image.replaceWith(warning);
    });
    return image;
  }
  function renderPage() {
    const ch = chapters[chapterIndex];
    reader.replaceChildren();
    reader.className = `reader ${modeSelect.value}`;
    if (!ch || !ch.pages.length) {
      const msg = document.createElement('div');
      msg.className = 'empty-state';
      msg.textContent = 'No pages yet. Add your images to manga.js.';
      reader.append(msg);
      pageIndicator.textContent = 'Page 0 / 0';
      prevButton.disabled = nextButton.disabled = true;
      return;
    }
    if (modeSelect.value === 'vertical') {
      ch.pages.forEach((src, i) => reader.append(makeImage(src, i + 1)));
    } else {
      reader.append(makeImage(ch.pages[pageIndex], pageIndex + 1));
    }
    pageIndicator.textContent = modeSelect.value === 'vertical' ? `${ch.pages.length} pages` : `Page ${pageIndex + 1} / ${ch.pages.length}`;
    prevButton.disabled = modeSelect.value === 'vertical' || (pageIndex === 0 && chapterIndex === 0);
    nextButton.disabled = modeSelect.value === 'vertical' || (pageIndex === ch.pages.length - 1 && chapterIndex === chapters.length - 1);
    prevButton.hidden = nextButton.hidden = modeSelect.value === 'vertical';
  }
  function renderChapters() {
    chapterList.replaceChildren();
    chapters.forEach((ch, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `chapter-item${index === chapterIndex ? ' active' : ''}`;
      const info = document.createElement('span');
      const title = document.createElement('strong');
      title.textContent = ch.title || ch.id;
      const small = document.createElement('small');
      small.textContent = `${ch.pages.length} page${ch.pages.length === 1 ? '' : 's'}`;
      info.append(title, small);
      const arrow = document.createElement('span');
      arrow.className = 'chapter-arrow';
      arrow.textContent = '›';
      button.append(info, arrow);
      button.addEventListener('click', () => setChapter(index));
      chapterList.append(button);
    });
  }
  function render() { renderPage(); renderChapters(); }
  chapters.forEach((ch) => {
    const option = document.createElement('option');
    option.value = ch.id;
    option.textContent = ch.title || ch.id;
    chapterSelect.append(option);
  });
  chapterSelect.addEventListener('change', () => setChapter(chapters.findIndex(ch => ch.id === chapterSelect.value)));
  modeSelect.addEventListener('change', () => { save('mode', modeSelect.value); renderPage(); });
  directionSelect.addEventListener('change', () => save('direction', directionSelect.value));
  $('themeToggle').addEventListener('click', () => {
    const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = theme;
    $('themeToggle').textContent = theme === 'dark' ? '☀' : '☾';
    save('theme', theme);
  });
  prevButton.addEventListener('click', () => turn(-1));
  nextButton.addEventListener('click', () => turn(1));
  document.addEventListener('keydown', (event) => {
    if (modeSelect.value !== 'single' || event.altKey || event.ctrlKey || event.metaKey || ['INPUT','TEXTAREA','SELECT','BUTTON'].includes(document.activeElement?.tagName)) return;
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const isNext = directionSelect.value === 'rtl' ? event.key === 'ArrowLeft' : event.key === 'ArrowRight';
    turn(isNext ? 1 : -1);
  });
  reader.addEventListener('click', event => {
    if (modeSelect.value !== 'single' || !event.target.closest('img')) return;
    const rect = reader.getBoundingClientRect();
    const clickLeft = event.clientX < rect.left + rect.width / 2;
    const isNext = directionSelect.value === 'rtl' ? clickLeft : !clickLeft;
    turn(isNext ? 1 : -1);
  });
  if (chapters.length) {
    chapterSelect.value = chapters[chapterIndex].id;
    pageIndex = getPage(chapters[chapterIndex]);
  }
  render();
})();
