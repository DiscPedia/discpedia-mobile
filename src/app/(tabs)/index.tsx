import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import type { NewRelease, UsedAlbum } from '@/apis/aladin';
import { Image } from '@/components/ui/image';
import { useNewReleases, useUsedAlbums } from '@/hooks/albums';
import { getHighQualityCoverUrl } from '@/util/imageUtil';

const formatDate = (value: string) => value.replaceAll('-', '.');
const formatWon = (value: number) => `${value.toLocaleString('ko-KR')}원`;

const CoverImage = ({ uri, className }: { uri?: string; className: string }) => (
  <View className={`overflow-hidden bg-gray-100 ${className}`}>
    {uri ? (
      <Image
        source={{ uri: getHighQualityCoverUrl(uri) }}
        contentFit="cover"
        className="h-full w-full"
      />
    ) : null}
  </View>
);

const SectionMessage = ({ text }: { text: string }) => (
  <View className="rounded-2xl border border-gray-100 bg-white p-4">
    <Text className="text-sm text-gray-500">{text}</Text>
  </View>
);

const CardSkeletonRow = ({ width, height }: { width: string; height: string }) => (
  <View className="flex-row gap-4 pb-2">
    {Array.from({ length: 3 }).map((_, index) => (
      <View
        key={index}
        className={`${width} ${height} rounded-2xl border border-gray-100 bg-white p-3`}>
        <View className="flex-row items-center justify-between">
          <View className="h-4 w-10 rounded-full bg-gray-100" />
          <View className="h-4 w-8 rounded-full bg-gray-100" />
        </View>
        <View className="mt-3 aspect-square w-full rounded-xl bg-gray-100" />
        <View className="mt-3 h-4 w-full rounded bg-gray-100" />
        <View className="mt-2 h-3 w-16 rounded bg-gray-100" />
      </View>
    ))}
  </View>
);

const NewReleaseCard = ({ item, onPress }: { item: NewRelease; onPress: () => void }) => (
  <Pressable
    onPress={onPress}
    className="w-[150px] rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
    <View className="flex-row items-center justify-between gap-2">
      <Text className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-600">
        NEW
      </Text>
      <Text className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600">
        {item.mediaType}
      </Text>
    </View>
    <CoverImage uri={item.coverImageUrl} className="mt-3 aspect-square w-full rounded-xl" />
    <View className="mt-3">
      <Text numberOfLines={1} className="text-sm font-semibold text-gray-900">
        {item.title}
      </Text>
      <Text numberOfLines={1} className="text-xs text-gray-500">
        {item.artistName}
      </Text>
      <Text className="mt-1 text-[10px] text-gray-400">{formatDate(item.releaseDate)}</Text>
      <Text className="mt-1 text-sm font-semibold text-[#4C6FFF]">
        {formatWon(item.priceSales)}
      </Text>
    </View>
  </Pressable>
);

const UsedAlbumCard = ({ item, onPress }: { item: UsedAlbum; onPress: () => void }) => (
  <Pressable
    onPress={onPress}
    className="w-[180px] rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
    <View className="flex-row items-center justify-between gap-2">
      <Text className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-600">
        중고
      </Text>
      <Text className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600">
        {item.mediaType}
      </Text>
    </View>
    <CoverImage uri={item.coverImageUrl} className="mt-3 aspect-square w-full rounded-xl" />
    <View className="mt-3">
      <Text numberOfLines={1} className="text-sm font-semibold text-gray-900">
        {item.title}
      </Text>
      <Text numberOfLines={1} className="text-xs text-gray-500">
        {item.artistName}
      </Text>
      <Text className="mt-2 text-base font-semibold text-[#4C6FFF]">
        {formatWon(item.usedPrice)}
      </Text>
    </View>
  </Pressable>
);

const SectionHeader = ({
  children,
  actionLabel,
  onAction,
}: {
  children: React.ReactNode;
  actionLabel: string;
  onAction: () => void;
}) => (
  <View className="flex-row items-center justify-between">
    <View className="flex-row items-center gap-2">{children}</View>
    <Pressable onPress={onAction}>
      <Text className="text-sm text-gray-400">{actionLabel}</Text>
    </Pressable>
  </View>
);

// 웹 HomePage에 하드코딩돼 있던 목업 — 서버 API가 생기면 교체한다.
const artistNews = [
  {
    id: 1,
    name: '한로로-자문실구름 클럽',
    subtitle: '정규 1집 발매 예정',
    tags: ['LP', '발매 예정', '관심 아티스트'],
  },
  {
    id: 2,
    name: '실리카겔 · SGTAPE-02',
    subtitle: 'LP 바이닐',
    tags: ['LP', '관심 아티스트'],
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const newReleases = useNewReleases({ page: 0, size: 20 });
  const usedAlbums = useUsedAlbums({ page: 0, size: 20 });

  const openDetail = (aladinItemId: number) =>
    router.push({ pathname: '/detail/[id]', params: { id: String(aladinItemId) } });

  return (
    <ScrollView
      className="flex-1 bg-[#F5F5F5]"
      contentContainerClassName="gap-6 px-4 pb-8 pt-4"
      showsVerticalScrollIndicator={false}>
      <View className="flex-row items-center gap-3 rounded-2xl border border-orange-100 bg-white px-4 py-3 shadow-sm">
        <View className="h-10 w-10 items-center justify-center rounded-full bg-orange-50">
          <Text className="text-xl">🔥</Text>
        </View>
        <View>
          <Text className="text-sm font-semibold text-gray-700">한로로 - 이상비행 LP 리프레스</Text>
          <Text className="text-sm text-gray-500">예약판매 오늘 14:00 시작!</Text>
        </View>
      </View>

      <View className="gap-3">
        <SectionHeader actionLabel="전체보기" onAction={() => router.push('/new-releases')}>
          <Text className="rounded-full bg-[#FFB347] px-2 py-0.5 text-[10px] font-semibold text-white">
            NEW
          </Text>
          <Text className="text-lg font-semibold text-gray-900">새로 나온 음반</Text>
        </SectionHeader>

        {newReleases.isPending ? <CardSkeletonRow width="w-[150px]" height="h-[210px]" /> : null}
        {newReleases.isError ? <SectionMessage text="새 음반 목록을 불러오지 못했습니다." /> : null}
        {newReleases.data?.items.length === 0 ? (
          <SectionMessage text="새로 나온 음반이 없습니다." />
        ) : null}
        {newReleases.data && newReleases.data.items.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-4 pb-2">
            {newReleases.data.items.map((item) => (
              <NewReleaseCard
                key={item.newReleaseId}
                item={item}
                onPress={() => openDetail(item.aladinItemId)}
              />
            ))}
          </ScrollView>
        ) : null}
      </View>

      <View className="gap-3">
        <SectionHeader actionLabel="더보기" onAction={() => router.push('/used-albums')}>
          <Text className="text-base">💿</Text>
          <Text className="text-lg font-semibold text-gray-900">중고 거래 음반</Text>
        </SectionHeader>

        {usedAlbums.isPending ? <CardSkeletonRow width="w-[180px]" height="h-[235px]" /> : null}
        {usedAlbums.isError ? (
          <SectionMessage text="중고 음반 목록을 불러오지 못했습니다." />
        ) : null}
        {usedAlbums.data?.items.length === 0 ? (
          <SectionMessage text="중고 거래 음반이 없습니다." />
        ) : null}
        {usedAlbums.data && usedAlbums.data.items.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-4 pb-2">
            {usedAlbums.data.items.map((item) => (
              <UsedAlbumCard
                key={item.aladinItemId}
                item={item}
                onPress={() => openDetail(item.aladinItemId)}
              />
            ))}
          </ScrollView>
        ) : null}
      </View>

      <View className="gap-3">
        <Text className="text-lg font-semibold text-gray-900">관심 아티스트 소식</Text>
        {artistNews.map((item) => (
          <View
            key={item.id}
            className="flex-row items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
              <View className="h-5 w-5 rounded-full bg-black" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-gray-900">{item.name}</Text>
              <Text className="mt-1 text-xs text-gray-500">{item.subtitle}</Text>
              <View className="mt-2 flex-row flex-wrap gap-1">
                {item.tags.map((tag) => (
                  <Text
                    key={tag}
                    className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600">
                    {tag}
                  </Text>
                ))}
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
