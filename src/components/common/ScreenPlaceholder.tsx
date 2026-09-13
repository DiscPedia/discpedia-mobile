import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  title: string;
};

/** 웹 페이지를 포팅하기 전까지 화면 자리를 채우는 임시 화면 */
const ScreenPlaceholder = ({ title }: Props) => {
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg font-semibold text-black">{title}</Text>
      </View>
    </SafeAreaView>
  );
};

export default ScreenPlaceholder;
