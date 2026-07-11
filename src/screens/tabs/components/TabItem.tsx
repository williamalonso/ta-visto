/*

Este componente represente um item de aba (tab).

*/

import { Pressable, View, Text, StyleSheet } from 'react-native'
import { SymbolView } from 'expo-symbols'
import { colors } from '@/theme'
import { ICONS, PILL_W, PILL_H } from '../constants'

type Props = {
  index: number
  focused: boolean
  label: string
  onPress: () => void
}

export function TabItem({ index, focused, label, onPress }: Props) {
  return (
    <Pressable style={styles.item} onPress={onPress}>
      <View style={styles.iconWrap}>
        <SymbolView
          name={ICONS[index]}
          size={22}
          tintColor={focused ? colors.primary : colors.textSecondary}
        />
      </View>
      <Text style={[styles.label, focused && styles.labelActive]}>
        {label}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  iconWrap: {
    width: PILL_W,
    height: PILL_H,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  labelActive: {
    color: colors.primary,
  },
})
