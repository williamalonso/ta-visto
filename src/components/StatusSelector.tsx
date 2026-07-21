import { View, Text, Pressable, StyleSheet, Modal } from 'react-native'
import { MediaStatus } from '@/types'
import { colors, radius, spacing, typography, shadows } from '@/theme'

const MOVIE_STATUSES: Array<{ value: MediaStatus; label: string }> = [
  { value: 'watching', label: 'Assistindo' },
  { value: 'plan_to_watch', label: 'Pretendo assistir' },
  { value: 'on_hold', label: 'Assistir depois' },
  { value: 'completed', label: 'Finalizado' },
]

const SERIES_STATUSES: Array<{ value: MediaStatus; label: string }> = [
  { value: 'watching', label: 'Assistindo' },
  { value: 'plan_to_watch', label: 'Pretendo assistir' },
  { value: 'on_hold', label: 'Assistir depois' },
  { value: 'up_to_date', label: 'Em dia' },
  { value: 'completed', label: 'Finalizado' },
]

const STATUS_COLORS: Record<MediaStatus, string> = {
  watching: colors.watching,
  plan_to_watch: colors.planned,
  on_hold: colors.paused,
  up_to_date: colors.upToDate,
  completed: colors.completed,
}

interface StatusSelectorProps {
  visible: boolean
  mediaType: 'movie' | 'tv'
  onSelect: (status: MediaStatus) => void
  onClose: () => void
}

export function StatusSelector({ visible, mediaType, onSelect, onClose }: StatusSelectorProps) {
  const statuses = mediaType === 'tv' ? SERIES_STATUSES : MOVIE_STATUSES

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => undefined}>
          <View style={styles.handle} />
          <Text style={styles.title}>Selecionar status</Text>
          {statuses.map((s) => (
            <Pressable
              key={s.value}
              style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
              onPress={() => onSelect(s.value)}
            >
              <View style={[styles.dot, { backgroundColor: STATUS_COLORS[s.value] }]} />
              <Text style={styles.optionLabel}>{s.label}</Text>
            </Pressable>
          ))}
        </Pressable>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
    ...shadows.md,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: radius.pill,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.sectionTitle,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  optionPressed: {
    opacity: 0.6,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  optionLabel: {
    fontSize: 16,
    color: colors.textPrimary,
  },
})
