import { View, Text, ScrollView, Pressable, StyleSheet, Platform } from 'react-native'
import { SymbolView } from 'expo-symbols'
import { Skeleton } from '@/components/Skeleton'
import { colors, spacing, typography, radius } from '@/theme'

interface Props {
  loading: boolean
  totalMovies: number
  totalSeries: number
  watching: number
  completed: number
  onWatchingPress?: () => void
  onCompletedPress?: () => void
}

interface ChipProps {
  icon: { ios: string; android: string; web: string }
  count: number
  label: string
  accent?: string
  onPress?: () => void
}

function StatChip({ icon, count, label, accent, onPress }: ChipProps) {
  const borderColor = accent ? accent + '50' : colors.border
  return (
    <Pressable
      style={({ pressed }) => [styles.chip, { borderColor }, pressed && { opacity: 0.7 }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <SymbolView name={icon} size={13} tintColor={accent ?? colors.textSecondary} />
      <Text style={[styles.count, accent ? { color: accent } : {}]}>{count}</Text>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  )
}

export function StatsSummary({ loading, totalMovies, totalSeries, watching, completed, onWatchingPress, onCompletedPress }: Props) {
  if (loading) {
    return (
      <View style={[styles.row, { paddingHorizontal: 0 }]}>
        {[100, 90, 110, 120].map((w, i) => (
          <Skeleton key={i} width={w} height={34} borderRadius={radius.pill} />
        ))}
      </View>
    )
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scrollOuter}
      contentContainerStyle={styles.row}
    >
      <StatChip
        icon={{ ios: 'film', android: 'movie', web: 'movie' }}
        count={totalMovies}
        label="Filmes"
      />
      <StatChip
        icon={{ ios: 'tv', android: 'tv', web: 'tv' }}
        count={totalSeries}
        label="Séries"
      />
      <StatChip
        icon={{ ios: 'play.circle.fill', android: 'play_circle', web: 'play_circle' }}
        count={watching}
        label="Assistindo"
        accent={colors.watching}
        onPress={onWatchingPress}
      />
      <StatChip
        icon={{ ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' }}
        count={completed}
        label="Finalizados"
        accent={colors.completed}
        onPress={onCompletedPress}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollOuter: {
    marginHorizontal: -spacing.xl,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    ...Platform.select({
      web: { boxShadow: '0px 1px 3px rgba(0,0,0,0.2)' },
      default: {},
    }),
  },
  count: {
    ...typography.auxiliary,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  label: {
    ...typography.auxiliary,
    color: colors.textSecondary,
  },
})
