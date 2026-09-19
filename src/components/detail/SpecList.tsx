import { Text, View } from 'react-native';

type Props = {
  items: string[];
};

const SpecList = ({ items }: Props) => (
  <View className="bg-white px-5 pb-5">
    <View className="rounded-2xl bg-gray-50 p-4">
      <View className="flex-row items-center gap-2">
        <Text className="h-5 w-5 rounded-full bg-gray-100 text-center text-sm text-gray-900">
          i
        </Text>
        <Text className="text-sm font-semibold text-gray-900">앨범 사양</Text>
      </View>
      <View className="mt-3 gap-2">
        {items.map((item) => (
          <View key={item} className="flex-row items-start gap-2">
            <Text className="text-xs text-gray-400">•</Text>
            <Text className="flex-1 text-xs leading-relaxed text-gray-600">{item}</Text>
          </View>
        ))}
      </View>
    </View>
  </View>
);

export default SpecList;
