import { View, Text } from 'react-native'
import { MediaStatus } from '@/types'
import { colors, spacing, typography } from '@/theme'

interface Props {
  filter: MediaStatus | 'all'
}

export function MoviesEmpty({ filter }: Props) {
  return (
    <View style={{ alignItems: 'center', paddingVertical: spacing.huge, paddingHorizontal: spacing.xl }}>
      <Text style={{ ...typography.body, color: colors.textSecondary, textAlign: 'center' }}>
        {filter === 'all' ? 'Nenhum filme adicionado.' : 'Nenhum filme nesta categoria.'}
      </Text>
    </View>
  )
}
