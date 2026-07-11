import { View, Text, Pressable, StyleSheet } from 'react-native'
import { TmdbEpisode } from '@/lib/tmdb'
import { colors, spacing, typography } from '@/theme'

interface EpisodeRowProps {
  episode: TmdbEpisode
  watched: boolean
  onToggle: () => void
}

export function EpisodeRow({ episode, watched, onToggle }: EpisodeRowProps) {
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

const styles = StyleSheet.create({
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
})
