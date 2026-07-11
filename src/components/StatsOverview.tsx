import { View, Text, StyleSheet } from 'react-native'
import { colors, radius, spacing, typography, shadows } from '@/theme'

interface StatCardProps {
  value: number
  label: string
  color: string
}

function StatCard({ value, label, color }: StatCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.number}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.bar, { backgroundColor: color }]} />
    </View>
  )
}

interface StatsOverviewProps {
  totalMovies: number
  totalSeries: number
  watching: number
  completed: number
}

export function StatsOverview({ totalMovies, totalSeries, watching, completed }: StatsOverviewProps) {
  return (
    <View style={styles.grid}>
      <StatCard value={totalMovies} label="Filmes" color={colors.primary} />
      <StatCard value={totalSeries} label="Séries" color={colors.completed} />
      <StatCard value={watching} label="Assistindo" color={colors.watching} />
      <StatCard value={completed} label="Finalizados" color={colors.paused} />
    </View>
  )
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  card: {
    flexBasis: '47%',
    flexGrow: 1,
    height: 84,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    justifyContent: 'center',
    overflow: 'hidden',
    ...shadows.sm,
  },
  number: {
    ...typography.statNumber,
    color: colors.textPrimary,
    lineHeight: 40,
  },
  label: {
    ...typography.auxiliary,
    color: colors.textSecondary,
    marginTop: 2,
  },
  bar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
  },
})
