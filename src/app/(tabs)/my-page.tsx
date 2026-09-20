import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { logout } from '@/apis/auth/auth';
import CollectionIcon from '@/assets/icons/collection.svg';
import DefaultProfileIcon from '@/assets/icons/defaultProfile.svg';
import LikeIcon from '@/assets/icons/like.svg';
import ReviewIcon from '@/assets/icons/review.svg';
import RightChevronIcon from '@/assets/icons/rightChev.svg';
import { useMe } from '@/hooks/me';
import { useMyPageStats } from '@/hooks/mypage';
import { confirm } from '@/lib/confirm';

const MENU_ITEMS = [
  { title: '내 리뷰 모아보기', pathname: '/my-review' },
  { title: '관심 아티스트 관리', pathname: '/recommand' },
  { title: '포트폴리오 변동 내역', pathname: '/portfolio' },
] as const;

export default function MyPageScreen() {
  const router = useRouter();
  const me = useMe();
  const stats = useMyPageStats();

  const displayName =
    me.data?.nickname?.trim() ||
    me.data?.userName?.trim() ||
    me.data?.username?.trim() ||
    me.data?.name?.trim() ||
    '사용자';

  // 토큰을 지우면 루트 레이아웃의 가드가 로그인 화면으로 보낸다.
  const handleLogout = async () => {
    const ok = await confirm('로그아웃 하시겠습니까?');
    if (!ok) return;
    await logout();
  };

  const statItems = [
    {
      key: 'collection',
      Icon: CollectionIcon,
      value: stats.data?.collectionCount ?? 0,
      label: '컬렉션',
      onPress: () => router.navigate('/collection'),
    },
    {
      key: 'wishlist',
      Icon: LikeIcon,
      value: stats.data?.wishlistCount ?? 0,
      label: '위시리스트',
      onPress: () => router.navigate({ pathname: '/collection', params: { tab: 'WISHLIST' } }),
    },
    {
      key: 'review',
      Icon: ReviewIcon,
      value: stats.data?.reviewCount ?? 0,
      label: '작성 리뷰',
      onPress: () => router.push('/my-review'),
    },
  ];

  if (me.isPending || stats.isPending) {
    return (
      <View className="flex-1 bg-[#F5F5F5] px-4 pt-2">
        <View className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <Text className="text-sm text-gray-500">마이페이지 정보를 불러오는 중...</Text>
        </View>
      </View>
    );
  }

  if (me.isError || stats.isError) {
    return (
      <View className="flex-1 bg-[#F5F5F5] px-4 pt-2">
        <View className="rounded-2xl border border-red-200 bg-white p-4 shadow-sm">
          <Text className="text-sm text-red-600">마이페이지 정보를 불러오지 못했습니다.</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-[#F5F5F5]"
      contentContainerClassName="px-4 pb-10 pt-2"
      showsVerticalScrollIndicator={false}>
      <View className="mb-3 flex-row items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <DefaultProfileIcon width={56} height={56} />
        <View className="min-w-0 flex-1">
          <Text className="font-semibold text-gray-900">{displayName}</Text>
          <Text numberOfLines={1} className="text-sm text-gray-500">
            {me.data?.email ?? ''}
          </Text>
          {me.data?.provider ? (
            <Text className="text-xs text-gray-400">로그인: {me.data.provider}</Text>
          ) : null}
        </View>
        <Pressable onPress={handleLogout} className="rounded-full bg-gray-100 px-3 py-1.5">
          <Text className="text-sm text-gray-800">로그아웃</Text>
        </Pressable>
      </View>

      <View className="mb-3 flex-row gap-2">
        {statItems.map(({ key, Icon, value, label, onPress }) => (
          <Pressable
            key={key}
            onPress={onPress}
            className="flex-1 items-center rounded-2xl border border-gray-200 bg-white py-4 shadow-sm">
            <Icon width={32} height={32} />
            <Text className="mt-2 text-lg font-bold text-gray-900">{value}</Text>
            <Text className="text-xs text-gray-500">{label}</Text>
          </Pressable>
        ))}
      </View>

      <View className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {MENU_ITEMS.map((item) => (
          <Pressable
            key={item.title}
            onPress={() => router.push(item.pathname)}
            className="flex-row items-center justify-between border-b border-gray-100 px-4 py-4">
            <Text className="text-gray-900">{item.title}</Text>
            <RightChevronIcon width={16} height={16} opacity={0.4} />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}
