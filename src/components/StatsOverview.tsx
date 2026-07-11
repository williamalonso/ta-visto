import { View, Text, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { colors, radius, spacing, typography } from '@/theme'

interface StatCardProps {
  value: number
  label: string
  gradientColors: [string, string]
}

function StatCard({ value, label, gradientColors }: StatCardProps) {
  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <Text style={styles.number}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </LinearGradient>
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
      <StatCard value={totalMovies} label="Filmes" gradientColors={['#F59E0B', '#D97706']} />
      <StatCard value={totalSeries} label="Séries" gradientColors={['#10B981', '#059669']} />
      <StatCard value={watching} label="Assistindo" gradientColors={['#3B82F6', '#2563EB']} />
      <StatCard value={completed} label="Finalizados" gradientColors={['#8B5CF6', '#7C3AED']} />
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
    borderRadius: radius.lg,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  number: {
    ...typography.statNumber,
    color: colors.white,
    lineHeight: 40,
  },
  label: {
    ...typography.auxiliary,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
  },
})
