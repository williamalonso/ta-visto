import { TmdbResult } from '@/types'

const BASE_URL = 'https://api.themoviedb.org/3'
export const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500'
export const POSTER_LARGE_BASE_URL = 'https://image.tmdb.org/t/p/w780'

interface TmdbMovieResult {
  id: number
  title: string
  poster_path: string | null
  overview: string
  release_date: string
  vote_average: number
}

interface TmdbSeriesResult {
  id: number
  name: string
  poster_path: string | null
  overview: string
  first_air_date: string
  vote_average: number
}

interface TmdbSearchResponse<T> {
  results: T[]
  total_results: number
}

export interface TmdbCastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

export interface TmdbCrewMember {
  id: number
  name: string
  job: string
  department: string
  profile_path: string | null
}

export interface TmdbCredits {
  cast: TmdbCastMember[]
  crew: TmdbCrewMember[]
}

export interface TmdbMovieDetail {
  id: number
  title: string
  overview: string
  poster_path: string | null
  release_date: string
  vote_average: number
  runtime: number | null
  genres: { id: number; name: string }[]
  credits: TmdbCredits
}

export interface TmdbTvSeason {
  id: number
  name: string
  season_number: number
  episode_count: number
  air_date: string | null
}

export interface TmdbTvDetail {
  id: number
  name: string
  overview: string
  poster_path: string | null
  first_air_date: string
  vote_average: number
  number_of_seasons: number
  number_of_episodes: number
  genres: { id: number; name: string }[]
  seasons: TmdbTvSeason[]
  episode_run_time: number[]
  created_by: { id: number; name: string; profile_path: string | null }[]
  credits: TmdbCredits
}

async function get<T>(path: string): Promise<T> {
  const token = process.env.EXPO_PUBLIC_TMDB_API_KEY ?? ''
  const separator = path.includes('?') ? '&' : '?'
  const res = await fetch(`${BASE_URL}${path}${separator}language=pt-BR`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error(`TMDB ${res.status}`)
  return res.json() as Promise<T>
}

export async function searchMovies(query: string): Promise<TmdbResult[]> {
  const data = await get<TmdbSearchResponse<TmdbMovieResult>>(
    `/search/movie?query=${encodeURIComponent(query)}`
  )
  return data.results.map((m) => ({
    id: m.id,
    title: m.title,
    posterPath: m.poster_path,
    overview: m.overview,
    releaseDate: m.release_date,
    voteAverage: m.vote_average,
    mediaType: 'movie' as const,
  }))
}

export async function searchSeries(query: string): Promise<TmdbResult[]> {
  const data = await get<TmdbSearchResponse<TmdbSeriesResult>>(
    `/search/tv?query=${encodeURIComponent(query)}`
  )
  return data.results.map((s) => ({
    id: s.id,
    title: s.name,
    posterPath: s.poster_path,
    overview: s.overview,
    releaseDate: s.first_air_date,
    voteAverage: s.vote_average,
    mediaType: 'tv' as const,
  }))
}

export interface TmdbEpisode {
  id: number
  name: string
  episode_number: number
  season_number: number
  overview: string
  air_date: string | null
  vote_average: number
}

export interface TmdbSeasonDetail {
  id: number
  name: string
  season_number: number
  episodes: TmdbEpisode[]
}

export async function getMovieDetails(tmdbId: number): Promise<TmdbMovieDetail> {
  return get<TmdbMovieDetail>(`/movie/${tmdbId}?append_to_response=credits`)
}

export async function getTvDetails(tmdbId: number): Promise<TmdbTvDetail> {
  return get<TmdbTvDetail>(`/tv/${tmdbId}?append_to_response=credits`)
}

export async function getSeasonDetails(tmdbId: number, seasonNumber: number): Promise<TmdbSeasonDetail> {
  return get<TmdbSeasonDetail>(`/tv/${tmdbId}/season/${seasonNumber}`)
}
