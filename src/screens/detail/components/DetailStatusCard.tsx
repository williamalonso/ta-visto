import { View, Text, Pressable, StyleSheet } from 'react-native'
import { MediaItem, MediaStatus } from '@/types'
import { colors, radius, spacing, typography, shadows } from '@/theme'

const STATUS_COLORS: Record<MediaStatus, string> = {
  watching: colors.watching,
  plan_to_watch: colors.planned,
  on_hold: colors.paused,
  up_to_date: colors.success,
  completed: colors.completed,
}

const STATUS_LABELS: Record<MediaStatus, string> = {
  watching: 'Assistindo',
  plan_to_watch: 'Pretendo assistir',
  on_hold: 'Assistir depois',
  up_to_date: 'Em dia',
  completed: 'Finalizado',
}

type Props = {
  item: MediaItem
  onPress: () => void
}

export function DetailStatusCard({ item, onPress }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [styles.statusCard, pressed && styles.statusCardPressed]}
      onPress={onPress}
    >
      <View style={[styles.statusDot, { backgroundColor: STATUS_COLORS[item.status] }]} />
      <Text style={styles.statusLabel}>{STATUS_LABELS[item.status]}</Text>
      <Text style={styles.statusAction}>Alterar</Text>
      <Text style={styles.statusChevron}>›</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  statusCardPressed: {
    opacity: 0.7,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusLabel: {
    flex: 1,
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  statusAction: {
    ...typography.auxiliary,
    color: colors.textSecondary,
  },
  statusChevron: {
    fontSize: 20,
    color: colors.textAuxiliary,
  },
})
