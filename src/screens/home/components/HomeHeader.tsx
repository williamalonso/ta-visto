import { View, Text, Platform } from 'react-native'
import { colors, spacing, typography, radius } from '@/theme'

const neonTextShadow = Platform.select({
  web: { textShadow: `0 0 8px ${colors.primary}, 0 0 20px ${colors.primary}40` },
  default: {
    textShadowColor: colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
})

const neonIconShadow = Platform.select({
  web: { boxShadow: `0 0 12px ${colors.primary}, 0 0 30px ${colors.primary}60` },
  default: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 14,
    elevation: 10,
  },
})

export function HomeHeader() {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xxl }}>
      <View>
        <Text style={{ ...typography.h2, color: colors.textPrimary}}>Tá Visto</Text>
        <Text style={{ ...typography.body, color: colors.textSecondary, marginTop: 2 }}>O que está assistindo?</Text>
      </View>
      <View style={{ width: 40, height: 40, borderRadius: radius.pill, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', ...neonIconShadow }}>
        <Text style={{ ...typography.auxiliary, fontWeight: '700', color: colors.white }}>TV</Text>
      </View>
    </View>
  )
}
