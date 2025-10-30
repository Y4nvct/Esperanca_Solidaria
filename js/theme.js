document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;

  function getSystemPrefersDark() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
    updateToggleButton();
  }

  function currentTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return getSystemPrefersDark() ? 'dark' : 'light';
  }

  function toggleTheme() {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    applyTheme(next);
  }

  function updateToggleButton() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    const isDark = currentTheme() === 'dark';
    btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    btn.textContent = isDark ? 'Tema: Escuro 🌙' : 'Tema: Claro ☀️';
    btn.title = 'Trocar tema';
  }

  const btn = document.getElementById('theme-toggle');
  if (btn) {
    btn.addEventListener('click', () => toggleTheme());
  }

  // Aplica tema inicial
  applyTheme(currentTheme());

  // Observa mudanças do sistema quando não há preferência salva
  if (!localStorage.getItem('theme') && window.matchMedia) {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener?.('change', () => applyTheme(currentTheme()));
  }
});

// js/theme.js

(function () {
  const STORAGE_KEY = 'esperanca_theme'; // chave localStorage
  const root = document.documentElement;
  const btn = document.getElementById('theme-toggle');

  // Aplica o tema no DOM: 'dark' ou remove (clear => segue sistema)
  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else if (theme === 'light') {
      root.removeAttribute('data-theme');
      // opcional: setAttribute('data-theme','light') se preferir
    } else {
      // 'system' or null: remove atributo para cair no @media (prefers-color-scheme)
      root.removeAttribute('data-theme');
    }
    updateButton(theme);
    // atualiza meta theme-color (barra de endereço mobile)
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      const color = theme === 'dark' ? getComputedStyle(root).getPropertyValue('--bg').trim() : getComputedStyle(root).getPropertyValue('--bg').trim();
      meta.setAttribute('content', color || '#ffffff');
    }
  }

  // Atualiza texto/estado do botão (acessibilidade)
  function updateButton(theme) {
    if (!btn) return;
    const pressed = theme === 'dark' ? 'true' : 'false';
    btn.setAttribute('aria-pressed', pressed);
    // atualizar ícone/label
    btn.innerHTML = theme === 'dark'
      ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="currentColor"/></svg><span class="sr-only">Tema escuro</span>`
      : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3v2M12 19v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path></svg><span class="sr-only">Tema claro</span>`;
  }

  // Obter tema salvo, ou null
  function getSavedTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  // Salvar preferencia
  function saveTheme(theme) {
    try {
      if (theme === null) localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) { }
  }

  // Inicialização: aplica preferencia (saved > system)
  function init() {
    const saved = getSavedTheme();
    if (saved === 'dark' || saved === 'light' || saved === 'system') {
      applyTheme(saved === 'system' ? null : saved);
    } else {
      // follow system (remove attribute and let @media decide)
      applyTheme(null);
    }

    if (!btn) return;

    btn.addEventListener('click', function () {
      // alterna: if currently dark -> set light, else set dark
      const current = getSavedTheme() || (root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
      const next = current === 'dark' ? 'light' : 'dark';
      saveTheme(next);
      applyTheme(next);
    });

    // Permite troca por teclado (Enter/Space já fazem click)
  }

  // Wait DOM loaded if script isn't deferred
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();