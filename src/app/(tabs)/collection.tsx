import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import type { CollectionItem, CollectionListParams } from '@/apis/collection/collection';
import { Image } from '@/components/ui/image';
import { useCollectionItems, useCollectionSummary } from '@/hooks/collection';
import { getHighQualityCoverUrl } from '@/util/imageUtil';

type FilterTab = 'ALL' | 'LP' | 'CD' | 'WISHLIST';

const formatWon = (value: number) => `₩${value.toLocaleString('ko-KR')}`;

const TABS: { key: FilterTab; label: string }[] = [
  { key: 'ALL', label: '전체' },
  { key: 'LP', label: 'LP' },
  { key: 'CD', label: 'CD' },
  { key: 'WISHLIST', label: '위시리스트' },
];

const PARAMS_BY_TAB: Record<FilterTab, CollectionListParams> = {
  ALL: { page: 0, size: 50 },
  LP: { mediaType: 'LP', status: 'OWNED', page: 0, size: 50 },
  CD: { mediaType: 'CD', status: 'OWNED', page: 0, size: 50 },
  WISHLIST: { status: 'WISHLIST', page: 0, size: 50 },
};

const CollectionCard = ({ item, onPress }: { item: CollectionItem; onPress: () => void }) => (
  <Pressable
    onPress={onPress}
    className="flex-1 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
    <Image
      source={{ uri: getHighQualityCoverUrl(item.album.coverImageUrl) }}
      contentFit="cover"
      className="h-[92px] w-[92px] rounded-xl bg-gray-100"
    />
    <View className="mt-3">
      <Text numberOfLines={2} className="text-sm font-semibold text-gray-900">
        {item.album.title}
      </Text>
      <Text numberOfLines={1} className="mt-1 text-xs text-gray-500">
        {item.album.artistName}
      </Text>
      <Text className="mt-1 text-[11px] text-gray-400">{item.album.releaseDate}</Text>
      {item.status === 'WISHLIST' ? (
        <Text className="mt-2 self-start rounded-full bg-[#EFE8C8] px-2 py-0.5 text-[11px] font-semibold text-[#7A5D00]">
          위시리스트
        </Text>
      ) : (
        <Text className="mt-2 text-xs text-gray-700">
          추정가 {formatWon(item.currentEstimatedPrice ?? item.album.listPrice)}
        </Text>
      )}
    </View>
  </Pressable>
);

export default function CollectionScreen() {
  const router = useRouter();
  // My 탭의 "위시리스트"가 /collection?tab=WISHLIST로 들어온다.
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const [activeTab, setActiveTab] = useState<FilterTab>(tab === 'WISHLIST' ? 'WISHLIST' : 'ALL');

  const summary = useCollectionSummary();
  const items = useCollectionItems(PARAMS_BY_TAB[activeTab]);

  const counts = summary.data?.counts;
  const countCards = [
    { key: 'LP', label: 'LP', value: counts?.lp ?? 0, className: 'bg-[#DCE9F7]' },
    { key: 'CD', label: 'CD', value: counts?.cd ?? 0, className: 'bg-[#DDEFE6]' },
    {
      key: 'WISHLIST',
      label: '위시리스트',
      value: counts?.wishlist ?? 0,
      className: 'bg-[#EFE8C8]',
    },
  ];

  return (
    <ScrollView
      className="flex-1 bg-[#F5F5F5]"
      contentContainerClassName="px-4 pb-10 pt-3"
      showsVerticalScrollIndicator={false}>
      <View className="rounded-2xl bg-[#EBEDF0] p-4">
        <Text className="text-sm font-semibold text-gray-700">내 컬렉션 총 가치</Text>
        <Text className="mt-1 text-4xl font-black tracking-tight text-gray-900">
          {formatWon(summary.data?.totalValue ?? 0)}
        </Text>
      </View>

      <View className="mt-3 flex-row gap-2">
        {countCards.map((card) => (
          <View
            key={card.key}
            className={`flex-1 rounded-2xl border border-gray-200 py-3 ${card.className}`}>
            <Text className="text-center text-3xl font-bold text-gray-900">{card.value}</Text>
            <Text className="mt-1 text-center text-[11px] text-gray-600">{card.label}</Text>
          </View>
        ))}
      </View>

      <View className="mt-3 flex-row gap-2">
        {TABS.map((item) => {
          const active = activeTab === item.key;
          return (
            <Pressable
              key={item.key}
              onPress={() => setActiveTab(item.key)}
              className={`rounded-full px-4 py-1.5 ${active ? 'bg-[#FF6A00]' : 'bg-[#D9DDE3]'}`}>
              <Text className={`text-xs font-semibold ${active ? 'text-white' : 'text-gray-700'}`}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View className="mt-3">
        {items.isPending ? (
          <View className="rounded-2xl border border-gray-200 bg-white p-4">
            <Text className="text-sm text-gray-500">컬렉션을 불러오는 중...</Text>
          </View>
        ) : null}

        {!items.isPending && items.isError ? (
          <View className="rounded-2xl border border-red-200 bg-white p-4">
            <Text className="text-sm text-red-600">컬렉션 목록을 불러오지 못했습니다.</Text>
          </View>
        ) : null}

        {!items.isPending && !items.isError && (items.data?.items.length ?? 0) === 0 ? (
          <View className="rounded-2xl border border-gray-200 bg-white p-4">
            <Text className="text-sm text-gray-500">표시할 컬렉션이 없습니다.</Text>
          </View>
        ) : null}

        {!items.isPending && !items.isError ? (
          <View className="flex-row flex-wrap gap-2">
            {(items.data?.items ?? []).map((item) => (
              <View key={item.collectionItemId} className="w-[48%]">
                <CollectionCard
                  item={item}
                  onPress={() =>
                    router.push({
                      pathname: '/collection/[collectionItemId]',
                      params: { collectionItemId: String(item.collectionItemId) },
                    })
                  }
                />
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}
