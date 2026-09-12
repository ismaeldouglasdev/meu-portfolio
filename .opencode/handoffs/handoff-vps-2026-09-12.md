# Handoff — meu-portfolio → Agente VPS (2026-09-12)

> Sessão local: correções de UX + imagens do Cronograma no portfolio
> Repo: `https://github.com/ismaeldouglasdev/meu-portfolio.git` (branch `main`)
> Deploy: Vercel (`npx vercel --prod --yes`) → produção `ismaeltech.com` (alias de `meu-portfolio-nf4babx2v-ismaeldouglasdevs-projects.vercel.app`)

---

## 📌 Estado atual (commit `ce61fe9`, worktree limpo)

Último push: `ce61fe9` — "feat: typewriter mais rápida + hold maior (45ms/35ms/4s), animações suavizadas, capa Cronograma v2 cache-busting, Cache-Control imagens".

Tudo desta leva **já está deployado e verificado em produção**:
- Typewriter: `speed=45`, `deleteSpeed=30`, `pauseAfter=4000` em `src/components/Hero.tsx` (confirmado no bundle prod: `speed:45, deleteSpeed:30, pauseAfter:4e3`)
- Tooltip do glossário com fundo **sólido** `var(--bg-secondary)` (l.2675-2714 do `src/App.css`; verificado com hover real via Playwright: `rgb(245,245,245)`, opacity 1)
- Animações suavizadas (`translateY(8px)`, `cardFadeIn 0.35s ease forwards`, stagger 0.02s–0.34s)
- Capa Cronograma v2: `cronograma-ptbr-v2.webp` / `cronograma-en-v2.webp` (cache-busting — URLs novas, foi isso que destravou a atualização da imagem no live)

---

## 🔴 BUG ABERTO (diagnóstico 80%, correção NÃO feita ainda)

**Sintoma do usuário**: "a imagem do cronograma atualizou no portfolio live, mas só a imagem em inglês aparece, e ela ainda está com muito zoom."

**Diagnóstico concluído**:
1. **Idioma errado**: as 4 imagens de screenshot do Cronograma são ESSENCIALMENTE IDÊNTICAS e 100% em INGLÊS — inclusive `cronograma-ptbr-v2.webp` (que deveria ser PT-BR). Verificado por análise de conteúdo das imagens.
2. **Zoom/crop**: as v2 foram capturadas em viewport **mobile retrato 480×900**, mas o CSS do card usa `height: 180px; object-fit: cover; object-position: top` (src/App.css l.789-796) → crop brutal do topo = "zoom".
   - Os PNGs antigos (ago 17) eram **landscape corretos**: `cronograma-ptbr.png` 800×488 / `cronograma-en.png` 822×490 — proporção adequada ao card.
3. **Como o app Cronograma escolhe idioma** (importante para recapturar):
   - `localStorage['app_lang']` tem prioridade, depois `navigator.language`, default `pt-BR` (arquivo `app/static/i18n.js` do projeto Cronograma, função `getCurrentLang`)
   - Na última captura o `app_lang` estava `en`.

**Plano de correção (próximos passos)**:
1. Recapturar screenshots no site live `https://cronograma-projeto.onrender.com/` via Playwright com **viewport desktop landscape** (ex. 1280×800) e idioma forçado:
   - PT: setar `localStorage.setItem('app_lang','pt-BR')` + reload → capturar → salvar como `public/images/cronograma-ptbr-v3.webp`
   - EN: `localStorage.setItem('app_lang','en')` + reload → capturar → `public/images/cronograma-en-v3.webp`
   - ⚠️ **RECAPTURAR COM NOME v3** (NOVO nome de arquivo): o Cloudflare serve `max-age=2592000` (30 dias) nas imagens — sobrescrever v2 não atualizaria para quem já cacheou. Precisamos de outra URL nova (v3).
2. Atualizar `src/components/Projetos.tsx` → `projectScreenshots['Cronograma-Projeto'] = { pt: '/images/cronograma-ptbr-v3.webp', en: '/images/cronograma-en-v3.webp' }`.
3. `npm run build` (deve gerar 44 páginas estáticas), `git commit` + `git push`, `npx vercel --prod --yes`.
4. Verificar em produção (curl nos v3 + conferir idioma/enquadramento).

**Estado da captura no momento do handoff**: Playwright já estava aberto em `https://cronograma-projeto.onrender.com/`, viewport 1280×800, `app_lang` já setado para `pt-BR` (retornou "pt-BR"). Próxima ação lógica: scroll até o topo, reload para aplicar PT, verificar título PT ("Seus estudos, com disciplina"), tirar screenshot, salvar PNG, converter para webp (~76KB, qualidade boa, landscape).

---

## 🔑 SECRET/TOKENS (importante para o agente VPS)

- **Token GitHub atual do gh CLI**: válido (HTTP 200, `ismaeldouglasdev`), escopos `gist, read:org, repo, workflow`. Guardado em `~/.config/gh/hosts.yml`. Usado dinamicamente por `~/.bashrc:132` → `export GITHUB_PERSONAL_ACCESS_TOKEN="$(gh auth token 2>/dev/null)"`.
- **Token GitHub NOVO fornecido pelo usuário nesta sessão**: `<TOKEN_GH_NOVO — obter com o usuario>` — válido (HTTP 200, `ismaeldouglasdev`) mas com escopo **apenas `repo`**. Tentativa de `gh auth login --with-token` FALHOU: `error validating token: missing required scope 'read:org'`. → **NÃO substituir o token do gh CLI com este token** (quebraría o gh). Se o usuário quer rotacionar, o novo token precisa ter `read:org` + `repo` + `workflow` (e idealmente `gist`).
- **Token Cloudflare**: `CLOUDFLARE_API_TOKEN` (id `c1bbad070bbc839fd2a9d0a462d15ac9`) **expirado em 2026-08-31** (imutável — precisa criar NOVO token no dashboard; permissões recomendadas: Zone > Cache Purge > Purge + Zone > Zone > Read). Arquivo: `meu-portfolio/.env.cloudflare` (zone id `d58a0d33631519aa807ff31e21459853`, zone name `ismaieltech.com`).
  - Alternativa em investigação: OAuth do wrangler já existe em `~/.config/.wrangler/config/default.toml` (campo `oauth_token`) → `npx wrangler cache purge --zone-id=... --urls=...` pode funcionar sem novo API token. `npx wrangler whoami` ainda não retornou output (wrangler@4.131.1 estava sendo instalado via npx) — tentar de novo.
- .env do portfolio: `meu-portfolio/.env` (131B, chaves `VITE_STRIPE_PUBLISHABLE_KEY`, `VITE_API_URL`, `VITE_TURNSTILE_SITEKEY`). **NUNCA commitar .env**.

---

## ⚙️ Comandos úteis

```bash
# Build + deploy
npm run build
npx vercel --prod --yes

# Push
git add -A && git commit -m "..." && git push origin main

# Purgar cache Cloudflare (se OAuth wrangler funcionar)
npx wrangler whoami
npx wrangler cache purge --zone-id=d58a0d33631519aa807ff31e21459853 --urls=https://ismaeltech.com/images/cronograma-ptbr.webp
```

## 🗂️ Arquivos-chave
- `src/components/Hero.tsx` (l.34 — typewriter)
- `src/components/Projetos.tsx` (l.44-54 — projectScreenshots; l.158-162 — seleção pt/en por `lang`)
- `src/components/Typewriter.tsx` (lógica rAF da digitação)
- `src/App.css` (l.789-796 screenshot; l.2675-2714 tooltip; l.1379-1431 animações)
- `public/images/cronograma-{ptbr,en}[-v2].webp` + PNGs
- `vercel.json` (regra Cache-Control imagens — NOTA: em produção o Cloudflare sobrescreve com `max-age=2592000`)

## 📅 Contexto rápido da sessão
Sessão começou retomando o fluxo de renovação de token (Cloudflare). Usuário então reportou o bug da imagem do Cronograma (inglês + zoom). Diagnóstico concluído; correção interrompida para gerar este handoff. Tarefas pendentes → ver "🔴 BUG ABERTO" acima + seção tokens.
