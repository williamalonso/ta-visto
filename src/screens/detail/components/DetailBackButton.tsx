import { Pressable, Text, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { colors, spacing } from '@/theme'

export function DetailBackButton() {
  return (
    <Pressable style={styles.backBtn} onPress={() => router.back()}>
      <Text style={styles.backText}>‹ Voltar</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  backBtn: {
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: '600',
  },
})
