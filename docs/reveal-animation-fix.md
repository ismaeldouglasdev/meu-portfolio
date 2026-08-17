# Fix: Conteúdo em branco após a seção Hero (ismaeltech.com)

> **Sintoma:** O portfólio carregava a Hero normalmente, mas todas as seções
> abaixo dela (Sobre, Processo, Serviços, Skills, Projetos, etc.) apareciam
> **em branco / invisíveis**.
>
> **Causa raiz:** O CSS define `opacity: 0` para todas as `<section>` que não
> são `#hero`, e depende de uma classe `.visible` para revelá-las. **Nenhum
> JavaScript adicionava essa classe** — então as seções ficavam permanentemente
> invisíveis.

---

## 1. Onde o bug mora

**Arquivo:** `src/App.css` (bloco "Scroll Animations", ~linha 1238)

```css
/* ----- Scroll Animations ----- */
section:not(#hero) {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

section:not(#hero).visible {
  opacity: 1;
  transform: translateY(0);
}
```

Há dezenas de regras em cascata (`section.visible .servico-card`, `section.visible
.skill-item`, etc.) que animam os cards filhos **somente quando a seção pai tem
`.visible`**. Sem a classe, tudo some.

> ⚠️ Não confundir: há um `@media (prefers-reduced-motion: reduce)` logo abaixo
> que força `opacity: 1`. Ou seja, o bug **não** aparece para usuários com
> "reducir movimento" ativo no SO — só para o fluxo normal. Por isso é fácil
> passar batido em testes manuais.

---

## 2. O que faltava

Nenhum componente (`Sobre`, `Processo`, `Servicos`, `Skills`, `Projetos`,
`Depoimentos`, `Experiencia`, `Precos`, `Beneficios`, `Contato`) adiciona a
classe `.visible`. O `useEffect` existente em `HomePage` (`src/App.tsx`) só
tratava deep-link por hash/sessionStorage — **não** observava scroll.

---

## 3. A correção

Adicionado um `IntersectionObserver` em `src/App.tsx` (dentro de `HomePage`),
que adiciona/remove `.visible` conforme a seção entra/sai da viewport:

```tsx
useEffect(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('section:not(#hero)').forEach((sec) => {
    observer.observe(sec);
  });

  return () => {
    observer.disconnect();
  };
}, []);
```

`threshold: 0.1` => dispara quando 10% da seção está visível. Suficiente para a
revelação acontecer antes do usuário perceber o "vazio".

---

## 4. Build & Deploy

```bash
cd ~/Desktop/code_study/MeusProjetos/meu-portfolio
npm run build
vercel --prod --confirm
```

- `vercel.json` já faz SPA rewrite (`/(.*)` -> `/index.html`).
- O alias de produção é `https://ismaeltech.com`.
- Após o deploy, o Vercel automaticamente aplica o alias custom.

---

## 5. Verificação rápida (Playwright)

Sem suíte de testes no repo, use screenshot/abertura manual:

```bash
# Screenshot full-page pós-fix
npx playwright screenshot --full-page "https://ismaeltech.com" verify.png

# Ou abrir no browser para checar visualmente
npx playwright open "https://ismaeltech.com"
```

**O que confirmar:**
- [ ] Hero visível (`opacity: 1`).
- [ ] Ao rolar, cada seção ganha `.visible` e fica `opacity: 1`.
- [ ] Cards filhos animam com stagger (`animation-delay`).
- [ ] Sem erros no console.

Check programático (útil em CI futuro):

```js
// todas as sections exceto #hero devem ter computed opacity ~1 APÓS scroll
const secs = await page.$$('section:not(#hero)');
for (const s of secs) {
  await s.scrollIntoViewIfNeeded();
  const op = await s.evaluate(el => getComputedStyle(el).opacity);
  console.log(op); // esperado "1"
}
```

---

## 6. Diagnóstico rápido se o bug voltar

1. Abrir `https://ismaeltech.com` e inspecionar uma seção (ex: `#sobre`).
2. `getComputedStyle(section).opacity` == `0`? → o CSS ainda está escondendo.
3. A seção tem a classe `visible` no DOM?
   - **Não tem** → o `IntersectionObserver` não está rodando (arquivo não
     buildado / deploy antigo / JS com erro). Rebuild + redeploy.
   - **Tem**, mas ainda `opacity: 0` → o seletor CSS mudou (alguém alterou
     `section:not(#hero).visible` ou o bloco de `@media reduced-motion`).
4. Conferir se `src/App.tsx` ainda contém o `useEffect` do observer acima.
5. Se alguém remover o observer "por limpar código morto", o site volta a
   ficar em branco — este arquivo existe para evitar esse erro.

---

## 7. Lições / prevenção

- **Nunca remova** o `useEffect` do observer sem substituir por outro
  mecanismo de reveal, ou o site fica invisível.
- Prefira um fallback defensivo: se `IntersectionObserver` não disparar, as
  seções devem aparecer de qualquer forma. (Ex.: `noscript` style ou um
  timeout que força `.visible` em tudo após 2s.)
- Mantenha este doc junto do repo (`docs/reveal-animation-fix.md`).
