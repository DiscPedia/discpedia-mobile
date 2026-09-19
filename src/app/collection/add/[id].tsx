import { View } from 'react-native';

import BackHeader from '@/components/common/BackHeader';
import ScreenPlaceholder from '@/components/common/ScreenPlaceholder';

/** 웹 AddCollectionsPage 자리 — 상세 화면 하단 CTA가 여기로 온다. */
export default function AddCollectionScreen() {
  return (
    <View className="flex-1 bg-[#F5F5F5]">
      <BackHeader title="컬렉션에 추가" />
      <ScreenPlaceholder title="아직 포팅 전입니다" />
    </View>
  );
}
