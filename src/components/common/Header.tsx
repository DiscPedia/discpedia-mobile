import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AlarmIcon from '@/assets/icons/alarm.svg';
import SettingIcon from '@/assets/icons/setting.svg';

/** 웹 BackgroundPage의 상단 Header 대응 — 탭 레이아웃의 공통 헤더로 쓴다. */
const Header = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View className="w-full bg-white" style={{ paddingTop: insets.top }}>
      <View className="h-16 w-full flex-row items-center justify-between px-4">
        <Pressable onPress={() => router.navigate('/')}>
          <Text className="font-raleway text-[38px] tracking-tight">
            <Text className="text-[#FFD700]">Disc</Text>
            <Text className="text-[#111111]">Pedia</Text>
          </Text>
        </Pressable>
        <View className="flex-row items-center gap-2">
          <Pressable
            accessibilityLabel="알림"
            className="h-9 w-9 items-center justify-center rounded-full">
            <AlarmIcon width={24} height={24} />
          </Pressable>
          <Pressable
            accessibilityLabel="설정"
            onPress={() => router.navigate('/my-page')}
            className="h-9 w-9 items-center justify-center rounded-full">
            <SettingIcon width={24} height={24} />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default Header;
