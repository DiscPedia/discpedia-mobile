import { View } from 'react-native';

import BackHeader from '@/components/common/BackHeader';
import ScreenPlaceholder from '@/components/common/ScreenPlaceholder';

/** 웹 WriteReviewPage 자리 — 상세 화면의 "리뷰 작성하기"가 여기로 온다. */
export default function WriteReviewScreen() {
  return (
    <View className="flex-1 bg-[#F5F5F5]">
      <BackHeader title="리뷰 작성" />
      <ScreenPlaceholder title="아직 포팅 전입니다" />
    </View>
  );
}
