import { useState, useEffect, useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

export function useAsyncStorage<T>(key: string, initialValue: T) {
  const [value, setStateValue] = useState<T>(initialValue)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(key)
      if (raw !== null) setStateValue(JSON.parse(raw) as T)
    } finally {
      setLoading(false)
    }
  }, [key])

  useEffect(() => {
    load()
  }, [load])

  const setValue = useCallback(
    async (newValue: T) => {
      setStateValue(newValue)
      await AsyncStorage.setItem(key, JSON.stringify(newValue))
    },
    [key]
  )

  const reload = useCallback(async () => {
    setLoading(true)
    await load()
  }, [load])

  return { value, setValue, loading, reload }
}
