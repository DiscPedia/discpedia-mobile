import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  label: string;
  onPress?: () => void;
};

/** 화면 하단에 고정되는 버튼 (웹의 fixed bottom CTA 대응). */
const BottomCTA = ({ label, onPress }: Props) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="absolute bottom-0 left-0 right-0 px-4"
      style={{ paddingBottom: insets.bottom + 16 }}>
      <Pressable
        onPress={onPress}
        className="h-12 items-center justify-center rounded-2xl bg-black shadow-lg">
        <Text className="text-sm font-semibold text-white">{label}</Text>
      </Pressable>
    </View>
  );
};

export default BottomCTA;
