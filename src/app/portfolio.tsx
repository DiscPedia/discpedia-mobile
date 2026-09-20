import { View } from 'react-native';

import BackHeader from '@/components/common/BackHeader';
import ScreenPlaceholder from '@/components/common/ScreenPlaceholder';

/** 웹 PortfolioPage 자리 — My 탭의 "포트폴리오 변동 내역"이 여기로 온다. */
export default function PortfolioScreen() {
  return (
    <View className="flex-1 bg-[#F5F5F5]">
      <BackHeader title="포트폴리오" />
      <ScreenPlaceholder title="아직 포팅 전입니다" />
    </View>
  );
}
