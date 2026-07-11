import { View, Text, Pressable, ActivityIndicator, Modal, StyleSheet } from 'react-native'
import { useState } from 'react'
import { TmdbTvSeason, TmdbEpisode, getSeasonDetails } from '@/lib/tmdb'
import { colors, radius, spacing, typography } from '@/theme'

interface SeasonListProps {
  seasons: TmdbTvSeason[]
  tmdbId: number
  watchedEpisodes: string[]
  onToggleEpisode: (key: string) => void
  onMarkEpisodes: (keys: string[]) => void
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

interface ConfirmModalProps {
  visible: boolean
  count: number
  onJustThis: () => void
  onAllPrevious: () => void
  onCancel: () => void
}

function ConfirmModal({ visible, count, onJustThis, onAllPrevious, onCancel }: ConfirmModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable style={styles.dialog} onPress={() => {}}>
          <Text style={styles.dialogTitle}>Marcar anteriores?</Text>
          <Text style={styles.dialogBody}>
            Há {count} episódio(s) anteriores não assistidos. Deseja marcá-los também?
          </Text>
          <View style={styles.dialogActions}>
            <Pressable style={[styles.dialogBtn, styles.dialogBtnSecondary]} onPress={onCancel}>
              <Text style={styles.dialogBtnSecondaryText}>Cancelar</Text>
            </Pressable>
            <Pressable style={[styles.dialogBtn, styles.dialogBtnOutline]} onPress={onJustThis}>
              <Text style={styles.dialogBtnOutlineText}>Só este</Text>
            </Pressable>
            <Pressable style={[styles.dialogBtn, styles.dialogBtnPrimary]} onPress={onAllPrevious}>
              <Text style={styles.dialogBtnPrimaryText}>Todos + este</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

interface SeasonItemProps {
  season: TmdbTvSeason
  tmdbId: number
  watchedEpisodes: string[]
  previousSeasons: TmdbTvSeason[]
  onToggleEpisode: (key: string) => void
  onMarkEpisodes: (keys: string[]) => void
}

function SeasonItem({ season, tmdbId, watchedEpisodes, previousSeasons, onToggleEpisode, onMarkEpisodes }: SeasonItemProps) {
  const [expanded, setExpanded] = useState(false)
  const [episodes, setEpisodes] = useState<TmdbEpisode[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [pendingKeys, setPendingKeys] = useState<{ just: string; previous: string[] } | null>(null)

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

    const inPreviousSeasons = previousSeasons.flatMap((s) =>
      Array.from({ length: s.episode_count }, (_, i) => episodeKey(s.season_number, i + 1))
    ).filter((k) => !watchedEpisodes.includes(k))

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
                watched={watchedEpisodes.includes(episodeKey(season.season_number, ep.episode_number))}
                onToggle={() => handleEpisodePress(ep)}
              />
            ))
          ) : (
            <Text style={styles.noEpisodes}>Nenhum episódio encontrado.</Text>
          )}
        </View>
      )}

      <ConfirmModal
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
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  dialog: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 380,
    gap: spacing.md,
  },
  dialogTitle: {
    ...typography.sectionTitle,
    color: colors.textPrimary,
  },
  dialogBody: {
    ...typography.body,
    color: colors.textSecondary,
  },
  dialogActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  dialogBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  dialogBtnSecondary: {
    backgroundColor: colors.surfaceSecondary,
  },
  dialogBtnSecondaryText: {
    ...typography.auxiliary,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  dialogBtnOutline: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  dialogBtnOutlineText: {
    ...typography.auxiliary,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  dialogBtnPrimary: {
    backgroundColor: colors.primary,
  },
  dialogBtnPrimaryText: {
    ...typography.auxiliary,
    color: colors.black,
    fontWeight: '700',
  },
})
