import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import BackHeader from '@/components/common/BackHeader';
import FavoriteArtistPicker from '@/components/recommand/FavoriteArtistPicker';
import { useFavoriteArtists } from '@/hooks/artists';

export default function RecommandScreen() {
  // 웹은 로그인 직후 온보딩으로도 쓰지만, 앱은 My 탭의 관리 진입이 기본이다.
  const { onboarding } = useLocalSearchParams<{ onboarding?: string }>();
  const isOnboarding = onboarding === '1';
  const router = useRouter();
  const favorites = useFavoriteArtists();

  return (
    <View className="flex-1 bg-[#F5F5F6]">
      <BackHeader title="관심 아티스트" />
      {favorites.isPending ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-sm text-[#8B8B93]">아티스트 불러오는 중...</Text>
        </View>
      ) : (
        <FavoriteArtistPicker
          initialSelectedIds={(favorites.data ?? []).map((item) => item.artistId)}
          completeOnboarding={isOnboarding}
          onSaved={() => (isOnboarding ? router.replace('/') : router.back())}
        />
      )}
    </View>
  );
}
