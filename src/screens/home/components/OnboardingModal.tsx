import { View, Text, Modal, Pressable, StyleSheet } from 'react-native'
import { SymbolView } from 'expo-symbols'
import { colors, radius, spacing, typography } from '@/theme'

interface Props {
  visible: boolean
  onClose: () => void
}

const features = [
  {
    icon: { ios: 'magnifyingglass', android: 'search', web: 'search' } as const,
    title: 'Busque',
    description: 'Encontre filmes e séries pelo nome',
  },
  {
    icon: { ios: 'list.bullet', android: 'list', web: 'list' } as const,
    title: 'Organize',
    description: 'Classifique por status: assistindo, pretendo assistir, finalizado',
  },
  {
    icon: { ios: 'play.circle', android: 'play_circle', web: 'play_circle' } as const,
    title: 'Acompanhe',
    description: 'Marque episódios por temporada e rastreie seu progresso',
  },
]

export function OnboardingModal({ visible, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.appName}>TÁ VISTO</Text>
          <Text style={styles.title}>Bem-vindo</Text>
          <Text style={styles.subtitle}>Sua lista pessoal de filmes e séries</Text>

          <View style={styles.features}>
            {features.map((f) => (
              <View key={f.title} style={styles.featureRow}>
                <View style={styles.iconWrap}>
                  <SymbolView name={f.icon} size={20} tintColor={colors.primary} />
                </View>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>{f.title}</Text>
                  <Text style={styles.featureDesc}>{f.description}</Text>
                </View>
              </View>
            ))}
          </View>

          <Pressable
            testID="onboarding-start-btn"
            style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
            onPress={onClose}
          >
            <Text style={styles.btnText}>Começar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xxl,
    width: '100%',
    maxWidth: 400,
    gap: spacing.md,
  },
  appName: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
    color: colors.primary,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  features: {
    gap: spacing.lg,
    marginVertical: spacing.md,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    flex: 1,
    gap: 2,
  },
  featureTitle: {
    ...typography.cardTitle,
    color: colors.textPrimary,
  },
  featureDesc: {
    ...typography.auxiliary,
    color: colors.textSecondary,
  },
  btn: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  btnPressed: {
    opacity: 0.8,
  },
  btnText: {
    ...typography.cardTitle,
    color: colors.black,
    fontWeight: '700',
  },
})
