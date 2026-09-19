import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** 탭 밖 화면(전체보기·상세)의 뒤로가기 헤더. 목록과 달리 스크롤되지 않는다. */
const BackHeader = ({ title }: { title: string }) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View className="bg-[#F5F5F5]" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center gap-3 px-4 py-3">
        <Pressable
          accessibilityLabel="뒤로가기"
          onPress={() => router.back()}
          className="h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm">
          <Text className="text-lg">←</Text>
        </Pressable>
        <Text className="text-2xl font-bold text-gray-900">{title}</Text>
      </View>
    </View>
  );
};

export default BackHeader;
