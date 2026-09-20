import '@/global.css';

import { Raleway_300Light, useFonts } from '@expo-google-fonts/raleway';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';

import { createQueryClient } from '@/lib/query-client';
import { useAuthStore } from '@/stores/auth';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [queryClient] = useState(createQueryClient);
  const hydrated = useAuthStore((s) => s.hydrated);
  const isLoggedIn = useAuthStore((s) => s.accessToken !== null);
  const [fontsLoaded] = useFonts({ Raleway_300Light });
  const ready = hydrated && fontsLoaded;

  useEffect(() => {
    void useAuthStore.getState().hydrate();
  }, []);

  useEffect(() => {
    if (ready) void SplashScreen.hideAsync();
  }, [ready]);

  // 토큰·폰트가 준비되기 전에는 스플래시를 유지한다.
  if (!ready) return null;

  // 웹의 ProtectedRoute 대응. 새 화면은 반드시 둘 중 한 블록 안에 등록한다
  // (Stack에 등록하지 않은 라우트는 guard 없이 열린다).
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={isLoggedIn}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="detail/[id]" />
          <Stack.Screen name="new-releases" />
          <Stack.Screen name="used-albums" />
          <Stack.Screen name="review/write/[id]" />
          <Stack.Screen name="review/edit/[reviewId]" />
          <Stack.Screen name="collection/add/[id]" />
          <Stack.Screen name="collection/[collectionItemId]" />
          <Stack.Screen name="my-review" />
          <Stack.Screen name="recommand" />
          <Stack.Screen name="portfolio" />
        </Stack.Protected>
        <Stack.Protected guard={!isLoggedIn}>
          <Stack.Screen name="login" />
        </Stack.Protected>
      </Stack>
    </QueryClientProvider>
  );
}
