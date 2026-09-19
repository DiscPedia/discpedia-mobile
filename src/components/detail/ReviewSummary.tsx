import { Pressable, Text, View } from 'react-native';

import { StarRow } from '@/components/common/StarRow';

type Props = {
  rating: number;
  totalReviews: number;
  distribution: { score: number; percent: number }[];
  onWriteReview?: () => void;
};

const ReviewSummary = ({ rating, totalReviews, distribution, onWriteReview }: Props) => (
  <View className="bg-white px-5 pb-5">
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center gap-2">
        <Text className="text-yellow-400">★</Text>
        <Text className="text-base font-semibold text-gray-900">리뷰</Text>
        <Text className="text-xs text-gray-400">({totalReviews})</Text>
      </View>
      <Pressable onPress={onWriteReview} className="rounded-full bg-blue-50 px-3 py-1">
        <Text className="text-xs text-blue-500">리뷰 작성하기</Text>
      </Pressable>
    </View>

    <View className="mt-4 flex-row gap-4 rounded-2xl bg-gray-50 p-4">
      <View className="w-20 items-center">
        <Text className="text-2xl font-semibold text-gray-900">{rating}</Text>
        <StarRow rating={rating} />
        <Text className="mt-1 text-xs text-gray-400">{totalReviews}명 평가</Text>
      </View>
      <View className="flex-1 justify-center gap-2">
        {distribution.map((item) => (
          <View key={item.score} className="flex-row items-center gap-2">
            <Text className="w-3 text-right text-xs text-gray-400">{item.score}</Text>
            <View className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
              <View className="h-full bg-yellow-400" style={{ width: `${item.percent}%` }} />
            </View>
          </View>
        ))}
      </View>
    </View>
  </View>
);

export default ReviewSummary;
