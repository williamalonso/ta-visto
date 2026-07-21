import { View, Text } from 'react-native'
import { ExportButton } from '@/components/ExportButton'
import { ImportButton } from '@/components/ImportButton'
import { colors, spacing, typography } from '@/theme'

interface Props {
  onImportSuccess?: () => void
}

export function BackupSection({ onImportSuccess }: Props) {
  return (
    <>
      <Text style={{ fontSize: 11, fontWeight: '600', color: colors.textAuxiliary, letterSpacing: 1 }}>BACKUP</Text>
      <View style={{ gap: spacing.md }}>
        <ExportButton />
        <ImportButton onSuccess={onImportSuccess} />
      </View>
      <Text style={{ ...typography.auxiliary, color: colors.textAuxiliary, textAlign: 'center', lineHeight: 20 }}>
        {'📤 Exportar — salva todos os seus filmes e séries em um arquivo no seu dispositivo.\n\n📥 Importar — carrega um arquivo exportado anteriormente e restaura seus dados.\n\n⚠️ A importação apaga tudo que está salvo atualmente. Exporte um backup antes de importar para não perder nada.'}
      </Text>
    </>
  )
}
