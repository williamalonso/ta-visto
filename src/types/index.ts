export type MediaStatus =
  | 'watching'
  | 'plan_to_watch'
  | 'on_hold'
  | 'up_to_date'
  | 'completed'

export interface MediaItem {
  id: string
  tmdbId: number
  mediaType: 'movie' | 'tv'
  title: string
  posterPath: string | null
  backdropPath: string | null
  overview: string
  releaseDate: string
  voteAverage: number
  status: MediaStatus
  rating: number | null
  notes: string | null
  watchedEpisodes?: string[]
  createdAt: string
  updatedAt: string
}

export interface TmdbResult {
  id: number
  title: string
  posterPath: string | null
  backdropPath: string | null
  overview: string
  releaseDate: string
  voteAverage: number
  mediaType: 'movie' | 'tv'
}

export interface BackupData {
  version: 1
  exportedAt: string
  movies: MediaItem[]
  series: MediaItem[]
}
