// Menu Mobile Simples

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  const nav = header?.querySelector('nav');
  if (nav) {
    const btn = document.createElement('button');
    btn.id = 'menu-toggle';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Abrir menu');
    btn.innerHTML = 'Menu ☰';
    nav.insertBefore(btn, nav.children[1]);

    btn.addEventListener('click', () => {
      const aberto = header.classList.toggle('menu-aberto');
      btn.setAttribute('aria-expanded', aberto ? 'true' : 'false');
      btn.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
    });
  }

  // Máscaras simples (sem bibliotecas)
  const maskers = {
    cpf: v => v
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      .slice(0, 14),
    telefone: v => {
      v = v.replace(/\D/g, '').slice(0, 11);
      if (v.length <= 10) {
        return v
          .replace(/(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{4})(\d)/, '$1-$2');
      } else {
        return v
          .replace(/(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{5})(\d)/, '$1-$2');
      }
    },
    cep: v => v.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2').slice(0, 9)
  };

  const cpf = document.querySelector('#cpf');
  const tel = document.querySelector('#telefone');
  const cep = document.querySelector('#cep');
  if (cpf) cpf.addEventListener('input', e => e.target.value = maskers.cpf(e.target.value));
  if (tel) tel.addEventListener('input', e => e.target.value = maskers.telefone(e.target.value));
  if (cep) cep.addEventListener('input', e => e.target.value = maskers.cep(e.target.value));

  // Realce de validação (além do HTML5 nativo)
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', (e) => {
      // Deixa o HTML5 validar primeiro
      if (!form.checkValidity()) {
        e.preventDefault();
        // marca campos inválidos
        Array.from(form.elements).forEach(el => {
          if (el.willValidate) {
            el.classList.toggle('invalido', !el.checkValidity());
            el.classList.toggle('valido', el.checkValidity());
          }
        });
        const primeiroInvalido = form.querySelector('.invalido');
        if (primeiroInvalido) primeiroInvalido.focus();
      }
    });

    // feedback instantâneo ao mudar input
    form.addEventListener('input', (e) => {
      const el = e.target;
      if (el && el.willValidate) {
        el.classList.toggle('invalido', !el.checkValidity());
        el.classList.toggle('valido', el.checkValidity());
      }
    });
  }

  // Scroll suave para links âncora (se usado)
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const alvo = document.querySelector(a.getAttribute('href'));
      if (alvo) {
        e.preventDefault();
        alvo.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});