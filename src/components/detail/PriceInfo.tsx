import { Text, View } from 'react-native';

type Props = {
  releaseDate: string;
  originalPrice: string;
  price: string;
};

const PriceInfo = ({ releaseDate, originalPrice, price }: Props) => (
  <View className="bg-white px-5 pb-5">
    <View className="flex-row justify-between border-b border-t border-gray-100 py-4">
      <View>
        <Text className="text-xs text-gray-400">발매일</Text>
        <Text className="mt-1 text-sm font-semibold text-gray-900">{releaseDate}</Text>
      </View>
      <View className="items-end">
        <Text className="text-xs text-gray-400">정가</Text>
        <View className="mt-1 flex-row items-center gap-2">
          <Text className="text-xs text-gray-300 line-through">{originalPrice}</Text>
          <Text className="text-lg font-semibold text-gray-900">{price}</Text>
        </View>
      </View>
    </View>
  </View>
);

export default PriceInfo;
