import { View, Text, Pressable, ActivityIndicator, StyleSheet } from 'react-native'
import { useState } from 'react'
import { TmdbTvSeason, TmdbEpisode, getSeasonDetails } from '@/lib/tmdb'
import { colors, radius, spacing, typography } from '@/theme'

interface SeasonListProps {
  seasons: TmdbTvSeason[]
  tmdbId: number
  watchedEpisodes: string[]
  onToggleEpisode: (key: string) => void
}

function episodeKey(seasonNumber: number, episodeNumber: number) {
  return `${seasonNumber}-${episodeNumber}`
}

interface EpisodeRowProps {
  episode: TmdbEpisode
  watched: boolean
  onToggle: () => void
}

function EpisodeRow({ episode, watched, onToggle }: EpisodeRowProps) {
  return (
    <View style={styles.episodeRow}>
      <Text style={styles.epNumber}>{episode.episode_number}</Text>
      <Text style={styles.epName} numberOfLines={2}>
        {episode.name}
      </Text>
      <Pressable
        style={({ pressed }) => [
          styles.watchBtn,
          watched && styles.watchBtnActive,
          pressed && styles.watchBtnPressed,
        ]}
        onPress={onToggle}
        hitSlop={8}
      >
        <Text style={[styles.watchIcon, watched && styles.watchIconActive]}>
          {watched ? '✓' : '○'}
        </Text>
      </Pressable>
    </View>
  )
}

interface SeasonItemProps {
  season: TmdbTvSeason
  tmdbId: number
  watchedEpisodes: string[]
  onToggleEpisode: (key: string) => void
}

function SeasonItem({ season, tmdbId, watchedEpisodes, onToggleEpisode }: SeasonItemProps) {
  const [expanded, setExpanded] = useState(false)
  const [episodes, setEpisodes] = useState<TmdbEpisode[] | null>(null)
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    if (!expanded && !episodes) {
      setLoading(true)
      try {
        const detail = await getSeasonDetails(tmdbId, season.season_number)
        setEpisodes(detail.episodes)
      } catch {
        setEpisodes([])
      } finally {
        setLoading(false)
      }
    }
    setExpanded((prev) => !prev)
  }

  const watchedCount =
    episodes?.filter((ep) =>
      watchedEpisodes.includes(episodeKey(season.season_number, ep.episode_number))
    ).length ?? 0

  const label = season.season_number === 0 ? 'E' : `T${season.season_number}`

  return (
    <View style={styles.seasonBlock}>
      <Pressable
        style={({ pressed }) => [styles.seasonRow, pressed && styles.seasonRowPressed]}
        onPress={handleToggle}
      >
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{label}</Text>
        </View>
        <Text style={styles.seasonName} numberOfLines={1}>
          {season.name}
        </Text>
        {episodes && (
          <Text style={styles.watchedCount}>
            {watchedCount}/{episodes.length}
          </Text>
        )}
        <Text style={styles.epCount}>{season.episode_count} ep</Text>
        <Text style={[styles.chevron, expanded && styles.chevronOpen]}>›</Text>
      </Pressable>

      {expanded && (
        <View style={styles.episodeList}>
          {loading ? (
            <ActivityIndicator color={colors.primary} style={{ paddingVertical: spacing.md }} />
          ) : episodes && episodes.length > 0 ? (
            episodes.map((ep) => (
              <EpisodeRow
                key={ep.id}
                episode={ep}
                watched={watchedEpisodes.includes(
                  episodeKey(season.season_number, ep.episode_number)
                )}
                onToggle={() =>
                  onToggleEpisode(episodeKey(season.season_number, ep.episode_number))
                }
              />
            ))
          ) : (
            <Text style={styles.noEpisodes}>Nenhum episódio encontrado.</Text>
          )}
        </View>
      )}
    </View>
  )
}

export function SeasonList({ seasons, tmdbId, watchedEpisodes, onToggleEpisode }: SeasonListProps) {
  const regular = seasons.filter((s) => s.season_number > 0)
  const specials = seasons.filter((s) => s.season_number === 0)
  const ordered = [...regular, ...specials]

  return (
    <View>
      <Text style={styles.sectionTitle}>Temporadas</Text>
      {ordered.map((season) => (
        <SeasonItem
          key={season.id}
          season={season}
          tmdbId={tmdbId}
          watchedEpisodes={watchedEpisodes}
          onToggleEpisode={onToggleEpisode}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  sectionTitle: {
    ...typography.sectionTitle,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  seasonBlock: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  seasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  seasonRowPressed: {
    opacity: 0.6,
  },
  badge: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    ...typography.auxiliary,
    fontWeight: '700',
    color: colors.primary,
  },
  seasonName: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
  },
  watchedCount: {
    ...typography.auxiliary,
    color: colors.success,
    fontWeight: '600',
  },
  epCount: {
    ...typography.auxiliary,
    color: colors.textSecondary,
  },
  chevron: {
    fontSize: 20,
    color: colors.textAuxiliary,
    transform: [{ rotate: '0deg' }],
  },
  chevronOpen: {
    transform: [{ rotate: '90deg' }],
  },
  episodeList: {
    paddingBottom: spacing.sm,
    paddingLeft: spacing.xs,
  },
  episodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  epNumber: {
    width: 24,
    ...typography.auxiliary,
    color: colors.textAuxiliary,
    textAlign: 'center',
  },
  epName: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
  },
  watchBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  watchBtnActive: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  watchBtnPressed: {
    opacity: 0.7,
  },
  watchIcon: {
    fontSize: 14,
    color: colors.textAuxiliary,
  },
  watchIconActive: {
    color: colors.white,
    fontWeight: '700',
  },
  noEpisodes: {
    ...typography.auxiliary,
    color: colors.textSecondary,
    paddingVertical: spacing.sm,
  },
})
