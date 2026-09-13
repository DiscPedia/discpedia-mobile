import { Tabs } from 'expo-router';

import CollectionIcon from '@/assets/icons/collection.svg';
import HomeIcon from '@/assets/icons/home.svg';
import MyIcon from '@/assets/icons/my.svg';
import SearchIcon from '@/assets/icons/search.svg';

const ICON_SIZE = 20;

// 웹 BottomNav와 동일: 활성 탭은 검정 + 아이콘 불투명, 비활성은 gray-400 + 50%
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarLabelStyle: { fontSize: 10 },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          tabBarIcon: ({ focused }) => (
            <HomeIcon width={ICON_SIZE} height={ICON_SIZE} opacity={focused ? 1 : 0.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: '탐색',
          tabBarIcon: ({ focused }) => (
            <SearchIcon width={ICON_SIZE} height={ICON_SIZE} opacity={focused ? 1 : 0.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="collection"
        options={{
          title: '컬렉션',
          tabBarIcon: ({ focused }) => (
            <CollectionIcon width={ICON_SIZE} height={ICON_SIZE} opacity={focused ? 1 : 0.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="my-page"
        options={{
          title: 'My',
          tabBarIcon: ({ focused }) => (
            <MyIcon width={ICON_SIZE} height={ICON_SIZE} opacity={focused ? 1 : 0.5} />
          ),
        }}
      />
    </Tabs>
  );
}
