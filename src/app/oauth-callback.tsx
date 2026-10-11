import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Alert, Text, View } from 'react-native';

import { resumeOAuthLogin } from '@/apis/auth/auth';

// 같은 code로 두 번 교환하지 않도록 한 번만 처리한다 (재마운트 포함).
let handledKey: string | null = null;

/**
 * 로그인 브라우저가 열린 사이 앱이 종료됐다가 딥링크로 다시 켜졌을 때 오는 화면.
 * 저장해 둔 state로 검증하고 로그인을 마친다. 성공하면 루트 가드가 탭으로 보낸다.
 */
export default function OAuthCallbackScreen() {
  const { provider, code, state } = useLocalSearchParams<{
    provider?: string;
    code?: string;
    state?: string;
  }>();
  const router = useRouter();

  useEffect(() => {
    const key = code ?? 'missing';
    if (handledKey === key) return;
    handledKey = key;

    const fail = () => {
      Alert.alert('로그인 실패', '다시 시도해 주세요.');
      router.replace('/login');
    };

    if (!code || !state || (provider !== 'kakao' && provider !== 'google')) {
      fail();
      return;
    }
    resumeOAuthLogin(provider, code, state).catch(fail);
  }, [provider, code, state, router]);

  return (
    <View className="flex-1 items-center justify-center gap-3 bg-[#f5f5f5]">
      <ActivityIndicator color="#000000" />
      <Text className="text-sm text-gray-500">로그인 처리 중...</Text>
    </View>
  );
}
