import { View, Text, StyleSheet } from 'react-native'
import { TmdbTvSeason } from '@/lib/tmdb'
import { colors, typography } from '@/theme'
import { SeasonItem } from './components/SeasonItem'

interface SeasonListProps {
  seasons: TmdbTvSeason[]
  tmdbId: number
  watchedEpisodes: string[]
  onToggleEpisode: (key: string) => void
  onMarkEpisodes: (keys: string[]) => void
}

export function SeasonList({ seasons, tmdbId, watchedEpisodes, onToggleEpisode, onMarkEpisodes }: SeasonListProps) {
  const regular = seasons.filter((s) => s.season_number > 0)
  const specials = seasons.filter((s) => s.season_number === 0)
  const ordered = [...regular, ...specials]

  return (
    <View>
      <Text style={styles.sectionTitle}>Temporadas</Text>
      {ordered.map((season, index) => (
        <SeasonItem
          key={season.id}
          season={season}
          tmdbId={tmdbId}
          watchedEpisodes={watchedEpisodes}
          previousSeasons={ordered.slice(0, index).filter((s) => s.season_number > 0)}
          onToggleEpisode={onToggleEpisode}
          onMarkEpisodes={onMarkEpisodes}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  sectionTitle: {
    ...typography.sectionTitle,
    color: colors.textPrimary,
    marginBottom: 8,
  },
})
