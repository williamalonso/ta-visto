import { useEffect, useState } from 'react'
import { getTrending } from '@/lib/tmdb'
import { TmdbResult } from '@/types'

export function useTrending() {
  const [movies, setMovies] = useState<TmdbResult[]>([])
  const [series, setSeries] = useState<TmdbResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([getTrending('movie'), getTrending('tv')])
      .then(([m, s]) => {
        setMovies(m.slice(0, 10))
        setSeries(s.slice(0, 10))
      })
      .finally(() => setLoading(false))
  }, [])

  return { movies, series, loading }
}
