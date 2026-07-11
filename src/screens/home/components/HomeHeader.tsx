import { View, Text } from 'react-native'
import { colors, spacing, typography, radius } from '@/theme'

export function HomeHeader() {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xxl }}>
      <View>
        <Text style={{ ...typography.h2, color: colors.textPrimary }}>Tá Visto</Text>
        <Text style={{ ...typography.body, color: colors.textSecondary, marginTop: 2 }}>O que está assistindo?</Text>
      </View>
      <View style={{ width: 40, height: 40, borderRadius: radius.pill, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ ...typography.auxiliary, fontWeight: '700', color: colors.white }}>TV</Text>
      </View>
    </View>
  )
}
