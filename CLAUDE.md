@AGENTS.md

# Ta Visto — Project Context for Agents

## Purpose

Personal media tracker (watchlist) for movies and TV series. Portuguese (pt-BR) UI. All data stored locally on device. Name means "Already Seen".

## Tech Stack

- React Native 0.85 + Expo SDK 56
- Expo Router v56.2 (file-based routing)
- TypeScript 6, strict mode
- AsyncStorage for persistence (no external state lib — no Redux, Zustand, React Query)
- TMDB REST API v3 for metadata
- `react-native-reanimated` 4.3 + `react-native-worklets` for animations
- `expo-file-system`, `expo-document-picker`, `expo-sharing` for backup
- React Native `StyleSheet` or css in line only — no CSS framework

## Folder Structure

```
src/
├── app/                  # Expo Router route tree (thin re-export files only)
│   ├── _layout.tsx
│   ├── (tabs)/           # Tab routes — each file just re-exports from src/screens/
│   └── detail/[id].tsx
├── screens/              # Feature-based — ALL real logic lives here
│   ├── home/
│   │   ├── HomeScreen.tsx
│   │   └── components/   # Local-only sub-components
│   ├── movies/
│   ├── series/
│   ├── search/
│   │   └── hooks/        # Screen-specific hooks (useSearch, useTrending)
│   ├── settings/
│   ├── detail/
│   │   └── hooks/useDetail.ts
│   └── tabs/             # Custom tab bar (SlidingTabBar + sliding pill animation)
├── components/           # Shared/generic components (Chip, MediaCard, SearchBar…)
├── hooks/                # Global hooks (useMovies, useSeries, useBackup, useAsyncStorage)
├── lib/
│   └── tmdb.ts           # All TMDB API calls
├── theme.ts              # Design tokens (colors, spacing, radius, typography, shadows)
├── types/index.ts        # Shared types
└── utils/groupByStatus.ts
```

## Architecture Rules

**Route files are thin.** Files in `src/app/` only re-export the screen from `src/screens/`. Never add logic to route files.

**Feature-based screens.** Each feature folder under `src/screens/` owns its `*Screen.tsx`, a `components/` subfolder for local sub-components, and optionally a `hooks/` subfolder for screen-local logic. Do not place screen-specific components in `src/components/`.

**State via hooks.** `useAsyncStorage<T>(key, initialValue)` is the storage primitive. `useMovies` and `useSeries` wrap it with typed CRUD. AsyncStorage keys: `@cinelist:movies` and `@cinelist:series`. Do not introduce external state management.

**Data fetching.** Direct `fetch()` in `src/lib/tmdb.ts`. API key from `EXPO_PUBLIC_TMDB_API_KEY`. All requests use `language=pt-BR`. No caching layer.

## Key Types (`src/types/index.ts`)

```ts
type MediaStatus = 'watching' | 'plan_to_watch' | 'on_hold' | 'up_to_date' | 'completed'

type MediaItem = {
  id: string           // local UUID
  tmdbId: number
  mediaType: 'movie' | 'tv'
  status: MediaStatus
  rating?: number
  notes?: string
  watchedEpisodes: string[]  // keys like "1-3" (season-episode)
  // timestamps…
}

type BackupData = { version: 1; exportedAt: string; movies: MediaItem[]; series: MediaItem[] }
```

Episode tracking: string keys `"season-episode"` in `watchedEpisodes[]`. When all episodes checked, status auto-transitions to `completed` (ended/canceled show) or `up_to_date` (ongoing).

## Styling

Dark-only palette. All colors from `src/theme.ts` — never hardcode hex values. Background `#0F1117`, primary amber `#F59E0B`. Shadows are platform-branched in `theme.ts` (web uses `boxShadow`, native uses `shadowColor`).

## Navigation

- Root Stack: `(tabs)` + `detail/[id]`
- Tab bar: fully custom `SlidingTabBar` with `Animated.Value` pill — not the default RN tab bar
- Detail route supports two modes: local item (string `id`) and TMDB preview (numeric `tmdbId`)
- Web: max-width 480px, centered

## TMDB API Endpoints Used

- `/search/movie` `/search/tv` — keyword search
- `/trending/{type}/week` — search screen default content
- `/movie/{id}?append_to_response=credits` — detail
- `/tv/{id}?append_to_response=credits` — detail
- `/tv/{id}/season/{n}` — season episodes
- `/{type}/{id}/watch/providers` — streaming, filtered to `BR` region

## Backup

`useBackup` serializes both AsyncStorage keys to versioned JSON. Import reads via document picker, writes back to AsyncStorage. Both web and native paths handled.

## Path Alias

`@/*` maps to `./src/*` (configured in `tsconfig.json`). Always use `@/` for imports within `src/`.

