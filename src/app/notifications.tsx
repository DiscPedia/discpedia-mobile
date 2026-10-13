import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, SectionList, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { NotificationItem, NotificationType } from '@/apis/notification/notification';
import SettingIcon from '@/assets/icons/setting.svg';
import NotificationCard from '@/components/notification/NotificationCard';
import { getSectionTitle, NOTIFICATION_FILTERS } from '@/components/notification/notificationMeta';
import {
  useNotifications,
  useReadAllNotifications,
  useReadNotification,
} from '@/hooks/notifications';

/** 알림 목록 (피그마 N1). 헤더 종 아이콘에서 들어온다. */
export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<NotificationType | undefined>(undefined);

  const notifications = useNotifications(filter);
  const readOne = useReadNotification();
  const readAll = useReadAllNotifications();

  const sections = useMemo(() => {
    const groups = new Map<string, NotificationItem[]>();
    (notifications.data?.items ?? []).forEach((item) => {
      const title = getSectionTitle(item.createdAt);
      groups.set(title, [...(groups.get(title) ?? []), item]);
    });
    return [...groups.entries()].map(([title, data]) => ({ title, data }));
  }, [notifications.data]);

  const handlePress = (item: NotificationItem) => {
    if (!item.read) readOne.mutate(item.notificationId);
    if (item.aladinItemId) {
      router.push({ pathname: '/detail/[id]', params: { id: String(item.aladinItemId) } });
    }
  };

  const emptyMessage = notifications.isPending
    ? '알림을 불러오는 중...'
    : notifications.isError
      ? '알림을 불러오지 못했습니다.'
      : '새 알림이 없어요.';

  return (
    <View className="flex-1 bg-[#F5F5F5]">
      <View className="bg-white" style={{ paddingTop: insets.top }}>
        <View className="flex-row items-center gap-3 px-4 py-3">
          <Pressable
            accessibilityLabel="뒤로가기"
            onPress={() => router.back()}
            className="h-9 w-9 items-center justify-center">
            <Text className="text-xl">←</Text>
          </Pressable>
          <Text className="flex-1 text-2xl font-bold text-gray-900">알림</Text>
          <Pressable accessibilityLabel="모두 읽음" onPress={() => readAll.mutate()}>
            <Text className="text-sm text-gray-500">모두 읽음</Text>
          </Pressable>
          <Pressable
            accessibilityLabel="알림 설정"
            onPress={() => router.push('/notification-settings')}
            className="h-9 w-9 items-center justify-center">
            <SettingIcon width={22} height={22} />
          </Pressable>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-2 px-4 pb-3">
          {NOTIFICATION_FILTERS.map(({ label, type }) => {
            const active = filter === type;
            return (
              <Pressable
                key={label}
                onPress={() => setFilter(type)}
                className={`rounded-full px-4 py-1.5 ${active ? 'bg-[#ED732E]' : 'bg-gray-100'}`}>
                <Text className={`text-sm ${active ? 'font-bold text-white' : 'text-gray-700'}`}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => String(item.notificationId)}
        contentContainerClassName="gap-3 px-4 pb-8 pt-2"
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        renderSectionHeader={({ section }) => (
          <Text className="mt-3 text-sm font-semibold text-gray-500">{section.title}</Text>
        )}
        renderItem={({ item }) => <NotificationCard item={item} onPress={handlePress} />}
        ListEmptyComponent={
          <View className="mt-3 rounded-2xl bg-white p-4">
            <Text className={`text-sm ${notifications.isError ? 'text-red-600' : 'text-gray-500'}`}>
              {emptyMessage}
            </Text>
          </View>
        }
      />
    </View>
  );
}
