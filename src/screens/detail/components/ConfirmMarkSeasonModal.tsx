import { View, Text, Pressable, Modal, StyleSheet } from 'react-native'
import { colors, radius, spacing, typography } from '@/theme'

interface Props {
  visible: boolean
  mode: 'mark' | 'unmark'
  count: number
  onConfirm: () => void
  onCancel: () => void
}

const COPY = {
  mark: {
    title: 'Marcar temporada?',
    body: (count: number) => `Marcar todos os ${count} episódios como assistidos?`,
    confirm: 'Confirmar',
  },
  unmark: {
    title: 'Desmarcar temporada?',
    body: (count: number) => `Desmarcar todos os ${count} episódios desta temporada?`,
    confirm: 'Desmarcar',
  },
}

export function ConfirmMarkSeasonModal({ visible, mode, count, onConfirm, onCancel }: Props) {
  const copy = COPY[mode]
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable style={styles.dialog} onPress={() => {}}>
          <Text style={styles.title}>{copy.title}</Text>
          <Text style={styles.body}>{copy.body(count)}</Text>
          <View style={styles.actions}>
            <Pressable style={[styles.btn, styles.secondary]} onPress={onCancel}>
              <Text style={styles.secondaryText}>Cancelar</Text>
            </Pressable>
            <Pressable
              testID="confirm-mark-season-btn"
              style={[styles.btn, mode === 'unmark' ? styles.danger : styles.primary]}
              onPress={onConfirm}
            >
              <Text style={mode === 'unmark' ? styles.dangerText : styles.primaryText}>{copy.confirm}</Text>
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
  title: {
    ...typography.sectionTitle,
    color: colors.textPrimary,
  },
  body: {
    ...typography.body,
    color: colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  btn: {
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
  primary: {
    backgroundColor: colors.primary,
  },
  danger: {
    backgroundColor: colors.error,
  },
  dangerText: {
    ...typography.auxiliary,
    color: colors.white,
    fontWeight: '700',
  },
  primaryText: {
    ...typography.auxiliary,
    color: colors.black,
    fontWeight: '700',
  },
})
