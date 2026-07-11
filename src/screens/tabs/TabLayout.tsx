import { Tabs } from 'expo-router'
import { SlidingTabBar } from './components/SlidingTabBar'

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
