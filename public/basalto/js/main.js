// Basalto · proposta de redesign. Sem dependências.
(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  // Imagens externas que falhem deixam ver o ícone que está por baixo.
  $$('.cat-img img').forEach((img) => {
    const drop = () => img.remove();
    if (img.complete && img.naturalWidth === 0) drop();
    else img.addEventListener('error', drop);
  });

  // ---- Tema claro/escuro (segue o sistema; o botão força o outro) ----
  const root = document.documentElement;
  const themeBtn = $('#theme-toggle');
  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* sem storage */ } },
  };
  const systemDark = matchMedia('(prefers-color-scheme: dark)');
  const isDark = () => (root.dataset.theme ? root.dataset.theme === 'dark' : systemDark.matches);
  const paintTheme = () => {
    const dark = isDark();
    themeBtn.setAttribute('aria-pressed', String(dark));
    $('use', themeBtn).setAttribute('href', dark ? '#i-sun' : '#i-moon');
  };
  const saved = store.get('basalto-tema');
  if (saved === 'dark' || saved === 'light') root.dataset.theme = saved;
  paintTheme();
  systemDark.addEventListener('change', paintTheme);
  themeBtn.addEventListener('click', () => {
    root.dataset.theme = isDark() ? 'light' : 'dark';
    store.set('basalto-tema', root.dataset.theme);
    paintTheme();
  });

  // ---- Menu: abre por clique/teclado (nunca só por hover), fecha com Esc ----
  const menuToggle = $('.menu-toggle');
  const nav = $('#menu-principal');
  const panelBtn = $('.has-panel > button');
  const panel = $('#painel-produtos');

  const setPanel = (open) => {
    panelBtn.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
  };
  const setMenu = (open) => {
    menuToggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('open', open);
    if (!open) setPanel(false);
  };

  panelBtn.addEventListener('click', () => setPanel(panel.hidden));
  menuToggle.addEventListener('click', () => setMenu(!nav.classList.contains('open')));

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!panel.hidden) { setPanel(false); panelBtn.focus(); }
    else if (nav.classList.contains('open')) { setMenu(false); menuToggle.focus(); }
  });
  document.addEventListener('click', (e) => {
    if (!panel.hidden && !e.target.closest('.has-panel')) setPanel(false);
  });
  nav.addEventListener('click', (e) => {
    if (e.target.closest('a')) setMenu(false);
  });

  // ---- Carrinho (demonstração) com anúncio para leitores de ecrã ----
  const count = $('#cart-count');
  const toast = $('#toast');
  let toastTimer;
  const say = (msg) => {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
  };
  $('#produtos').addEventListener('click', (e) => {
    const btn = e.target.closest('.add');
    if (!btn) return;
    count.textContent = String(Number(count.textContent) + 1);
    say(`${btn.dataset.name} adicionado ao carrinho`);
  });

  // ---- Formulário: erros em texto, ligados ao campo, foco no primeiro ----
  const form = $('#contact-form');
  const status = $('#form-status');
  const check = (input) => {
    const err = $(`#${input.getAttribute('aria-describedby')}`);
    const bad = !input.checkValidity();
    input.setAttribute('aria-invalid', String(bad));
    err.hidden = !bad;
    return !bad;
  };
  const required = $$('[required]', form);
  required.forEach((input) => {
    input.addEventListener('blur', () => { if (input.value || input.getAttribute('aria-invalid')) check(input); });
    input.addEventListener('input', () => { if (input.getAttribute('aria-invalid') === 'true') check(input); });
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    status.textContent = '';
    const invalid = required.filter((input) => !check(input));
    if (invalid.length) { invalid[0].focus(); return; }
    form.reset();
    required.forEach((input) => input.removeAttribute('aria-invalid'));
    status.textContent = 'Mensagem enviada (demonstração). Obrigado!';
  });
})();
