import { TmdbResult } from '@/types'

const BASE_URL = 'https://api.themoviedb.org/3'
export const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500'

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

async function get<T>(path: string): Promise<T> {
  const token = process.env.EXPO_PUBLIC_TMDB_API_KEY ?? ''
  const res = await fetch(`${BASE_URL}${path}&language=pt-BR`, {
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
