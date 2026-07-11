import { View, Text } from 'react-native'
import { colors, typography } from '@/theme'

interface Props {
  message: string
}

export function SearchEmpty({ message }: Props) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ ...typography.body, color: colors.textAuxiliary }}>{message}</Text>
    </View>
  )
}
