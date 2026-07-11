import { View, Text, Modal, Pressable, StyleSheet } from 'react-native'
import { SymbolView } from 'expo-symbols'
import { colors, radius, spacing, typography } from '@/theme'

interface Props {
  visible: boolean
  title: string
  onConfirm: () => void
  onClose: () => void
}

export function DeleteConfirmModal({ visible, title, onConfirm, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.card} onPress={() => {}}>
          <View style={styles.iconWrap}>
            <SymbolView
              name={{ ios: 'trash.fill', android: 'delete', web: 'delete' }}
              size={28}
              tintColor={colors.error}
            />
          </View>
          <Text style={styles.heading}>Remover da lista</Text>
          <Text style={styles.body}>
            Tem certeza que deseja remover{'\n'}
            <Text style={styles.titleText}>"{title}"</Text>
            {'\n'}da sua lista?
          </Text>
          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [styles.btn, styles.btnCancel, pressed && styles.pressed]}
              onPress={onClose}
            >
              <Text style={styles.btnCancelText}>Cancelar</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.btn, styles.btnDelete, pressed && styles.pressed]}
              onPress={() => { onConfirm(); onClose() }}
            >
              <Text style={styles.btnDeleteText}>Remover</Text>
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
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    gap: spacing.md,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: `${colors.error}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  heading: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  body: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  titleText: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
    width: '100%',
  },
  btn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  btnCancel: {
    backgroundColor: colors.surfaceSecondary,
  },
  btnCancelText: {
    ...typography.cardTitle,
    color: colors.textSecondary,
  },
  btnDelete: {
    backgroundColor: colors.error,
  },
  btnDeleteText: {
    ...typography.cardTitle,
    color: colors.white,
  },
})
