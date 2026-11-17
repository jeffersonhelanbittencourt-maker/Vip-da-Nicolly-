(function () {
  var HASH = 'dcc36475479d5751c53aa5b2635cd829ba4e9e604e362d367d931ba996639344'; // sha256("usuario:senha")
  var $ = function (id) { return document.getElementById(id); };
  var K = 'vip-admin-gh', S = 'vip-admin-ok';
  var gh = {}; try { gh = JSON.parse(localStorage.getItem(K) || '{}'); } catch (e) {}
  var content = null;

  function msg(id, t, ok) { var e = $(id); e.textContent = t; e.className = 'msg ' + (ok === true ? 'ok' : ok === false ? 'err' : ''); }
  async function sha(t) { var b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(t)); return Array.from(new Uint8Array(b)).map(function (x) { return x.toString(16).padStart(2, '0'); }).join(''); }

  // ---------- Login ----------
  function show() { $('login').hidden = true; $('panel').hidden = false; init(); }
  if (sessionStorage.getItem(S) === '1') show();
  $('login-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    var h = await sha($('u').value.trim().toLowerCase() + ':' + $('p').value);
    if (h === HASH) { sessionStorage.setItem(S, '1'); show(); } else msg('login-msg', 'Usuário ou senha incorretos.', false);
  });
  $('logout').addEventListener('click', function () { sessionStorage.removeItem(S); location.reload(); });

  // ---------- GitHub API ----------
  function api(path, opt) {
    opt = opt || {};
    return fetch('https://api.github.com/repos/' + gh.owner + '/' + gh.repo + '/contents/' + path + (opt.method === 'PUT' || opt.method === 'DELETE' ? '' : '?ref=' + gh.branch), {
      method: opt.method || 'GET',
      headers: { 'Authorization': 'Bearer ' + gh.token, 'Accept': 'application/vnd.github+json', 'Content-Type': 'application/json' },
      body: opt.body ? JSON.stringify(opt.body) : undefined
    });
  }
  function ready() { if (!gh.owner || !gh.repo || !gh.token) { throw new Error('Preencha e salve a conexão com o GitHub (passo 1).'); } }
  async function getSha(path) { var r = await api(path); if (r.status === 404) return null; if (!r.ok) throw new Error('GitHub: erro ' + r.status + ' (confira o token e as permissões).'); return (await r.json()).sha; }
  async function putFile(path, b64, message) {
    ready(); var sha_ = await getSha(path);
    var r = await api(path, { method: 'PUT', body: { message: message, content: b64, branch: gh.branch, sha: sha_ || undefined } });
    if (!r.ok) throw new Error('Não foi possível salvar (erro ' + r.status + ').');
  }
  async function delFile(path, message) {
    ready(); var sha_ = await getSha(path); if (!sha_) throw new Error('Esse arquivo não existe no site.');
    var r = await api(path, { method: 'DELETE', body: { message: message, sha: sha_, branch: gh.branch } });
    if (!r.ok) throw new Error('Não foi possível remover (erro ' + r.status + ').');
  }
  var b64 = function (str) { return btoa(unescape(encodeURIComponent(str))); };

  // ---------- Conexão ----------
  function init() {
    if (!gh.owner && location.hostname.endsWith('.github.io')) { gh.owner = location.hostname.split('.')[0]; gh.repo = location.pathname.split('/')[1] || gh.owner + '.github.io'; }
    $('gh-owner').value = gh.owner || ''; $('gh-repo').value = gh.repo || ''; $('gh-branch').value = gh.branch || 'main'; $('gh-token').value = gh.token || '';
    loadContent(); loadPreviews();
  }
  $('gh-save').addEventListener('click', function () {
    gh = { owner: $('gh-owner').value.trim(), repo: $('gh-repo').value.trim(), branch: $('gh-branch').value.trim() || 'main', token: $('gh-token').value.trim() };
    try { localStorage.setItem(K, JSON.stringify(gh)); msg('gh-msg', 'Conexão salva neste navegador.', true); } catch (e) { msg('gh-msg', 'Não foi possível salvar.', false); }
  });
  $('gh-test').addEventListener('click', async function () {
    try { ready(); var r = await api('content.json'); msg('gh-msg', r.ok ? 'Conexão funcionando ✅' : 'Falhou (erro ' + r.status + '). Confira usuário, repositório, token e permissão Contents.', r.ok); } catch (e) { msg('gh-msg', e.message, false); }
  });

  // ---------- Conteúdo ----------
  async function loadContent() {
    try { content = await (await fetch('content.json', { cache: 'no-store' })).json(); } catch (e) { return; }
    $('f-hero').value = content.hero || ''; $('f-wa').value = content.whatsapp || ''; $('f-wa-label').value = content.whatsappLabel || ''; $('f-msg').value = content.mensagem || '';
    ['semanal', 'mensal', 'vitalicio'].forEach(function (k) { var p = (content.plans || {})[k] || {}; $('p-' + k + '-preco').value = p.preco || ''; $('p-' + k + '-link').value = p.link || ''; });
  }
  $('save-content').addEventListener('click', async function () {
    var b = this; b.disabled = true; msg('content-msg', 'Salvando...');
    try {
      content = content || { imgVersion: 1, plans: {} };
      content.hero = $('f-hero').value.trim(); content.whatsapp = $('f-wa').value.replace(/\D/g, ''); content.whatsappLabel = $('f-wa-label').value.trim(); content.mensagem = $('f-msg').value.trim();
      content.plans = {};
      ['semanal', 'mensal', 'vitalicio'].forEach(function (k) {
        var link = $('p-' + k + '-link').value.trim();
        if (link && !/^https:\/\//.test(link)) throw new Error('O link do plano ' + k + ' precisa começar com https://');
        content.plans[k] = { preco: $('p-' + k + '-preco').value.trim(), link: link };
      });
      await putFile('content.json', b64(JSON.stringify(content, null, 2) + '\n'), 'Admin: atualiza textos, preços e links');
      msg('content-msg', 'Salvo! O site atualiza em 1 a 2 minutos.', true);
    } catch (e) { msg('content-msg', e.message, false); }
    b.disabled = false;
  });

  // ---------- Fotos ----------
  var SPEC = { banner: { w: 1600, h: 700, name: 'banner.jpg' }, perfil: { w: 800, h: 800, name: 'perfil.jpg' } };
  function loadPreviews() { ['banner', 'perfil'].forEach(function (k) { $('prev-' + k).src = '' + SPEC[k].name + '?t=' + Date.now(); }); }
  function toJpeg(file, w, h) {
    return new Promise(function (res, rej) {
      var img = new Image(), url = URL.createObjectURL(file);
      img.onload = function () {
        var c = document.createElement('canvas'); c.width = w; c.height = h; var x = c.getContext('2d');
        var s = Math.max(w / img.width, h / img.height), dw = img.width * s, dh = img.height * s;
        x.fillStyle = '#070205'; x.fillRect(0, 0, w, h); x.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
        URL.revokeObjectURL(url); res(c.toDataURL('image/jpeg', 0.86).split(',')[1]);
      };
      img.onerror = function () { rej(new Error('Imagem inválida.')); }; img.src = url;
    });
  }
  async function bump() { content = content || { plans: {} }; content.imgVersion = (content.imgVersion || 1) + 1; await putFile('content.json', b64(JSON.stringify(content, null, 2) + '\n'), 'Admin: atualiza versão das imagens'); }
  document.querySelectorAll('[data-up]').forEach(function (btn) {
    btn.addEventListener('click', async function () {
      var k = btn.dataset.up, f = $('file-' + k).files[0]; if (!f) return msg('img-msg', 'Escolha uma foto primeiro.', false);
      btn.disabled = true; msg('img-msg', 'Enviando...');
      try { var data = await toJpeg(f, SPEC[k].w, SPEC[k].h); await putFile('' + SPEC[k].name, data, 'Admin: atualiza ' + SPEC[k].name); await bump(); msg('img-msg', 'Foto enviada! Aparece no site em 1 a 2 minutos.', true); } catch (e) { msg('img-msg', e.message, false); }
      btn.disabled = false;
    });
  });
  document.querySelectorAll('[data-del]').forEach(function (btn) {
    btn.addEventListener('click', async function () {
      var k = btn.dataset.del; if (!confirm('Remover a foto do ' + k + '?')) return;
      try { await delFile('' + SPEC[k].name, 'Admin: remove ' + SPEC[k].name); await bump(); msg('img-msg', 'Foto removida.', true); } catch (e) { msg('img-msg', e.message, false); }
    });
  });
})();
