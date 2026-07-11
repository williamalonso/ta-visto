import { View, Text } from 'react-native'
import { colors, spacing, typography } from '@/theme'

export function HomeEmptyState() {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.huge }}>
      <Text style={{ ...typography.body, color: colors.textSecondary, textAlign: 'center' }}>Nenhum título adicionado ainda.</Text>
      <Text style={{ ...typography.auxiliary, color: colors.textAuxiliary, textAlign: 'center', marginTop: spacing.sm }}>Use a aba Busca para adicionar filmes e séries.</Text>
    </View>
  )
}
