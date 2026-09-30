import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  label: string;
  onSubmit: () => void;
  disabled?: boolean;
};

/** 화면 하단에 고정되는 제출 버튼 (웹의 fixed SubmitBar 대응). */
const SubmitBar = ({ label, onSubmit, disabled = false }: Props) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="absolute bottom-0 left-0 right-0 px-4"
      style={{ paddingBottom: insets.bottom + 16 }}>
      <Pressable
        onPress={onSubmit}
        disabled={disabled}
        className={`h-12 items-center justify-center rounded-2xl ${
          disabled ? 'bg-gray-300' : 'bg-black shadow-lg'
        }`}>
        <Text className="text-sm font-semibold text-white">{label}</Text>
      </Pressable>
    </View>
  );
};

export default SubmitBar;
