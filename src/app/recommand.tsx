import { View } from 'react-native';

import BackHeader from '@/components/common/BackHeader';
import ScreenPlaceholder from '@/components/common/ScreenPlaceholder';

/** 웹 RecommandPage 자리 — My 탭의 "관심 아티스트 관리"가 여기로 온다. */
export default function RecommandScreen() {
  return (
    <View className="flex-1 bg-[#F5F5F5]">
      <BackHeader title="관심 아티스트" />
      <ScreenPlaceholder title="아직 포팅 전입니다" />
    </View>
  );
}
