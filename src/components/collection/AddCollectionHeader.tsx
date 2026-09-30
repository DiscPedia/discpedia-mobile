import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import BackArrowIcon from '@/assets/icons/backArrow.svg';

type Props = {
  title: string;
  onBack: () => void;
};

const AddCollectionHeader = ({ title, onBack }: Props) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center gap-3 px-4 pt-4">
        <Pressable
          accessibilityLabel="뒤로 가기"
          onPress={onBack}
          className="h-9 w-9 items-center justify-center rounded-full bg-gray-100">
          <BackArrowIcon width={20} height={20} />
        </Pressable>
        <Text className="flex-1 text-center text-base font-semibold text-gray-900">{title}</Text>
        <View className="w-9" />
      </View>
    </View>
  );
};

export default AddCollectionHeader;
