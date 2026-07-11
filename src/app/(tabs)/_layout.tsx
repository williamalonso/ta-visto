import { useRef, useEffect, type ComponentProps } from 'react'
import { Tabs } from 'expo-router'
import { View, Animated, StyleSheet, Platform, Pressable, Text } from 'react-native'
import { SymbolView } from 'expo-symbols'
import { colors } from '@/theme'

type SymbolName = ComponentProps<typeof SymbolView>['name']
type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0]

const PILL_W = 38
const PILL_H = 34
const BAR_H = 72
const BAR_PT = 6
const TAB_COUNT = 5

const ICONS: SymbolName[] = [
  { ios: 'house.fill',      android: 'home',     web: 'home'     },
  { ios: 'magnifyingglass', android: 'search',   web: 'search'   },
  { ios: 'film.fill',       android: 'movie',    web: 'movie'    },
  { ios: 'tv.fill',         android: 'tv',       web: 'tv'       },
  { ios: 'gear',            android: 'settings', web: 'settings' },
]

function SlidingTabBar({ state, descriptors, navigation }: TabBarProps) {
  const pillX = useRef(new Animated.Value(0)).current
  const tabW = useRef(0)
  const ready = useRef(false)

  const movePill = (index: number, animate: boolean) => {
    const x = index * tabW.current + (tabW.current - PILL_W) / 2
    if (animate) {
      Animated.spring(pillX, {
        toValue: x,
        useNativeDriver: Platform.OS !== 'web',
        stiffness: 280,
        damping: 28,
        mass: 0.8,
      }).start()
    } else {
      pillX.setValue(x)
    }
  }

  useEffect(() => {
    if (ready.current) movePill(state.index, true)
  }, [state.index])

  return (
    <View
      style={styles.bar}
      onLayout={(e) => {
        tabW.current = e.nativeEvent.layout.width / TAB_COUNT
        movePill(state.index, false)
        ready.current = true
      }}
    >
      <Animated.View
        pointerEvents="none"
        style={[styles.pill, { transform: [{ translateX: pillX }] }]}
      />
      {state.routes.map((route: typeof state.routes[number], i: number) => {
        const focused = state.index === i
        const label = descriptors[route.key].options.title ?? route.name

        return (
          <Pressable
            key={route.key}
            style={styles.item}
            onPress={() => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              })
              if (!focused && !event.defaultPrevented) {
                navigation.navigate(route.name as never)
              }
            }}
          >
            <View style={styles.iconWrap}>
              <SymbolView
                name={ICONS[i]}
                size={22}
                tintColor={focused ? colors.primary : colors.textSecondary}
              />
            </View>
            <Text style={[styles.label, focused && styles.labelActive]}>
              {label as string}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <SlidingTabBar {...props} />}
    >
      <Tabs.Screen name="index"    options={{ title: 'Início' }} />
      <Tabs.Screen name="search"   options={{ title: 'Busca'  }} />
      <Tabs.Screen name="movies"   options={{ title: 'Filmes' }} />
      <Tabs.Screen name="series"   options={{ title: 'Séries' }} />
      <Tabs.Screen name="settings" options={{ title: 'Config' }} />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  bar: {
    height: BAR_H,
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: BAR_PT,
    paddingBottom: 8,
  },
  pill: {
    position: 'absolute',
    top: BAR_PT,
    left: 0,
    width: PILL_W,
    height: PILL_H,
    borderRadius: 10,
    backgroundColor: colors.primaryLight,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  iconWrap: {
    width: PILL_W,
    height: PILL_H,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  labelActive: {
    color: colors.primary,
  },
})
