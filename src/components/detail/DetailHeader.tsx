import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import BackArrowIcon from '@/assets/icons/backArrow.svg';

type Props = {
  onBack: () => void;
  onToggleLike?: () => void;
  onOpenProduct?: () => void;
  liked?: boolean;
  likeDisabled?: boolean;
};

/** 히어로 이미지 위에 떠 있는 헤더 (웹과 동일하게 absolute). */
const DetailHeader = ({
  onBack,
  onToggleLike,
  onOpenProduct,
  liked = false,
  likeDisabled = false,
}: Props) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="absolute left-0 right-0 flex-row items-center justify-between px-4"
      style={{ top: insets.top + 8 }}>
      <Pressable
        accessibilityLabel="뒤로 가기"
        onPress={onBack}
        className="h-9 w-9 items-center justify-center rounded-full bg-white/70">
        <BackArrowIcon width={20} height={20} />
      </Pressable>
      <View className="flex-row items-center gap-2">
        <Pressable
          accessibilityLabel={liked ? '위시리스트에서 삭제' : '위시리스트에 추가'}
          disabled={likeDisabled}
          onPress={onToggleLike}
          className="h-9 w-9 items-center justify-center rounded-full bg-white/70">
          <Text className={`text-lg ${liked ? 'text-red-500' : 'text-gray-900'}`}>
            {liked ? '♥' : '♡'}
          </Text>
        </Pressable>
        <Pressable
          accessibilityLabel="상품 페이지 열기"
          onPress={onOpenProduct}
          className="h-9 w-9 items-center justify-center rounded-full bg-white/70">
          <Text className="text-lg">↗</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default DetailHeader;
