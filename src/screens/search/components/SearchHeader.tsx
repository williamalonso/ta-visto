import { View, Text } from 'react-native'
import { SearchBar } from '@/components/SearchBar'
import { Chip } from '@/components/Chip'
import { colors, spacing, typography } from '@/theme'

interface Props {
  query: string
  onQueryChange: (q: string) => void
  mediaType: 'movie' | 'tv'
  onMediaTypeChange: (type: 'movie' | 'tv') => void
}

export function SearchHeader({ query, onQueryChange, mediaType, onMediaTypeChange }: Props) {
  return (
    <View style={{ padding: spacing.xl, gap: spacing.md, backgroundColor: colors.background }}>
      <Text style={{ ...typography.h2, color: colors.textPrimary }}>Busca</Text>
      <SearchBar value={query} onChangeText={onQueryChange} placeholder="Buscar filmes e séries..." />
      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        <Chip label="Filme" active={mediaType === 'movie'} onPress={() => onMediaTypeChange('movie')} />
        <Chip label="Série" active={mediaType === 'tv'} onPress={() => onMediaTypeChange('tv')} />
      </View>
    </View>
  )
}
