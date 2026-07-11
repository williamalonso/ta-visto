import { Pressable, View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native'
import { SymbolView } from 'expo-symbols'
import { useState } from 'react'
import { useBackup } from '@/hooks/useBackup'
import { colors, radius, spacing, typography, shadows } from '@/theme'

interface ImportButtonProps {
  onSuccess?: () => void
}

export function ImportButton({ onSuccess }: ImportButtonProps) {
  const { importData } = useBackup()
  const [loading, setLoading] = useState(false)

  const handlePress = () => {
    Alert.alert(
      'Importar dados',
      'Isso vai substituir todos os seus dados atuais. Deseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Importar',
          style: 'destructive',
          onPress: async () => {
            setLoading(true)
            try {
              const result = await importData()
              if (result === 'success') {
                Alert.alert('Sucesso', 'Dados importados! Navegue pelas abas para ver os dados atualizados.')
                onSuccess?.()
              } else if (result === 'error') {
                Alert.alert('Erro', 'Arquivo inválido ou corrompido.')
              }
            } catch {
              Alert.alert('Erro', 'Não foi possível importar os dados.')
            } finally {
              setLoading(false)
            }
          },
        },
      ]
    )
  }

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={handlePress}
      disabled={loading}
    >
      <View style={styles.iconContainer}>
        <SymbolView
          name={{ ios: 'square.and.arrow.down', android: 'download', web: 'download' }}
          size={22}
          tintColor={colors.error}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Importar dados</Text>
        <Text style={styles.description}>Substitui todos os dados pelo arquivo selecionado</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="small" color={colors.error} />
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
    backgroundColor: colors.error + '15',
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
