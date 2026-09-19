import { View } from 'react-native';

import BackHeader from '@/components/common/BackHeader';
import ScreenPlaceholder from '@/components/common/ScreenPlaceholder';

/** 웹 EditReviewPage 자리 — 내 리뷰의 "수정"이 여기로 온다. */
export default function EditReviewScreen() {
  return (
    <View className="flex-1 bg-[#F5F5F5]">
      <BackHeader title="리뷰 수정" />
      <ScreenPlaceholder title="아직 포팅 전입니다" />
    </View>
  );
}
