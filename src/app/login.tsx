import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { startOAuthLogin, type OAuthProvider } from '@/apis/auth/auth';

export default function LoginScreen() {
  const [pending, setPending] = useState<OAuthProvider | null>(null);

  // 로그인에 성공하면 auth 스토어가 갱신되고, 루트 레이아웃의 Stack.Protected가 탭으로 보낸다.
  const handleLogin = async (provider: OAuthProvider) => {
    setPending(provider);
    try {
      await startOAuthLogin(provider);
    } catch (err) {
      Alert.alert('로그인 실패', err instanceof Error ? err.message : '다시 시도해 주세요.');
    } finally {
      setPending(null);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View className="flex-1 justify-center gap-3 px-6">
        <Text className="mb-10 text-center text-[38px] leading-none tracking-tight text-black">
          DiscPedia
        </Text>
        <Pressable
          className="h-12 flex-row items-center justify-center rounded-xl bg-[#FEE500]"
          disabled={pending !== null}
          onPress={() => handleLogin('kakao')}>
          {pending === 'kakao' ? (
            <ActivityIndicator color="#000000" />
          ) : (
            <Text className="text-base font-semibold text-black">카카오로 시작하기</Text>
          )}
        </Pressable>
        <Pressable
          className="h-12 flex-row items-center justify-center rounded-xl border border-gray-300 bg-white"
          disabled={pending !== null}
          onPress={() => handleLogin('google')}>
          {pending === 'google' ? (
            <ActivityIndicator color="#000000" />
          ) : (
            <Text className="text-base font-semibold text-black">Google로 시작하기</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
