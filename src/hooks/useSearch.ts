import { useState, useEffect } from 'react'
import { TmdbResult } from '@/types'
import { searchMovies, searchSeries } from '@/lib/tmdb'
import { useDebounce } from './useDebounce'

export function useSearch() {
  const [query, setQuery] = useState('')
  const [mediaType, setMediaType] = useState<'movie' | 'tv'>('movie')
  const [results, setResults] = useState<TmdbResult[]>([])
  const [fetching, setFetching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const debouncedQuery = useDebounce(query, 500)

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([])
      setError(null)
      return
    }
    setFetching(true)
    setError(null)
    const fn = mediaType === 'movie' ? searchMovies : searchSeries
    fn(debouncedQuery)
      .then(setResults)
      .catch((e: Error) => setError(e.message))
      .finally(() => setFetching(false))
  }, [debouncedQuery, mediaType])

  // loading is true while debouncing OR while fetching from API
  const loading = fetching || (query.trim() !== '' && query !== debouncedQuery)

  return { query, setQuery, mediaType, setMediaType, results, loading, error }
}
