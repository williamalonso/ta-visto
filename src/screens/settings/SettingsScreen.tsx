import { Text, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing, typography } from '@/theme'
import { BackupSection } from './components/BackupSection'

export default function SettingsScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView
        contentContainerStyle={{ padding: spacing.xl, gap: spacing.xl, paddingBottom: spacing.xxxl }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ ...typography.h2, color: colors.textPrimary }}>Configurações</Text>
        <BackupSection />
      </ScrollView>
    </SafeAreaView>
  )
}
