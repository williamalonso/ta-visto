import { View, Text } from 'react-native'
import { StatsOverview } from '@/components/StatsOverview'
import { Skeleton } from '@/components/Skeleton'
import { colors, spacing, typography, radius } from '@/theme'

interface Props {
  loading: boolean
  totalMovies: number
  totalSeries: number
  watching: number
  completed: number
}

export function StatsSummary({ loading, totalMovies, totalSeries, watching, completed }: Props) {
  return (
    <>
      <Text style={{ ...typography.sectionTitle, color: colors.textPrimary, marginBottom: spacing.md }}>Resumo</Text>
      {loading ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={{ flexBasis: '47%', flexGrow: 1 }}>
              <Skeleton width="100%" height={84} borderRadius={radius.lg} />
            </View>
          ))}
        </View>
      ) : (
        <StatsOverview
          totalMovies={totalMovies}
          totalSeries={totalSeries}
          watching={watching}
          completed={completed}
        />
      )}
    </>
  )
}
