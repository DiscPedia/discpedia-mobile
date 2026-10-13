import { Pressable, Text, View } from 'react-native';

import type { NotificationItem } from '@/apis/notification/notification';
import { Image } from '@/components/ui/image';
import { getHighQualityCoverUrl } from '@/util/imageUtil';

import { formatTimeAgo, NOTIFICATION_META } from './notificationMeta';

type Props = {
  item: NotificationItem;
  onPress: (item: NotificationItem) => void;
};

/** 알림 한 건. 안 읽은 알림은 주황 테두리 + 점으로 구분한다. */
const NotificationCard = ({ item, onPress }: Props) => {
  const meta = NOTIFICATION_META[item.type];

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress(item)}
      className={`flex-row gap-3 rounded-2xl border bg-white p-4 ${
        item.read ? 'border-transparent' : 'border-orange-200'
      }`}>
      {item.coverImageUrl ? (
        <Image
          source={{ uri: getHighQualityCoverUrl(item.coverImageUrl) }}
          contentFit="cover"
          className="h-12 w-12 rounded-lg bg-gray-100"
        />
      ) : (
        <View className={`h-12 w-12 items-center justify-center rounded-full ${meta.iconBg}`}>
          <Text className={`text-base font-bold ${meta.badgeText}`}>{meta.icon}</Text>
        </View>
      )}

      <View className="flex-1">
        <View className="flex-row items-center gap-2">
          <View className={`rounded px-1.5 py-0.5 ${meta.badge}`}>
            <Text className={`text-[11px] font-bold ${meta.badgeText}`}>{meta.label}</Text>
          </View>
          <Text className="text-xs text-gray-400">{formatTimeAgo(item.createdAt)}</Text>
          {!item.read && <View className="ml-auto h-2 w-2 rounded-full bg-[#ED732E]" />}
        </View>
        <Text className="mt-1.5 text-[15px] font-bold text-gray-900">{item.title}</Text>
        <Text className="mt-1 text-[13px] leading-5 text-gray-600">{item.body}</Text>
      </View>
    </Pressable>
  );
};

export default NotificationCard;
