import { useCallback } from 'react'
import * as FileSystem from 'expo-file-system/legacy'
import * as Sharing from 'expo-sharing'
import * as DocumentPicker from 'expo-document-picker'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { BackupData, MediaItem } from '@/types'

const MOVIES_KEY = '@cinelist:movies'
const SERIES_KEY = '@cinelist:series'

export function useBackup() {
  const exportData = useCallback(async () => {
    const [moviesRaw, seriesRaw] = await Promise.all([
      AsyncStorage.getItem(MOVIES_KEY),
      AsyncStorage.getItem(SERIES_KEY),
    ])
    const backup: BackupData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      movies: moviesRaw ? (JSON.parse(moviesRaw) as MediaItem[]) : [],
      series: seriesRaw ? (JSON.parse(seriesRaw) as MediaItem[]) : [],
    }
    const date = new Date().toISOString().slice(0, 10)
    const filename = `cinelist-backup-${date}.json`
    const uri = `${FileSystem.cacheDirectory ?? ''}${filename}`
    await FileSystem.writeAsStringAsync(uri, JSON.stringify(backup, null, 2))
    await Sharing.shareAsync(uri, { mimeType: 'application/json', dialogTitle: 'Exportar backup' })
  }, [])

  const importData = useCallback(async (): Promise<'success' | 'cancelled' | 'error'> => {
    const result = await DocumentPicker.getDocumentAsync({ type: 'application/json' })
    if (result.canceled) return 'cancelled'
    const asset = result.assets[0]
    const raw = await FileSystem.readAsStringAsync(asset.uri)
    let data: BackupData
    try {
      data = JSON.parse(raw) as BackupData
    } catch {
      return 'error'
    }
    if (data.version !== 1 || !Array.isArray(data.movies) || !Array.isArray(data.series)) {
      return 'error'
    }
    await Promise.all([
      AsyncStorage.setItem(MOVIES_KEY, JSON.stringify(data.movies)),
      AsyncStorage.setItem(SERIES_KEY, JSON.stringify(data.series)),
    ])
    return 'success'
  }, [])

  return { exportData, importData }
}
