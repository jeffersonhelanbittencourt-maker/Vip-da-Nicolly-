# VIP da Nicolly — Nova versão (protótipo)

Todos os arquivos do site ficam na raiz, sem subpastas.

## Arquivos
- `index.html`, `style.css`, `app.js`: site público, planos, cadastro e login de demonstração.
- `admin.html`, `admin.css`, `admin.js`: painel local com visão geral, clientes, registros de pagamentos, configurações e administradores.
- `content.json`: cópia inicial dos textos, preços e links dos planos.
- `termos.html`, `privacidade.html`, `favicon.svg`, `404.html`, `robots.txt`.

## Publicar no GitHub Pages
1. Extraia o ZIP.
2. Envie todos os arquivos diretamente para a raiz do repositório (mesmo nível do `index.html`).
3. Em GitHub → Settings → Pages, escolha Deploy from a branch, branch `main`, pasta `/ (root)`.

## Importante — limitações desta versão
Esta entrega é um protótipo front-end para testar a navegação e o desenho do painel. GitHub Pages hospeda arquivos estáticos; por isso:
- Cadastros, sessão, administradores e registros ficam no `localStorage` do navegador/dispositivo. Não são compartilhados entre clientes ou administradores.
- Senhas ficam no navegador e NÃO devem ser usadas para contas reais. O login local é apenas demonstração.
- O painel não grava alterações no GitHub e não usa token.
- Os links atuais do Mercado Pago foram mantidos. O pagamento ainda é externo e a confirmação continua manual.
- Não há API privada, Pix automático, webhook, confirmação de pagamento, liberação automática do grupo, notificações ou banco de dados nesta versão.
- Não existe reconhecimento facial. A data de nascimento é usada apenas para bloquear cadastro de menores no protótipo; isso não é verificação formal de identidade.
- O convite do grupo pode ser preenchido nas configurações locais do painel, mas não é uma proteção real: sem backend não há como liberar conteúdo de forma segura após pagamento.

## Para transformar em produção
Será necessário um backend (por exemplo Supabase ou servidor próprio), autenticação segura, banco de dados, regras de acesso, integração oficial do Mercado Pago com credenciais guardadas somente no servidor e webhook validado. Nunca coloque access token, service role key ou senha administrativa em HTML/JavaScript público. Antes de publicar com dados reais, substitua as credenciais fracas já compartilhadas em conversas.
