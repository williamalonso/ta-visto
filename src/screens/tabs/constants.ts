import type { ComponentProps } from 'react'
import { SymbolView } from 'expo-symbols'

export const PILL_W = 38
export const PILL_H = 34
export const BAR_PT = 6
export const TAB_COUNT = 5

type SymbolName = ComponentProps<typeof SymbolView>['name']

export const ICONS: SymbolName[] = [
  { ios: 'house.fill',      android: 'home',     web: 'home'     },
  { ios: 'magnifyingglass', android: 'search',   web: 'search'   },
  { ios: 'film.fill',       android: 'movie',    web: 'movie'    },
  { ios: 'tv.fill',         android: 'tv',       web: 'tv'       },
  { ios: 'gear',            android: 'settings', web: 'settings' },
]
