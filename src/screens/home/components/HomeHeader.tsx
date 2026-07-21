import { View, Text, Platform } from 'react-native'
import { SymbolView } from 'expo-symbols'
import { colors, spacing, typography, radius } from '@/theme'

function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia,'
  if (h < 18) return 'Boa tarde,'
  return 'Boa noite,'
}

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

interface Props {
  totalCount: number
}

export function HomeHeader({ totalCount }: Props) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.lg }}>
      <View style={{ gap: 2 }}>
        <Text style={{ ...typography.h2, color: colors.textPrimary }}>Tá Visto</Text>
        <Text style={{ ...typography.body, color: colors.textSecondary }}>{greeting()}</Text>
        {totalCount > 0 && (
          <Text style={{ ...typography.auxiliary, color: colors.textAuxiliary, marginTop: 2 }}>
            {totalCount} {totalCount === 1 ? 'título' : 'títulos'} na sua lista
          </Text>
        )}
      </View>
      <View style={{
        width: 42,
        height: 42,
        borderRadius: radius.pill,
        backgroundColor: colors.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.primary + '40',
        ...neonIconShadow,
      }}>
        <SymbolView
          name={{ ios: 'film.stack', android: 'movie', web: 'movie' }}
          size={20}
          tintColor={colors.primary}
        />
      </View>
    </View>
  )
}
