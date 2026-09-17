import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** 웹 DetailPage 자리 — 아직 포팅 전이라 id만 보여준다. */
export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-[#f5f5f5]" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center gap-3 px-4 py-3">
        <Pressable
          accessibilityLabel="뒤로가기"
          onPress={() => router.back()}
          className="h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm">
          <Text className="text-lg">←</Text>
        </Pressable>
        <Text className="text-xl font-bold text-gray-900">앨범 상세</Text>
      </View>
      <View className="flex-1 items-center justify-center">
        <Text className="text-sm text-gray-500">아직 포팅 전입니다 (id: {id})</Text>
      </View>
    </View>
  );
}
