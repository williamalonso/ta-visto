import { Text, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { colors, spacing, typography } from '@/theme'
import { BackupSection } from './components/BackupSection'
import { InstallSection } from './components/InstallSection'

export default function SettingsScreen() {
  const handleImportSuccess = () => {
    router.replace({ pathname: '/', params: { importSuccess: '1' } })
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView
        contentContainerStyle={{ padding: spacing.xl, gap: spacing.xl, paddingBottom: spacing.xxxl }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ ...typography.h2, color: colors.textPrimary }}>Configurações</Text>
        <InstallSection />
        <BackupSection onImportSuccess={handleImportSuccess} />
      </ScrollView>
    </SafeAreaView>
  )
}
