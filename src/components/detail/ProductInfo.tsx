import { Text, View } from 'react-native';

type Props = {
  status: string;
  format: string;
  genre: string;
  title: string;
  artist: string;
};

const ProductInfo = ({ status, format, genre, title, artist }: Props) => (
  <View className="-mt-6 rounded-t-3xl bg-white px-5 pb-4 pt-5">
    <View className="flex-row items-center gap-2">
      <Text className="rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-semibold text-white">
        {status}
      </Text>
      <Text className="rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-semibold text-gray-700">
        {format}
      </Text>
      <Text className="rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-semibold text-gray-700">
        {genre}
      </Text>
    </View>
    <Text className="mt-3 text-xl font-semibold text-gray-900">{title}</Text>
    <Text numberOfLines={1} className="mt-1 text-sm text-gray-500">
      {artist}
    </Text>
  </View>
);

export default ProductInfo;
