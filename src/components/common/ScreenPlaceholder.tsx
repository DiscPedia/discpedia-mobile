import { Text, View } from 'react-native';

type Props = {
  title: string;
};

/** 웹 페이지를 포팅하기 전까지 화면 자리를 채우는 임시 화면 */
const ScreenPlaceholder = ({ title }: Props) => {
  return (
    <View className="flex-1 items-center justify-center bg-[#f5f5f5]">
      <Text className="text-lg font-semibold text-black">{title}</Text>
    </View>
  );
};

export default ScreenPlaceholder;
