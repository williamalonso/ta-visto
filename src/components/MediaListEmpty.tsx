import { View, Text } from 'react-native'
import { MediaStatus } from '@/types'
import { colors, spacing, typography } from '@/theme'

interface Props {
  mediaType: 'movie' | 'tv'
  filter: MediaStatus | 'all'
}

export function MediaListEmpty({ mediaType, filter }: Props) {
  const noun = mediaType === 'movie' ? 'filme' : 'série'
  const message = filter === 'all' ? `Nenhum ${noun} adicionado.` : `Nenhum ${noun} nesta categoria.`
  return (
    <View style={{ alignItems: 'center', paddingVertical: spacing.huge, paddingHorizontal: spacing.xl }}>
      <Text style={{ ...typography.body, color: colors.textSecondary, textAlign: 'center' }}>
        {message}
      </Text>
    </View>
  )
}
