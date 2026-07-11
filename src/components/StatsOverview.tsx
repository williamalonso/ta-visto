import { View, Text, StyleSheet, Platform, Pressable } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { colors, radius, spacing, typography } from '@/theme'

interface StatCardProps {
  value: number
  label: string
  gradientColors: [string, string]
  glowColor: string
  onPress?: () => void
}

function neonShadow(color: string) {
  return Platform.select({
    web: { boxShadow: `0 0 14px ${color}80, 0 4px 8px ${color}40` },
    default: {
      shadowColor: color,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.6,
      shadowRadius: 12,
      elevation: 8,
    },
  })
}

function StatCard({ value, label, gradientColors, glowColor, onPress }: StatCardProps) {
  return (
    <Pressable style={styles.cardWrapper} onPress={onPress}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, neonShadow(glowColor)]}
      >
        <Text style={styles.number}>{value}</Text>
        <Text style={styles.label}>{label}</Text>
      </LinearGradient>
    </Pressable>
  )
}

interface StatsOverviewProps {
  totalMovies: number
  totalSeries: number
  watching: number
  completed: number
  onCompletedPress?: () => void
}

export function StatsOverview({ totalMovies, totalSeries, watching, completed, onCompletedPress }: StatsOverviewProps) {
  return (
    <View style={styles.grid}>
      <StatCard value={totalMovies} label="Filmes" gradientColors={['#F59E0B', '#D97706']} glowColor="#F59E0B" />
      <StatCard value={totalSeries} label="Séries" gradientColors={['#10B981', '#059669']} glowColor="#10B981" />
      <StatCard value={watching} label="Assistindo" gradientColors={['#3B82F6', '#2563EB']} glowColor="#3B82F6" />
      <StatCard value={completed} label="Finalizados" gradientColors={['#8B5CF6', '#7C3AED']} glowColor="#8B5CF6" onPress={onCompletedPress} />
    </View>
  )
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  cardWrapper: {
    flexBasis: '47%',
    flexGrow: 1,
  },
  card: {
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
