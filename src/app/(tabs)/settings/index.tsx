import { View, Text, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ExportButton } from '@/components/ExportButton'
import { ImportButton } from '@/components/ImportButton'
import { styles } from '@/screens/settings/styles'

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
