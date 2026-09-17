import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Image } from '@/components/ui/image';
import { getHighQualityCoverUrl } from '@/util/imageUtil';

export type RecordItem = {
  id: number;
  label: string;
  format: string;
  title: string;
  subtitle: string;
  date: string;
  coverImageUrl?: string;
};

const Record = ({ item }: { item: RecordItem }) => {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/detail/[id]', params: { id: String(item.id) } })}
      className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-md">
      <View className="aspect-square w-full bg-gray-100">
        {item.coverImageUrl ? (
          <Image
            source={{ uri: getHighQualityCoverUrl(item.coverImageUrl) }}
            contentFit="cover"
            className="h-full w-full"
          />
        ) : null}
        <View className="absolute left-4 right-4 top-4 flex-row items-center justify-between">
          <Text className="rounded-full bg-blue-500 px-2 py-0.5 text-[10px] font-semibold text-white">
            {item.label}
          </Text>
          <Text className="rounded-full bg-black px-2 py-0.5 text-[10px] font-semibold text-white">
            {item.format}
          </Text>
        </View>
      </View>
      <View className="px-4 pb-5 pt-4">
        <View className="flex-row items-center justify-between gap-2">
          <Text
            numberOfLines={1}
            className="min-w-0 flex-1 text-[18px] font-semibold text-gray-900">
            {item.title}
          </Text>
          <Text className="text-xs text-gray-400">{item.date}</Text>
        </View>
        <Text numberOfLines={1} className="mt-1 text-sm text-gray-500">
          {item.subtitle}
        </Text>
      </View>
    </Pressable>
  );
};

export default Record;
