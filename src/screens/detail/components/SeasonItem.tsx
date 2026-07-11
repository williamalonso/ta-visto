import { View, Text, Pressable, ActivityIndicator, StyleSheet } from 'react-native'
import { useState } from 'react'
import { TmdbTvSeason, TmdbEpisode, getSeasonDetails } from '@/lib/tmdb'
import { colors, radius, spacing, typography } from '@/theme'
import { EpisodeRow } from './EpisodeRow'
import { ConfirmPreviousModal } from './ConfirmPreviousModal'

function episodeKey(seasonNumber: number, episodeNumber: number) {
  return `${seasonNumber}-${episodeNumber}`
}

interface SeasonItemProps {
  season: TmdbTvSeason
  tmdbId: number
  watchedEpisodes: string[]
  previousSeasons: TmdbTvSeason[]
  onToggleEpisode: (key: string) => void
  onMarkEpisodes: (keys: string[]) => void
}

export function SeasonItem({ season, tmdbId, watchedEpisodes, previousSeasons, onToggleEpisode, onMarkEpisodes }: SeasonItemProps) {
  const [expanded, setExpanded] = useState(false)
  const [episodes, setEpisodes] = useState<TmdbEpisode[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [pendingKeys, setPendingKeys] = useState<{ just: string; previous: string[] } | null>(null)

  const handleExpand = async () => {
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

  const handleEpisodePress = (ep: TmdbEpisode) => {
    const key = episodeKey(season.season_number, ep.episode_number)
    const watched = watchedEpisodes.includes(key)

    if (watched) {
      onToggleEpisode(key)
      return
    }

    const inCurrentSeason = (episodes ?? [])
      .filter((e) => e.episode_number < ep.episode_number)
      .map((e) => episodeKey(season.season_number, e.episode_number))
      .filter((k) => !watchedEpisodes.includes(k))

    const inPreviousSeasons = previousSeasons
      .flatMap((s) =>
        Array.from({ length: s.episode_count }, (_, i) => episodeKey(s.season_number, i + 1))
      )
      .filter((k) => !watchedEpisodes.includes(k))

    const previousUnwatched = [...inPreviousSeasons, ...inCurrentSeason]

    if (previousUnwatched.length === 0) {
      onToggleEpisode(key)
      return
    }

    setPendingKeys({ just: key, previous: previousUnwatched })
  }

  return (
    <View style={styles.seasonBlock}>
      <Pressable
        style={({ pressed }) => [styles.seasonRow, pressed && styles.seasonRowPressed]}
        onPress={handleExpand}
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
                watched={watchedEpisodes.includes(episodeKey(season.season_number, ep.episode_number))}
                onToggle={() => handleEpisodePress(ep)}
              />
            ))
          ) : (
            <Text style={styles.noEpisodes}>Nenhum episódio encontrado.</Text>
          )}
        </View>
      )}

      <ConfirmPreviousModal
        visible={pendingKeys !== null}
        count={pendingKeys?.previous.length ?? 0}
        onJustThis={() => {
          if (pendingKeys) onToggleEpisode(pendingKeys.just)
          setPendingKeys(null)
        }}
        onAllPrevious={() => {
          if (pendingKeys) onMarkEpisodes([...pendingKeys.previous, pendingKeys.just])
          setPendingKeys(null)
        }}
        onCancel={() => setPendingKeys(null)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
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
  noEpisodes: {
    ...typography.auxiliary,
    color: colors.textSecondary,
    paddingVertical: spacing.sm,
  },
})
