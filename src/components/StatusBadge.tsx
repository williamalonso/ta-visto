import { View, Text, StyleSheet } from 'react-native'
import { MediaStatus } from '@/types'
import { colors, radius, spacing, typography } from '@/theme'

const STATUS_CONFIG: Record<MediaStatus, { label: string; color: string }> = {
  watching: { label: 'Assistindo', color: colors.watching },
  plan_to_watch: { label: 'Pretendo', color: colors.planned },
  on_hold: { label: 'Pausado', color: colors.paused },
  up_to_date: { label: 'Em dia', color: colors.upToDate },
  completed: { label: 'Finalizado', color: colors.completed },
}

interface StatusBadgeProps {
  status: MediaStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, color } = STATUS_CONFIG[status]
  return (
    <View style={[styles.badge, { backgroundColor: color + '20' }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    gap: spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    ...typography.auxiliary,
    fontWeight: '600',
  },
})
