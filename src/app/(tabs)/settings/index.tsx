import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ExportButton } from '@/components/ExportButton'
import { ImportButton } from '@/components/ImportButton'
import { colors, spacing, typography } from '@/theme'

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Configurações</Text>

        <Text style={styles.sectionLabel}>BACKUP</Text>
        <View style={styles.section}>
          <ExportButton />
          <ImportButton />
        </View>

        <Text style={styles.infoText}>
          A importação substitui permanentemente todos os dados atuais. Exporte um backup antes de
          importar.
        </Text>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.xl,
    gap: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textAuxiliary,
    letterSpacing: 1,
  },
  section: {
    gap: spacing.md,
  },
  infoText: {
    ...typography.auxiliary,
    color: colors.textAuxiliary,
    textAlign: 'center',
    lineHeight: 18,
  },
})
