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

**Status: IMPLEMENTADO** — a primeira versão usava `og:image="/icon.png"` (relativo) e não tinha `og:url`; o WhatsApp ignora imagem sem URL absoluta.  
**Como ficou** ([`src/app/+html.tsx`](src/app/+html.tsx)):
- `og:image`, `og:image:secure_url`, `twitter:image` e `og:url` montados a partir de `EXPO_PUBLIC_SITE_URL` (sem barra final)
- Extras: `og:site_name`, `og:locale` (`pt_BR`), `og:image:type/width/height/alt` (1254×1254)
- `twitter:card` = `summary` (ícone quadrado)
- Variável documentada em `.env.example`

**Ação manual:** definir `EXPO_PUBLIC_SITE_URL` na Vercel → redeploy → forçar nova leitura no [Sharing Debugger](https://developers.facebook.com/tools/debug/) ("Scrape Again"), pois o WhatsApp guarda o preview em cache.

**Teste Cypress:** `cypress/e2e/og-meta-tags.cy.ts`
- Visitar `/` e verificar que `<meta property="og:title">`, `og:description`, `og:image`, `og:url` e `twitter:card` existem e têm conteúdo não vazio.
- `og:url`, `twitter:image` e dimensões da imagem presentes.
- URL absoluta: só roda com `npx cypress run --env SITE_URL=https://seu-app.vercel.app` (senão fica *pending*).

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

**Status: IMPLEMENTADO**
- `ScrollView` com `maxHeight: 360` e `nestedScrollEnabled`
- Ao abrir, desliza **animado** (`animated: true`, ~150 ms de atraso) até o último episódio assistido; o `onLayout` da linha alvo só age uma vez por abertura
- Sem episódios assistidos → fica no topo e não rola depois ao marcar
- iOS: `indicatorStyle="white"`; web: barra estilizada (ver item 11)

**Teste Cypress:** `cypress/e2e/season-scroll-last-watched.cy.ts`
- Temporada com 30 eps e 20 assistidos → `scrollTop > 0` e o episódio 20 dentro da área visível da lista
- Sem assistidos → `scrollTop` continua 0

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
**Obs (atualizado):** desmarcar a temporada inteira **também pede confirmação** — modal "Desmarcar temporada?" com botão vermelho "Desmarcar". O mesmo `ConfirmMarkSeasonModal` recebe `mode: 'mark' | 'unmark'`.

**Teste Cypress:** `cypress/e2e/confirm-mark-all-episodes.cy.ts` (estende o padrão do `confirm-previous-modal.cy.ts`)
- Seed com série salva, nenhum episódio assistido na temporada, sem temporadas anteriores pendentes
- Clicar no checkbox da temporada → modal de confirmação aparece com texto "Marcar todos os X episódios"
- Clicar "Cancelar" → modal fecha, nenhum episódio marcado
- Clicar no checkbox novamente → confirmar → todos os episódios marcados com ✓
- Clicar no checkbox quando já todos marcados → modal "Desmarcar temporada?" → Cancelar mantém tudo; Confirmar desmarca

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
- ~~Adicionar press longo ou ícone de info `ⓘ` para abrir o modal~~ → **decisão final:** sem ícone; tocar no **número/nome do episódio** abre o modal (`testID="episode-name-N"`)
- Manter o tap normal para marcar/desmarcar o episódio

**5. Passar `tmdbId` e `seasonNumber` pelo `SeasonItem` → `EpisodeRow` para montar a chamada.**

**Teste Cypress:** `cypress/e2e/episode-detail-modal.cy.ts`
- `cy.intercept('GET', '/api.themoviedb.org/3/tv/*/season/*/episode/*', fixture)` com dados mockados
- Seed com série salva → navegar para detalhe → expandir temporada → clicar no nome de um episódio
- Modal abre, exibe: título, numeração, sinopse, data de exibição e nota
- Fechar modal → lista de episódios volta ao estado normal
- Tap no círculo à direita (`episode-check-N`) → marca/desmarca, sem abrir modal
- Fechar tocando no fundo escuro (`episode-detail-overlay`)

---

## 8. Marcar série como finalizada deve preencher todos os episódios

**Status: JÁ IMPLEMENTADO** — verificar se está funcionando corretamente.  
**Código:** [`src/screens/detail/hooks/useDetail.ts:67`](src/screens/detail/hooks/useDetail.ts) — `handleStatusChange` já preenche `watchedEpisodes` com todas as chaves quando `status === 'completed'` em séries de TV.  
**Ação:** Testar no app real para confirmar que funciona. Se não funcionar, investigar se o `tvDetail` está carregado no momento da chamada.

**Teste Cypress:** já coberto por `cypress/e2e/series-completed-marks-episodes.cy.ts`.


**Atualização:** funcionava, mas em animes com numeração absoluta as chaves gravadas não batiam com as da lista de episódios — ver item 10.

---

## 9. Confete ao finalizar filme ou série

**Status: IMPLEMENTADO**  
**Arquivos:** [`src/screens/detail/components/Confetti.tsx`](src/screens/detail/components/Confetti.tsx), [`useDetail.ts`](src/screens/detail/hooks/useDetail.ts), [`DetailScreen.tsx`](src/screens/detail/DetailScreen.tsx)

- 80 peças animadas com `react-native-reanimated` (sem lib nova), cores do `theme.ts`, ~3,2 s, `pointerEvents="none"`
- `useDetail` expõe `celebrationKey`; incrementar dispara uma nova chuva
- Dispara quando o item **vira** `completed`:
  - Alterar status → Finalizado
  - Marcar o último episódio de série encerrada (auto-transição para `completed`)
  - Adicionar pelo preview já como Finalizado
- Não dispara se já estava `completed`, nem em `up_to_date`

**Teste Cypress:** `cypress/e2e/confetti-on-complete.cy.ts`
- Filme → Finalizado → peças aparecem e somem depois da animação
- Filme já finalizado → Finalizado de novo → sem confete
- Filme → outro status → sem confete
- Série encerrada → marcar o último episódio → status `completed` + confete

---

## 10. Numeração absoluta de episódios (anime)

**Problema:** Finalizar One Piece marcava tudo, mas ao tentar desmarcar uma temporada aparecia "Marcar temporada?". O app gravava episódios de dois jeitos:
- Finalizado / auto-conclusão / temporadas anteriores → **posição** na temporada (`2-1` … `2-16`)
- Lista de episódios → **`episode_number` do TMDB**, que em anime é absoluto (`2-62` … `2-77`)

**Solução** ([`SeasonItem.tsx`](src/screens/detail/components/SeasonItem.tsx)):
- Chave canônica = **posição** (`"season-posição"`); a lista continua exibindo o número real (62, 63…) e o modal de detalhes continua buscando pelo `episode_number`
- **Migração automática** ao abrir a temporada: chaves com número maior que o total de episódios da temporada (inequivocamente antigas) viram posição, via `handleReplaceEpisodes(remove, add)` em `useDetail` (não altera status)
- Desmarcar temporada remove **todas** as chaves com prefixo `"N-"`, inclusive sobras antigas

**Teste Cypress:** `cypress/e2e/absolute-episode-numbering.cy.ts`
- `2-62..2-64` migram para `2-1..2-3` ao abrir a T2; número 62 continua visível
- Marcar episódio grava `2-1`, não `2-62`
- Após Finalizado, checkbox da temporada abre "Desmarcar temporada?" (não "Marcar")
- Desmarcar: Cancelar mantém; Confirmar remove só a T2

---

## 11. Barra de rolagem da lista de episódios no tema

**Status: IMPLEMENTADO**  
- **Web desktop** ([`src/app/+html.tsx`](src/app/+html.tsx)): CSS global para `[data-testid^="episode-list-"]` — 6 px, arredondada, sem setas, `colors.border` em repouso e `colors.primary` no hover. `scrollbar-width/color` só para Firefox (`@supports not selector(::-webkit-scrollbar)`), pois o Chrome ignora `::-webkit-scrollbar` quando `scrollbar-color` existe e volta a mostrar as setas.
- **iOS nativo:** `indicatorStyle="white"`
- **Celular (web e Android):** barra de overlay do sistema, que ignora CSS

**Ideia futura:** barra própria (esconder a nativa + `View` posicionada via `onScroll`/reanimated) para ficar igual em todas as plataformas.

---

## 12. Service worker preso em versão antiga

**Problema:** `public/sw.js` fazia cache-first de tudo, inclusive `/` — após um deploy o app continuava na versão antiga (e o dev server também servia bundle velho).  
**Status: IMPLEMENTADO** (versão final veio do `master`, PRs #2 e #3; mantida no merge com o `hotfix`):
- Cache-first só para `/_expo/static/` (bundles com hash); network-first para HTML e demais arquivos
- Cache `ta-visto-v4`; ao atualizar de um SW antigo, recarrega as abas abertas
- Ao voltar do segundo plano, verifica se há deploy novo e recarrega
- `vercel.json`: `/sw.js` com `Cache-Control: no-cache`

---

## 13. Infra de testes Cypress

- `cypress/support/e2e.ts`: intercepta `/sw.js` com 404 em todos os testes (evita rodar contra bundle em cache)
- `testID`s estáveis: `status-option-<status>` (StatusSelector), `episode-name-N` / `episode-check-N` (EpisodeRow), `episode-list-N`, `episode-detail-overlay`, `confetti` / `confetti-piece`
- Esperar `'Alterar'` em vez do título: a tela inicial fica montada e oculta atrás do detalhe, e `cy.contains(título)` pegava a cópia invisível

**Pendente — specs antigos falhando (anteriores a estas mudanças):**
- `home-displays-items` e `home-recent-completed-only`: procuram o título nos cards da Home, que hoje mostram só o pôster
- `confirm-previous-modal`: mesmo problema do título oculto
- `series-completed-marks-episodes`: título oculto + campo de busca aparece desabilitado para o Cypress
