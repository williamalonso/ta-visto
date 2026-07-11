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
  onUnmarkEpisodes: (keys: string[]) => void
}

export function SeasonItem({
  season,
  tmdbId,
  watchedEpisodes,
  previousSeasons,
  onToggleEpisode,
  onMarkEpisodes,
  onUnmarkEpisodes,
}: SeasonItemProps) {
  const [expanded, setExpanded] = useState(false)
  const [episodes, setEpisodes] = useState<TmdbEpisode[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [pendingKeys, setPendingKeys] = useState<{ toMark: string[]; previous: string[] } | null>(null)

  const loadEpisodes = async () => {
    if (episodes) return episodes
    setLoading(true)
    try {
      const detail = await getSeasonDetails(tmdbId, season.season_number)
      setEpisodes(detail.episodes)
      return detail.episodes
    } catch {
      setEpisodes([])
      return []
    } finally {
      setLoading(false)
    }
  }

  const handleExpand = async () => {
    if (!expanded && !episodes) await loadEpisodes()
    setExpanded((prev) => !prev)
  }

  const allSeasonKeys = Array.from(
    { length: season.episode_count },
    (_, i) => episodeKey(season.season_number, i + 1)
  )

  const watchedCount = episodes
    ? episodes.filter((ep) =>
        watchedEpisodes.includes(episodeKey(season.season_number, ep.episode_number))
      ).length
    : allSeasonKeys.filter((k) => watchedEpisodes.includes(k)).length

  const allWatched = season.episode_count > 0 && watchedCount === season.episode_count

  const label = season.season_number === 0 ? 'E' : `T${season.season_number}`

  const getPreviousSeasonUnwatched = () =>
    previousSeasons
      .flatMap((s) =>
        Array.from({ length: s.episode_count }, (_, i) => episodeKey(s.season_number, i + 1))
      )
      .filter((k) => !watchedEpisodes.includes(k))

  const handleEpisodePress = (ep: TmdbEpisode) => {
    const key = episodeKey(season.season_number, ep.episode_number)
    if (watchedEpisodes.includes(key)) {
      onToggleEpisode(key)
      return
    }

    const inCurrentSeason = (episodes ?? [])
      .filter((e) => e.episode_number < ep.episode_number)
      .map((e) => episodeKey(season.season_number, e.episode_number))
      .filter((k) => !watchedEpisodes.includes(k))

    const previousUnwatched = [...getPreviousSeasonUnwatched(), ...inCurrentSeason]

    if (previousUnwatched.length === 0) {
      onToggleEpisode(key)
      return
    }

    setPendingKeys({ toMark: [key], previous: previousUnwatched })
  }

  const handleSeasonCheck = async () => {
    const eps = episodes ?? await loadEpisodes()
    const allKeys = eps.map((e) => episodeKey(season.season_number, e.episode_number))
    const allCurrentWatched = allKeys.every((k) => watchedEpisodes.includes(k))

    if (allCurrentWatched) {
      onUnmarkEpisodes(allKeys)
      return
    }

    const unwatchedInSeason = allKeys.filter((k) => !watchedEpisodes.includes(k))
    const previousUnwatched = getPreviousSeasonUnwatched()

    if (previousUnwatched.length === 0) {
      onMarkEpisodes(unwatchedInSeason)
      return
    }

    setPendingKeys({ toMark: unwatchedInSeason, previous: previousUnwatched })
  }

  return (
    <View style={styles.seasonBlock}>
      <View style={styles.seasonRow}>
        <Pressable
          style={({ pressed }) => [styles.seasonExpand, pressed && styles.seasonRowPressed]}
          onPress={handleExpand}
        >
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{label}</Text>
          </View>
          <Text style={styles.seasonName} numberOfLines={1}>
            {season.name}
          </Text>
          <Text style={styles.watchedCount}>
            {watchedCount}/{season.episode_count}
          </Text>
          <Text style={styles.epCount}>{season.episode_count} ep</Text>
          <Text style={[styles.chevron, expanded && styles.chevronOpen]}>›</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.seasonCheckbox,
            allWatched && styles.seasonCheckboxActive,
            pressed && styles.watchBtnPressed,
          ]}
          onPress={handleSeasonCheck}
          hitSlop={8}
        >
          <Text style={[styles.checkIcon, allWatched && styles.checkIconActive]}>
            {allWatched ? '✓' : '○'}
          </Text>
        </Pressable>
      </View>

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
          if (pendingKeys) onMarkEpisodes(pendingKeys.toMark)
          setPendingKeys(null)
        }}
        onAllPrevious={() => {
          if (pendingKeys) onMarkEpisodes([...pendingKeys.previous, ...pendingKeys.toMark])
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
  seasonExpand: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
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
  seasonCheckbox: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seasonCheckboxActive: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  watchBtnPressed: {
    opacity: 0.7,
  },
  checkIcon: {
    fontSize: 14,
    color: colors.textAuxiliary,
  },
  checkIconActive: {
    color: colors.white,
    fontWeight: '700',
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
