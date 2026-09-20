import { View } from 'react-native';

import BackHeader from '@/components/common/BackHeader';
import ScreenPlaceholder from '@/components/common/ScreenPlaceholder';

/** 웹 CollectionDetailPage 자리 — 컬렉션 탭의 카드가 여기로 온다. */
export default function CollectionDetailScreen() {
  return (
    <View className="flex-1 bg-[#F5F5F5]">
      <BackHeader title="컬렉션 상세" />
      <ScreenPlaceholder title="아직 포팅 전입니다" />
    </View>
  );
}
