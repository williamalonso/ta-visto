import { View, Text, Pressable, Modal, StyleSheet } from 'react-native'
import { colors, radius, spacing, typography } from '@/theme'

interface ConfirmPreviousModalProps {
  visible: boolean
  count: number
  onJustThis: () => void
  onAllPrevious: () => void
  onCancel: () => void
}

export function ConfirmPreviousModal({ visible, count, onJustThis, onAllPrevious, onCancel }: ConfirmPreviousModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable style={styles.dialog} onPress={() => {}}>
          <Text style={styles.dialogTitle}>Marcar anteriores?</Text>
          <Text style={styles.dialogBody}>
            Há {count} episódio(s) anteriores não assistidos. Deseja marcá-los também?
          </Text>
          <View style={styles.dialogActions}>
            <Pressable style={[styles.dialogBtn, styles.secondary]} onPress={onCancel}>
              <Text style={styles.secondaryText}>Cancelar</Text>
            </Pressable>
            <Pressable style={[styles.dialogBtn, styles.outline]} onPress={onJustThis}>
              <Text style={styles.outlineText}>Só este</Text>
            </Pressable>
            <Pressable style={[styles.dialogBtn, styles.primary]} onPress={onAllPrevious}>
              <Text style={styles.primaryText}>Todos + este</Text>
            </Pressable>
          </View>
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
  dialog: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 380,
    gap: spacing.md,
  },
  dialogTitle: {
    ...typography.sectionTitle,
    color: colors.textPrimary,
  },
  dialogBody: {
    ...typography.body,
    color: colors.textSecondary,
  },
  dialogActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  dialogBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  secondary: {
    backgroundColor: colors.surfaceSecondary,
  },
  secondaryText: {
    ...typography.auxiliary,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  outline: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  outlineText: {
    ...typography.auxiliary,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  primary: {
    backgroundColor: colors.primary,
  },
  primaryText: {
    ...typography.auxiliary,
    color: colors.black,
    fontWeight: '700',
  },
})
