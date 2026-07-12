import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Skeleton } from '@/components/Skeleton'
import { colors, spacing } from '@/theme'

export function MediaListLoading() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <View style={{ padding: spacing.xl, gap: spacing.xl }}>
        <Skeleton width="50%" height={28} />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <View key={i} style={{ width: '30%' }}>
              <Skeleton width="100%" height={140} borderRadius={12} />
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  )
}
