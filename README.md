# VIP da Nicolly

Site de página única (landing page) com planos VIP, pagamento via Mercado Pago e confirmação pelo WhatsApp.

## Estrutura
- `index.html` — página principal
- `assets/img/banner.jpg` — banner (1600x700 px)
- `assets/img/perfil.jpg` — foto de perfil (800x800 px)
- `assets/css/style.css` — estilos
- `termos.html` e `privacidade.html` — páginas legais
- `admin.html` + `content.json` — painel de administradores (textos, preços, links e fotos)
- `assets/img/favicon.svg` — ícone
- `assets/js/main.js` — verificação de idade +18
- `404.html`, `robots.txt`, `.nojekyll`

## Publicar no GitHub Pages
1. Envie todos os arquivos para o repositório (branch `main`).
2. Em **Settings → Pages**, escolha **Deploy from a branch**, branch `main`, pasta `/ (root)`.
3. Aguarde 1–2 minutos: o site fica em `https://SEU-USUARIO.github.io/NOME-DO-REPO/`.

## Para editar
- Preços e links de pagamento: procure `mpago.la` no `index.html`.
- WhatsApp: procure `wa.me` no `index.html`.
