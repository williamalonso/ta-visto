/*
Este componente mostra uma barra de abas deslizante com um indicador de pílula animado que se move para a aba selecionada.
*/

import { type ComponentProps } from 'react'
import { Tabs } from 'expo-router'
import { View, Animated, StyleSheet } from 'react-native'
import { colors } from '@/theme'
import { useSlidingPill } from '../hooks/useSlidingPill'
import { TabItem } from './TabItem'
import { PILL_W, PILL_H, BAR_PT } from '../constants'

type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0]

export function SlidingTabBar({ state, descriptors, navigation }: TabBarProps) {
  const { pillX, onLayout } = useSlidingPill(state.index)

  return (
    <View
      style={styles.bar}
      onLayout={(e) => onLayout(e.nativeEvent.layout.width)}
    >
      <Animated.View
        pointerEvents="none"
        style={[styles.pill, { transform: [{ translateX: pillX }] }]}
      />
      {state.routes.map((route: typeof state.routes[number], i: number) => {
        const focused = state.index === i
        const label = descriptors[route.key].options.title ?? route.name

        return (
          <TabItem
            key={route.key}
            index={i}
            focused={focused}
            label={label as string}
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
          />
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  bar: {
    height: 72,
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
})
