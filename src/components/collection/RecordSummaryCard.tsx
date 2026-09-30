import { Text, View } from 'react-native';

import { Image } from '@/components/ui/image';
import { getHighQualityCoverUrl } from '@/util/imageUtil';

type Props = {
  title: string;
  subtitle: string;
  coverImageUrl?: string;
};

const RecordSummaryCard = ({ title, subtitle, coverImageUrl }: Props) => (
  <View className="px-4">
    <View className="flex-row items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <View className="h-12 w-12 overflow-hidden rounded-xl bg-gray-200">
        {coverImageUrl ? (
          <Image
            source={{ uri: getHighQualityCoverUrl(coverImageUrl) }}
            contentFit="cover"
            className="h-full w-full"
          />
        ) : null}
      </View>
      <View className="flex-1">
        <Text className="text-sm font-semibold leading-snug text-gray-900">{title}</Text>
        <Text className="mt-1 text-xs text-gray-500">{subtitle}</Text>
      </View>
    </View>
  </View>
);

export default RecordSummaryCard;
