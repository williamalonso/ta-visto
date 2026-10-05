import { View, Text, Pressable, ActivityIndicator, ScrollView, StyleSheet, LayoutChangeEvent } from 'react-native'
import { useEffect, useRef, useState } from 'react'
import { TmdbTvSeason, TmdbEpisode, getSeasonDetails } from '@/lib/tmdb'
import { colors, radius, spacing, typography } from '@/theme'
import { EpisodeRow } from './EpisodeRow'
import { ConfirmPreviousModal } from './ConfirmPreviousModal'
import { ConfirmMarkSeasonModal } from './ConfirmMarkSeasonModal'
import { EpisodeDetailModal } from './EpisodeDetailModal'


// Chave = posição do episódio dentro da temporada (1, 2, 3…), e não o episode_number do TMDB.
// Animes costumam ter numeração absoluta (T2 começa no ep. 62), e o resto do app
// (Finalizado, conclusão automática, temporadas anteriores) trabalha com posição.
function episodeKey(seasonNumber: number, position: number) {
  return `${seasonNumber}-${position}`
}

interface SeasonItemProps {
  season: TmdbTvSeason
  tmdbId: number
  watchedEpisodes: string[]
  previousSeasons: TmdbTvSeason[]
  onToggleEpisode: (key: string) => void
  onMarkEpisodes: (keys: string[]) => void
  onUnmarkEpisodes: (keys: string[]) => void
  onReplaceEpisodes: (remove: string[], add: string[]) => void
}

export function SeasonItem({
  season,
  tmdbId,
  watchedEpisodes,
  previousSeasons,
  onToggleEpisode,
  onMarkEpisodes,
  onUnmarkEpisodes,
  onReplaceEpisodes,
}: SeasonItemProps) {
  const [expanded, setExpanded] = useState(false)
  const [episodes, setEpisodes] = useState<TmdbEpisode[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [pendingKeys, setPendingKeys] = useState<{ toMark: string[]; previous: string[] } | null>(null)
  const [confirmSeason, setConfirmSeason] = useState<{ mode: 'mark' | 'unmark'; keys: string[] } | null>(null)
  const [detailEpisodeNumber, setDetailEpisodeNumber] = useState<number | null>(null)

  const keyAt = (index: number) => episodeKey(season.season_number, index + 1)
  const isWatched = (index: number) => watchedEpisodes.includes(keyAt(index))

  // Migra chaves antigas gravadas com o episode_number absoluto (ex.: "2-62") para a posição ("2-1").
  // Só números maiores que o tamanho da temporada são inequivocamente antigos.
  useEffect(() => {
    if (!episodes) return
    const legacy: string[] = []
    const replacement: string[] = []
    episodes.forEach((ep, i) => {
      if (ep.episode_number <= episodes.length) return
      const oldKey = episodeKey(season.season_number, ep.episode_number)
      if (!watchedEpisodes.includes(oldKey)) return
      legacy.push(oldKey)
      replacement.push(keyAt(i))
    })
    if (legacy.length > 0) onReplaceEpisodes(legacy, replacement)
  }, [episodes, watchedEpisodes])

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

  const scrollRef = useRef<ScrollView>(null)
  // Ativado a cada abertura; consumido no onLayout do último episódio assistido
  const pendingScroll = useRef(false)

  const handleExpand = async () => {
    if (!expanded) {
      const eps = episodes ?? await loadEpisodes()
      pendingScroll.current = eps.some((_, i) => isWatched(i))
    }
    setExpanded((prev) => !prev)
  }

  const lastWatchedIndex = (episodes ?? []).reduce<number | null>(
    (last, _, i) => (isWatched(i) ? i : last),
    null
  )

  const handleLastWatchedLayout = (e: LayoutChangeEvent) => {
    if (!pendingScroll.current) return
    pendingScroll.current = false
    const y = e.nativeEvent.layout.y
    // Pequeno atraso para a lista aparecer no topo antes de deslizar até o episódio
    setTimeout(() => scrollRef.current?.scrollTo({ y, animated: true }), 150)
  }

  const allSeasonKeys = Array.from(
    { length: season.episode_count },
    (_, i) => keyAt(i)
  )

  const watchedCount = episodes
    ? episodes.filter((_, i) => isWatched(i)).length
    : allSeasonKeys.filter((k) => watchedEpisodes.includes(k)).length

  const allWatched = season.episode_count > 0 && watchedCount === season.episode_count

  const label = season.season_number === 0 ? 'E' : `T${season.season_number}`

  const getPreviousSeasonUnwatched = () =>
    previousSeasons
      .flatMap((s) =>
        Array.from({ length: s.episode_count }, (_, i) => episodeKey(s.season_number, i + 1))
      )
      .filter((k) => !watchedEpisodes.includes(k))

  const handleEpisodePress = (index: number) => {
    const key = keyAt(index)
    if (watchedEpisodes.includes(key)) {
      onToggleEpisode(key)
      return
    }

    const inCurrentSeason = (episodes ?? [])
      .slice(0, index)
      .map((_, i) => keyAt(i))
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
    const allKeys = eps.map((_, i) => keyAt(i))
    const allCurrentWatched = allKeys.length > 0 && allKeys.every((k) => watchedEpisodes.includes(k))

    if (allCurrentWatched) {
      // Remove tudo desta temporada, inclusive eventuais chaves antigas que sobraram
      const prefix = `${season.season_number}-`
      const seasonKeys = watchedEpisodes.filter((k) => k.startsWith(prefix))
      setConfirmSeason({ mode: 'unmark', keys: seasonKeys })
      return
    }

    const unwatchedInSeason = allKeys.filter((k) => !watchedEpisodes.includes(k))
    const previousUnwatched = getPreviousSeasonUnwatched()

    if (previousUnwatched.length === 0) {
      setConfirmSeason({ mode: 'mark', keys: unwatchedInSeason })
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
          testID={`season-checkbox-${season.season_number}`}
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
        <ScrollView
          ref={scrollRef}
          testID={`episode-list-${season.season_number}`}
          style={styles.episodeScroll}
          contentContainerStyle={styles.episodeList}
          nestedScrollEnabled
          showsVerticalScrollIndicator
          indicatorStyle="white"
        >
          {loading ? (
            <ActivityIndicator color={colors.primary} style={{ paddingVertical: spacing.md }} />
          ) : episodes && episodes.length > 0 ? (
            episodes.map((ep, i) => (
              <View
                key={ep.id}
                onLayout={i === lastWatchedIndex ? handleLastWatchedLayout : undefined}
              >
                <EpisodeRow
                  episode={ep}
                  watched={isWatched(i)}
                  onToggle={() => handleEpisodePress(i)}
                  onInfo={() => setDetailEpisodeNumber(ep.episode_number)}
                />
              </View>
            ))
          ) : (
            <Text style={styles.noEpisodes}>Nenhum episódio encontrado.</Text>
          )}
        </ScrollView>
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

      <ConfirmMarkSeasonModal
        visible={confirmSeason !== null}
        mode={confirmSeason?.mode ?? 'mark'}
        count={confirmSeason?.mode === 'unmark' ? (episodes?.length ?? season.episode_count) : (confirmSeason?.keys.length ?? 0)}
        onConfirm={() => {
          if (confirmSeason?.mode === 'mark') onMarkEpisodes(confirmSeason.keys)
          if (confirmSeason?.mode === 'unmark') onUnmarkEpisodes(confirmSeason.keys)
          setConfirmSeason(null)
        }}
        onCancel={() => setConfirmSeason(null)}
      />

      <EpisodeDetailModal
        visible={detailEpisodeNumber !== null}
        tmdbId={tmdbId}
        seasonNumber={season.season_number}
        episodeNumber={detailEpisodeNumber ?? 0}
        onClose={() => setDetailEpisodeNumber(null)}
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
  episodeScroll: {
    maxHeight: 360,
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
