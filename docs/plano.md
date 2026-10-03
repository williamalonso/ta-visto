# Plano de Melhorias

## 1. Preview ao compartilhar no WhatsApp

**Problema:** URL compartilhada no Zap mostra link nu, sem imagem/título.  
**Solução:** Adicionar meta tags Open Graph e Twitter Card no HTML gerado pelo Expo para web.  
**Arquivo:** `public/index.html` (ou configuração de template do Expo, verificar se existe)  
**Tags necessárias:**
```html
<meta property="og:title" content="Tá Visto" />
<meta property="og:description" content="Minha lista de filmes e séries" />
<meta property="og:image" content="<URL do ícone hospedado>" />
<meta property="og:url" content="<URL do deploy>" />
<meta name="twitter:card" content="summary_large_image" />
```

**Teste Cypress:** `cypress/e2e/og-meta-tags.cy.ts`
- Visitar `/` e verificar que `<meta property="og:title">`, `og:description`, `og:image`, `og:url` e `twitter:card` existem e têm conteúdo não vazio.

---

## 2. Primeiro acesso vazio — onboarding modal

**Problema:** App abre pela primeira vez, tela inicial completamente vazia. Desorientador, sem contexto do que fazer.  
**Solução:** Modal de onboarding full-screen exibido apenas na primeira abertura, com 3 blocos explicando o app, fechando na aba Busca.

**Comportamento:**
- Exibe automaticamente quando `@cinelist:onboarding_done` não existe no AsyncStorage
- Ao fechar, salva a flag e navega para `/(tabs)/search`
- Nunca mais aparece nas aberturas seguintes

**Conteúdo do modal (3 blocos):**
1. 🔍 **Busque** — encontre filmes e séries pelo nome
2. 📋 **Organize** — classifique por status: assistindo, pretendo assistir, finalizado
3. 🎬 **Acompanhe** — marque episódios por temporada e rastreie seu progresso

**Arquivos a criar/modificar:**
- Criar `src/screens/home/components/OnboardingModal.tsx` — modal com os 3 blocos + botão "Começar"
- Modificar `src/screens/home/HomeScreen.tsx` — checar flag no `useEffect` e exibir modal

**Teste Cypress:** `cypress/e2e/onboarding-modal.cy.ts`
- Sem flag no localStorage → visitar `/` → modal visível e contém os 3 blocos de texto
- Clicar "Começar" → modal some → flag `@cinelist:onboarding_done` salva no localStorage → URL muda para `/search`
- Com flag já salva no localStorage → visitar `/` → modal não aparece

---

## 3. Scroll até o último episódio marcado ao abrir temporada

**Problema:** Ao expandir uma temporada grande, a lista começa do topo. Precisa rolar até o último episódio assistido.  
**Arquivo:** [`src/screens/detail/components/SeasonItem.tsx`](src/screens/detail/components/SeasonItem.tsx)  
**Solução:**
- Converter o `<View>` da `episodeList` para `<ScrollView>` com `ref`
- Após carregar episódios e expandir, verificar se há episódios assistidos nessa temporada
- **Se há episódios assistidos:** chamar `scrollTo` para o índice do último marcado (usar `onLayout` para garantir scroll após render)
- **Se nenhum episódio assistido:** comportamento atual — lista inicia do topo, sem scroll

---

## 4. Saudação errada de madrugada

**Problema:** `greeting()` retorna "Bom dia" para qualquer hora antes das 12h, incluindo 00:36.  
**Arquivo:** [`src/screens/home/components/HomeHeader.tsx:5`](src/screens/home/components/HomeHeader.tsx)  
**Fix:**
```ts
function greeting(): string {
  const h = new Date().getHours()
  if (h < 5) return 'Boa madrugada,'
  if (h < 12) return 'Bom dia,'
  if (h < 18) return 'Boa tarde,'
  return 'Boa noite,'
}
```

**Teste Cypress:** `cypress/e2e/greeting.cy.ts`
- `cy.clock(new Date(2024, 0, 1, 2, 0))` → visitar `/` → verificar texto "Boa madrugada,"
- `cy.clock(new Date(2024, 0, 1, 9, 0))` → visitar `/` → verificar "Bom dia,"
- `cy.clock(new Date(2024, 0, 1, 15, 0))` → visitar `/` → verificar "Boa tarde,"
- `cy.clock(new Date(2024, 0, 1, 21, 0))` → visitar `/` → verificar "Boa noite,"

---

## 5. Confirmar antes de marcar todos os episódios de uma temporada

**Problema:** Clicar no checkbox da temporada marca tudo imediatamente, sem confirmação.  
**Situação atual:** `ConfirmPreviousModal` só abre quando há episódios de temporadas anteriores não assistidos.  
**Arquivo:** [`src/screens/detail/components/SeasonItem.tsx:100`](src/screens/detail/components/SeasonItem.tsx)  
**Solução:** Em `handleSeasonCheck`, sempre abrir um modal de confirmação ao marcar todos (não só quando há temporadas anteriores). Criar um segundo modal simples "Marcar todos os X episódios como assistidos?" com Confirmar/Cancelar.  
**Obs:** Desmarcar tudo não precisa de confirmação.

**Teste Cypress:** `cypress/e2e/confirm-mark-all-episodes.cy.ts` (estende o padrão do `confirm-previous-modal.cy.ts`)
- Seed com série salva, nenhum episódio assistido na temporada, sem temporadas anteriores pendentes
- Clicar no checkbox da temporada → modal de confirmação aparece com texto "Marcar todos os X episódios"
- Clicar "Cancelar" → modal fecha, nenhum episódio marcado
- Clicar no checkbox novamente → confirmar → todos os episódios marcados com ✓
- Clicar no checkbox quando já todos marcados → desmarca diretamente sem modal

---

## 6. "Filmes Recentes" deve exibir apenas títulos finalizados

**Problema:** Seção exibe qualquer status, misturando "pretendo assistir" com títulos já vistos.  
**Causa:** `recentMovies` em [`src/screens/home/HomeScreen.tsx:52`](src/screens/home/HomeScreen.tsx) ordena por `updatedAt` sem filtrar por status.  
**Solução:** Filtrar para exibir somente `completed` (filmes) e `completed`/`up_to_date` (séries):
```ts
const recentMovies = [...movies]
  .filter((m) => m.status === 'completed')
  .sort(byDate)
  .slice(0, 5)

const recentSeries = [...series]
  .filter((s) => s.status === 'completed')
  .sort(byDate)
  .slice(0, 5)
```
**Renomear seções:** "Filmes Recentes" → "Filmes Assistidos Recentemente" e "Séries Recentes" → "Séries Assistidas Recentemente".  
**Atenção:** a seção "Continue Assistindo" permanece inalterada — continua exibindo filmes e séries com `status === 'watching'`.

**Teste Cypress:** `cypress/e2e/home-recent-completed-only.cy.ts`
- Seed com filmes de status variados: `completed`, `watching`, `plan_to_watch`
- Visitar `/` → seção "Filmes Assistidos Recentemente" exibe só o `completed`
- Títulos com `watching` e `plan_to_watch` não aparecem nessa seção (mas o `watching` aparece em "Continue Assistindo")
- Mesmo cenário para séries

---

## 7. Modal de detalhes do episódio

**Problema:** Lista de episódios mostra só título e número — sem sinopse, data, duração.  
**Endpoint TMDB:** `GET /tv/{id}/season/{n}/episode/{e}` — existe e retorna dados ricos.

**Implementação:**

**1. Expandir `TmdbEpisode` em [`src/lib/tmdb.ts`](src/lib/tmdb.ts):**
```ts
export interface TmdbEpisode {
  id: number
  name: string
  episode_number: number
  season_number: number
  overview: string
  air_date: string | null
  vote_average: number
  runtime: number | null          // novo
  still_path: string | null       // novo — thumbnail da cena
  guest_stars: TmdbCastMember[]   // novo — atores convidados
  crew: TmdbCrewMember[]          // novo — diretor do episódio
}
```

**2. Adicionar função `getEpisodeDetails` em `src/lib/tmdb.ts`:**
```ts
export async function getEpisodeDetails(
  tmdbId: number,
  season: number,
  episode: number
): Promise<TmdbEpisode> {
  return get<TmdbEpisode>(`/tv/${tmdbId}/season/${season}/episode/${episode}`)
}
```

**3. Criar `src/screens/detail/components/EpisodeDetailModal.tsx`:**
- Bottom sheet modal (slide de baixo, estilo dos outros modais do app)
- Conteúdo exibido:
  - Thumbnail (`still_path`) se disponível, com fallback gracioso
  - Título e numeração (ex: "T2 E4 — Nome do Episódio")
  - Data de exibição formatada em pt-BR
  - Duração em minutos (se disponível)
  - Nota TMDB com estrela
  - Sinopse (`overview`)
  - Diretor do episódio (filtrar `crew` por `job === 'Director'`)
  - Atores convidados (`guest_stars`, até 4)
- Busca os dados ao abrir (loading state enquanto carrega)

**4. Modificar [`src/screens/detail/components/EpisodeRow.tsx`](src/screens/detail/components/EpisodeRow.tsx):**
- Adicionar press longo ou ícone de info `ⓘ` para abrir o modal
- Manter o tap normal para marcar/desmarcar o episódio

**5. Passar `tmdbId` e `seasonNumber` pelo `SeasonItem` → `EpisodeRow` para montar a chamada.**

**Teste Cypress:** `cypress/e2e/episode-detail-modal.cy.ts`
- `cy.intercept('GET', '/api.themoviedb.org/3/tv/*/season/*/episode/*', fixture)` com dados mockados
- Seed com série salva → navegar para detalhe → expandir temporada → clicar no ícone ⓘ de um episódio
- Modal abre, exibe: título, numeração, sinopse, data de exibição e nota
- Fechar modal → lista de episódios volta ao estado normal
- Tap normal no episódio (fora do ⓘ) → marca/desmarca, sem abrir modal

---

## 8. Marcar série como finalizada deve preencher todos os episódios

**Status: JÁ IMPLEMENTADO** — verificar se está funcionando corretamente.  
**Código:** [`src/screens/detail/hooks/useDetail.ts:67`](src/screens/detail/hooks/useDetail.ts) — `handleStatusChange` já preenche `watchedEpisodes` com todas as chaves quando `status === 'completed'` em séries de TV.  
**Ação:** Testar no app real para confirmar que funciona. Se não funcionar, investigar se o `tvDetail` está carregado no momento da chamada.

**Teste Cypress:** já coberto por `cypress/e2e/series-completed-marks-episodes.cy.ts`.

