// Tema claro/escuro com botão apenas ícone (sol/lua)
(function () {
  const STORAGE_KEY = 'theme';
  const root = document.documentElement;

  function getSavedTheme() {
    try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
  }
  function saveTheme(v) {
    try {
      if (v == null) localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, v);
    } catch { }
  }

  function prefersDark() { return false; }

  function applyTheme(theme) {
    if (theme === 'dark') root.setAttribute('data-theme', 'dark');
    else root.removeAttribute('data-theme');
    updateButton(theme === 'dark');
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      const bg = getComputedStyle(root).getPropertyValue('--bg').trim() || '#ffffff';
      meta.setAttribute('content', bg);
    }
  }

  function updateButton(isDark) {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    btn.innerHTML = isDark
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="currentColor"/></svg><span class="sr-only">Tema escuro</span>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3v2M12 19v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg><span class="sr-only">Tema claro</span>';
    btn.title = 'Trocar tema';
  }

  function init() {
    const btn = document.getElementById('theme-toggle');
    const saved = getSavedTheme();
    const startDark = saved ? saved === 'dark' : false; // padrão: claro
    applyTheme(startDark ? 'dark' : 'light');
    if (btn) {
      btn.addEventListener('click', () => {
        const nextDark = !(root.getAttribute('data-theme') === 'dark');
        saveTheme(nextDark ? 'dark' : 'light');
        applyTheme(nextDark ? 'dark' : 'light');
      });
    }
    // não seguir mais o tema do sistema
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();