import { View } from 'react-native';

import BackHeader from '@/components/common/BackHeader';
import ScreenPlaceholder from '@/components/common/ScreenPlaceholder';

/** 웹 MyReviewPage 자리 — My 탭의 "내 리뷰 모아보기"가 여기로 온다. */
export default function MyReviewScreen() {
  return (
    <View className="flex-1 bg-[#F5F5F5]">
      <BackHeader title="내 리뷰" />
      <ScreenPlaceholder title="아직 포팅 전입니다" />
    </View>
  );
}
