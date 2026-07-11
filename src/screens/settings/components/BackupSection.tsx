import { View, Text } from 'react-native'
import { ExportButton } from '@/components/ExportButton'
import { ImportButton } from '@/components/ImportButton'
import { colors, spacing, typography } from '@/theme'

export function BackupSection() {
  return (
    <>
      <Text style={{ fontSize: 11, fontWeight: '600', color: colors.textAuxiliary, letterSpacing: 1 }}>BACKUP</Text>
      <View style={{ gap: spacing.md }}>
        <ExportButton />
        <ImportButton />
      </View>
      <Text style={{ ...typography.auxiliary, color: colors.textAuxiliary, textAlign: 'center', lineHeight: 18 }}>
        A importação substitui permanentemente todos os dados atuais. Exporte um backup antes de importar.
      </Text>
    </>
  )
}
