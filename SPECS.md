# Specs — App de Filmes & Séries (TV Time Clone)
> Instruções para agente de IA. Não gerar código ainda — apenas seguir a arquitetura e decisões descritas aqui.

---

## Visão Geral

Aplicação mobile pessoal para rastrear filmes e séries assistidos, inspirada no TV Time. O usuário busca títulos numa tela dedicada de busca, adiciona-os em listas por status e acompanha seu progresso nas abas de Filmes e Séries. Dados persistidos localmente via AsyncStorage, com suporte a exportação e importação de backup.

---

## Stack

- **Framework:** React Native (Expo)
- **Linguagem:** TypeScript
- **Navegação:** Expo Router
- **Persistência:** AsyncStorage (`@react-native-async-storage/async-storage`)
- **Estilização:** `StyleSheet.create()` nativo do React Native — sem bibliotecas externas de estilo
- **API de filmes/séries:** TMDB (The Movie Database) — gratuita, requer cadastro em https://www.themoviedb.org/settings/api
- **Exportação/Importação:** `expo-file-system` + `expo-sharing` + `expo-document-picker`

---

## Arquitetura de Pastas

```
src/
├── app/                          # Expo Router — rotas e navegação
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Tab navigator (Dashboard, Busca, Filmes, Séries, Configurações)
│   │   ├── index.tsx            # Aba Dashboard
│   │   ├── search.tsx           # Aba Busca (filmes e séries juntos)
│   │   ├── movies.tsx           # Aba Filmes (lista do usuário)
│   │   ├── series.tsx           # Aba Séries (lista do usuário)
│   │   └── settings.tsx         # Aba Configurações (exportar/importar)
│   └── _layout.tsx              # Layout raiz
│
├── components/                   # Todos os componentes reutilizáveis
│   ├── MediaCard.tsx             # Card genérico (usado em filmes e séries)
│   ├── SearchBar.tsx
│   ├── SearchResults.tsx
│   ├── StatusBadge.tsx
│   ├── StatusSelector.tsx
│   ├── StatsOverview.tsx
│   ├── Skeleton.tsx              # Componente genérico de loading skeleton
│   ├── ExportButton.tsx
│   └── ImportButton.tsx
│
├── hooks/                        # Todos os hooks
│   ├── useAsyncStorage.ts        # Hook genérico de persistência
│   ├── useMovies.ts              # CRUD de filmes no AsyncStorage
│   ├── useSeries.ts              # CRUD de séries no AsyncStorage
│   ├── useSearch.ts              # Busca na API TMDB com debounce
│   ├── useBackup.ts              # Exportar e importar JSON
│   └── useDebounce.ts
│
├── lib/
│   └── tmdb.ts                   # Wrapper para chamadas ao TMDB
│
├── types/
│   └── index.ts                  # Todos os tipos e interfaces da aplicação
│
└── assets/                       # Imagens, fontes, ícones
```

---

## Persistência — AsyncStorage

### Hook genérico: `useAsyncStorage<T>(key, initialValue)`

Localizado em `hooks/useAsyncStorage.ts`. Deve:
- Carregar o valor do AsyncStorage na montagem (com fallback para `initialValue`)
- Expor `{ value, setValue, loading }` — o `loading` é necessário pois AsyncStorage é assíncrono
- Sempre serializar/deserializar com `JSON.stringify` / `JSON.parse`

### Chaves utilizadas no AsyncStorage

| Chave | Conteúdo |
|---|---|
| `@cinelist:movies` | `MediaItem[]` — lista de filmes do usuário |
| `@cinelist:series` | `MediaItem[]` — lista de séries do usuário |

### Tipo base: `MediaItem`

```ts
type MediaStatus =
  | 'watching'       // Assistindo
  | 'plan_to_watch'  // Pretendo assistir
  | 'on_hold'        // Assistir depois (pausado)
  | 'up_to_date'     // Em dia (séries em andamento — só para séries)
  | 'completed'      // Finalizado

interface MediaItem {
  id: string              // UUID gerado no client (crypto.randomUUID)
  tmdbId: number
  mediaType: 'movie' | 'tv'
  title: string
  posterPath: string | null
  overview: string
  releaseDate: string
  voteAverage: number
  status: MediaStatus
  rating: number | null   // Nota do usuário (1–5), opcional
  notes: string | null    // Anotações pessoais, opcional
  createdAt: string       // ISO string
  updatedAt: string       // ISO string
}
```

> **Atenção:** o status `up_to_date` só deve ser exibido como opção ao adicionar/editar séries, não filmes.

---

## Componente Skeleton

Localizado em `components/Skeleton.tsx`. Deve:
- Aceitar as props `width`, `height` e opcionalmente `borderRadius`
- Exibir um bloco com animação de pulso (usando `Animated` do React Native) enquanto o conteúdo carrega
- Ser usado por qualquer componente que precise de loading state visual

```ts
interface SkeletonProps {
  width: number | string
  height: number
  borderRadius?: number
}
```

Exemplos de uso:
- `SearchResults.tsx` — enquanto `useSearch` está carregando, exibir N skeletons no formato de card
- `MediaCard.tsx` — enquanto a imagem do poster carrega

---

## Funcionalidade de Backup

### Exportação

- Lógica em `hooks/useBackup.ts`
- Ler as duas chaves do AsyncStorage e montar:

```ts
interface BackupData {
  version: 1
  exportedAt: string   // ISO string
  movies: MediaItem[]
  series: MediaItem[]
}
```

- Serializar como JSON, salvar como arquivo com `expo-file-system` e compartilhar via `expo-sharing` (share sheet nativo)
- Nome sugerido do arquivo: `cinelist-backup-YYYY-MM-DD.json`

### Importação

- Usar `expo-document-picker` para o usuário selecionar um arquivo `.json`
- Fazer parse e validar que o JSON possui `version`, `movies` e `series`
- Exibir alerta de confirmação: **"Isso vai substituir todos os seus dados atuais. Deseja continuar?"**
- Se confirmado, sobrescrever `@cinelist:movies` e `@cinelist:series` no AsyncStorage
- Exibir feedback de sucesso ou erro

---

## Integração TMDB

- Cadastrar conta em https://themoviedb.org e gerar API Key (v3)
- Salvar em `.env` como `EXPO_PUBLIC_TMDB_API_KEY`
- A key fica embutida no bundle do APK — aceitável para app pessoal não distribuído publicamente
- Wrapper em `lib/tmdb.ts`:
  - `searchMovies(query: string): Promise<TmdbResult[]>`
  - `searchSeries(query: string): Promise<TmdbResult[]>`
- Campos a retornar: `id`, `title` (ou `name` para séries), `poster_path`, `overview`, `release_date` (ou `first_air_date`), `vote_average`
- URL base de posters: `https://image.tmdb.org/t/p/w500{poster_path}`
- Busca com debounce de 500ms via `useDebounce.ts` dentro de `useSearch.ts`

---

## Variáveis de Ambiente

Criar arquivo `.env` na raiz com:

```
EXPO_PUBLIC_TMDB_API_KEY=
```

---

## Funcionalidades por Tela

### Dashboard (`index.tsx`)
- Contadores: total de filmes, total de séries, assistindo agora, finalizados
- Últimos 5 títulos adicionados ou atualizados (qualquer tipo)

### Busca (`search.tsx`)
- Barra de busca única com toggle para selecionar o tipo: **Filme** ou **Série**
- Resultados da busca com debounce de 500ms
- Cada resultado exibe: poster, título, ano, nota TMDB e botão para adicionar
- Ao adicionar, abrir um seletor de status (`StatusSelector`) antes de salvar
- Não permitir adicionar o mesmo título duas vezes (checar por `tmdbId` + `mediaType`)
- Enquanto carrega, exibir skeletons no formato de card via `Skeleton.tsx`

### Filmes (`movies.tsx`)
- Lista do usuário separada por seções de status:
  - Assistindo
  - Pretendo assistir
  - Assistir depois
  - Finalizado
- Cada card: poster, título, status atual, ações para mudar status e remover
- Sem barra de busca — a busca é feita na aba Busca

### Séries (`series.tsx`)
- Mesma estrutura de Filmes
- Status adicional disponível: **Em dia** (`up_to_date`)
- Sem barra de busca — a busca é feita na aba Busca

### Configurações (`settings.tsx`)
- Botão **Exportar dados** — gera e compartilha o JSON de backup
- Botão **Importar dados** — seleciona JSON e sobrescreve AsyncStorage
- Texto informativo explicando cada ação e que a importação sobrescreve os dados atuais

---

## Regras Gerais para o Agente

1. Usar **Expo Router** para navegação — não usar React Navigation manualmente
2. Estilização exclusivamente via `StyleSheet.create()` — sem bibliotecas externas
3. Toda lógica de AsyncStorage fica nos hooks — componentes não acessam AsyncStorage diretamente
4. Componentes apenas renderizam — sem lógica de negócio inline
5. Tipar tudo com TypeScript — sem `any`
6. Todos os tipos ficam centralizados em `types/index.ts`
7. Tratar estados de `loading` e `error` em todas as operações assíncronas
8. O componente `Skeleton.tsx` deve ser usado em todo lugar que tenha loading de dados externos (busca TMDB, carregamento de imagens)
