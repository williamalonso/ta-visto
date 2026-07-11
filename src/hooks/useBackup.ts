import { useCallback } from 'react'
import { Platform } from 'react-native'
import * as FileSystem from 'expo-file-system/legacy'
import * as Sharing from 'expo-sharing'
import * as DocumentPicker from 'expo-document-picker'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { BackupData, MediaItem } from '@/types'

const MOVIES_KEY = '@cinelist:movies'
const SERIES_KEY = '@cinelist:series'

async function buildBackup(): Promise<BackupData> {
  const [moviesRaw, seriesRaw] = await Promise.all([
    AsyncStorage.getItem(MOVIES_KEY),
    AsyncStorage.getItem(SERIES_KEY),
  ])
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    movies: moviesRaw ? (JSON.parse(moviesRaw) as MediaItem[]) : [],
    series: seriesRaw ? (JSON.parse(seriesRaw) as MediaItem[]) : [],
  }
}

async function applyBackup(data: BackupData) {
  await Promise.all([
    AsyncStorage.setItem(MOVIES_KEY, JSON.stringify(data.movies)),
    AsyncStorage.setItem(SERIES_KEY, JSON.stringify(data.series)),
  ])
}

function validateBackup(data: unknown): data is BackupData {
  const d = data as BackupData
  return d?.version === 1 && Array.isArray(d.movies) && Array.isArray(d.series)
}

export function useBackup() {
  const exportData = useCallback(async () => {
    const backup = await buildBackup()
    const json = JSON.stringify(backup, null, 2)
    const date = new Date().toISOString().slice(0, 10)
    const filename = `cinelist-backup-${date}.json`

    if (Platform.OS === 'web') {
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
      return
    }

    const uri = `${FileSystem.cacheDirectory ?? ''}${filename}`
    await FileSystem.writeAsStringAsync(uri, json)
    await Sharing.shareAsync(uri, { mimeType: 'application/json', dialogTitle: 'Exportar backup' })
  }, [])

  const importData = useCallback(async (): Promise<'success' | 'cancelled' | 'error'> => {
    if (Platform.OS === 'web') {
      return new Promise((resolve) => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = '.json,application/json'
        input.onchange = async () => {
          const file = input.files?.[0]
          if (!file) { resolve('cancelled'); return }
          const raw = await file.text()
          let data: unknown
          try { data = JSON.parse(raw) } catch { resolve('error'); return }
          if (!validateBackup(data)) { resolve('error'); return }
          await applyBackup(data)
          resolve('success')
        }
        input.oncancel = () => resolve('cancelled')
        input.click()
      })
    }

    const result = await DocumentPicker.getDocumentAsync({ type: 'application/json' })
    if (result.canceled) return 'cancelled'
    const asset = result.assets[0]
    const raw = await FileSystem.readAsStringAsync(asset.uri)
    let data: unknown
    try { data = JSON.parse(raw) } catch { return 'error' }
    if (!validateBackup(data)) return 'error'
    await applyBackup(data as BackupData)
    return 'success'
  }, [])

  return { exportData, importData }
}
