import { Text, View } from 'react-native';

import BackHeader from '@/components/common/BackHeader';

/** 웹 PortfolioPage도 아직 자리 화면이라 같은 문구를 쓴다. */
export default function PortfolioScreen() {
  return (
    <View className="flex-1 bg-[#F5F5F5]">
      <BackHeader title="포트폴리오" />
      <View className="flex-1 items-center justify-center">
        <Text className="text-sm text-gray-500">2학기 추가 예정</Text>
      </View>
    </View>
  );
}
