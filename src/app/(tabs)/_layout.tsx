import { useRef, useEffect, type ComponentProps } from 'react'
import { Tabs } from 'expo-router'
import { View, Animated, StyleSheet, Platform } from 'react-native'
import { SymbolView } from 'expo-symbols'
import { colors, radius } from '@/theme'

type SymbolName = ComponentProps<typeof SymbolView>['name']

function AnimatedTabIcon({ focused, iconName }: { focused: boolean; iconName: SymbolName }) {
  const bgOpacity = useRef(new Animated.Value(focused ? 1 : 0)).current

  useEffect(() => {
    Animated.timing(bgOpacity, {
      toValue: focused ? 1 : 0,
      duration: 200,
      useNativeDriver: Platform.OS !== 'web',
    }).start()
  }, [focused, bgOpacity])

  return (
    <View style={styles.iconWrap}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.iconBg, { opacity: bgOpacity }]} />
      <SymbolView
        name={iconName}
        size={22}
        tintColor={focused ? colors.primary : colors.textSecondary}
      />
    </View>
  )
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon
              focused={focused}
              iconName={{ ios: 'house.fill', android: 'home', web: 'home' }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Busca',
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon
              focused={focused}
              iconName={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="movies"
        options={{
          title: 'Filmes',
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon
              focused={focused}
              iconName={{ ios: 'film.fill', android: 'movie', web: 'movie' }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="series"
        options={{
          title: 'Séries',
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon
              focused={focused}
              iconName={{ ios: 'tv.fill', android: 'tv', web: 'tv' }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Config',
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon
              focused={focused}
              iconName={{ ios: 'gear', android: 'settings', web: 'settings' }}
            />
          ),
        }}
      />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    height: 72,
    paddingBottom: 8,
    paddingTop: 4,
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  iconWrap: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  iconBg: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.lg,
  },
})
