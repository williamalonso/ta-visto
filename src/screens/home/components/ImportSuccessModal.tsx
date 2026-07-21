import { View, Text, Modal, Pressable, StyleSheet } from 'react-native'
import { SymbolView } from 'expo-symbols'
import { colors, radius, spacing, typography, shadows } from '@/theme'

interface Props {
  visible: boolean
  onClose: () => void
}

export function ImportSuccessModal({ visible, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.card} onPress={() => {}}>
          <View style={styles.iconContainer}>
            <SymbolView
              name={{ ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' }}
              size={48}
              tintColor={colors.success}
            />
          </View>
          <Text style={styles.title}>Importação concluída</Text>
          <Text style={styles.description}>
            Seus dados foram restaurados com sucesso. Navegue pelas abas para ver tudo atualizado.
          </Text>
          <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]} onPress={onClose}>
            <Text style={styles.buttonText}>Entendido</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xxl,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    gap: spacing.md,
    ...shadows.card,
  },
  iconContainer: {
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  button: {
    marginTop: spacing.sm,
    backgroundColor: colors.success,
    borderRadius: radius.pill,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxxl,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    ...typography.cardTitle,
    color: colors.black,
  },
})
