import { Pressable, View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { SymbolView } from 'expo-symbols'
import { useState } from 'react'
import { useBackup } from '@/hooks/useBackup'
import { colors, radius, spacing, typography, shadows } from '@/theme'

export function ExportButton() {
  const { exportData } = useBackup()
  const [loading, setLoading] = useState(false)

  const handlePress = async () => {
    setLoading(true)
    try {
      await exportData()
    } catch {
      // share sheet cancellation throws — ignore
    } finally {
      setLoading(false)
    }
  }

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={handlePress}
      disabled={loading}
    >
      <View style={styles.iconContainer}>
        <SymbolView
          name={{ ios: 'square.and.arrow.up', android: 'upload', web: 'upload' }}
          size={22}
          tintColor={colors.primary}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Exportar dados</Text>
        <Text style={styles.description}>Gera um arquivo JSON com todos os seus dados</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="small" color={colors.primary} />
      ) : (
        <SymbolView
          name={{ ios: 'chevron.right', android: 'arrow_forward_ios', web: 'chevron_right' }}
          size={16}
          tintColor={colors.textAuxiliary}
        />
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadows.sm,
  },
  pressed: {
    opacity: 0.7,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...typography.cardTitle,
    color: colors.textPrimary,
  },
  description: {
    ...typography.auxiliary,
    color: colors.textSecondary,
    marginTop: 2,
  },
})
