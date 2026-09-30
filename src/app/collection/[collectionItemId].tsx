import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, Pressable, ScrollView, Share, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getCollectionAlbumAladinItemId } from '@/apis/collection/collection';
import BackArrowIcon from '@/assets/icons/backArrow.svg';
import CalendarIcon from '@/assets/icons/calendar.svg';
import ConditionIcon from '@/assets/icons/condition.svg';
import DollarIcon from '@/assets/icons/dollar.svg';
import PencilIcon from '@/assets/icons/pencil.svg';
import RedTrashCanIcon from '@/assets/icons/redTrashCan.svg';
import ShareIcon from '@/assets/icons/share.svg';
import StoreIcon from '@/assets/icons/store.svg';
import { Image } from '@/components/ui/image';
import { useCollectionItemDetail, useDeleteCollection } from '@/hooks/collection';
import { confirm } from '@/lib/confirm';
import { getHighQualityCoverUrl } from '@/util/imageUtil';

const formatWon = (value?: number) =>
  typeof value === 'number' ? `₩${value.toLocaleString('ko-KR')}` : '-';

const formatRate = (rate?: number, amount?: number) => {
  if (typeof rate !== 'number' || typeof amount !== 'number') return null;
  return `${amount >= 0 ? '+' : ''}${rate}% (${formatWon(amount)})`;
};

const InfoRow = ({
  Icon,
  label,
  value,
}: {
  Icon: typeof DollarIcon;
  label: string;
  value: string;
}) => (
  <View className="flex-row items-center justify-between">
    <View className="flex-row items-center gap-2">
      <Icon width={16} height={16} />
      <Text className="text-sm text-gray-500">{label}</Text>
    </View>
    <Text className="text-sm font-medium text-gray-900">{value}</Text>
  </View>
);

export default function CollectionDetailScreen() {
  const { collectionItemId } = useLocalSearchParams<{ collectionItemId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const itemId = Number(collectionItemId);
  const detail = useCollectionItemDetail(itemId);
  const removeCollection = useDeleteCollection();

  const item = detail.data;
  const priceDiff = formatRate(item?.priceChangeRate, item?.priceChangeAmount);

  const handleShare = () => {
    if (!item) return;
    void Share.share({ message: `${item.album.title} - ${item.album.artistName}` });
  };

  const handleEdit = () => {
    if (!item) return;

    router.push({
      pathname: '/collection/add/[id]',
      params: {
        id: String(getCollectionAlbumAladinItemId(item.album)),
        collectionItemId: String(item.collectionItemId),
      },
    });
  };

  const handleDelete = async () => {
    if (!item || removeCollection.isPending) return;

    const ok = await confirm('이 컬렉션을 삭제할까요?');
    if (!ok) return;

    removeCollection.mutate(item.collectionItemId, {
      onSuccess: () => router.back(),
      onError: () => Alert.alert('실패', '컬렉션 삭제에 실패했습니다.'),
    });
  };

  const actionDisabled = !item || detail.isPending;

  return (
    <View className="flex-1 bg-[#F5F5F5]">
      <View className="border-b border-gray-200 bg-white" style={{ paddingTop: insets.top }}>
        <View className="h-14 flex-row items-center justify-between px-4">
          <Pressable accessibilityLabel="뒤로 가기" onPress={() => router.back()}>
            <BackArrowIcon width={24} height={24} />
          </Pressable>
          <View className="flex-row items-center gap-2">
            <Pressable accessibilityLabel="공유" onPress={handleShare} className="p-2">
              <ShareIcon width={20} height={20} />
            </Pressable>
            <Pressable
              accessibilityLabel="수정"
              onPress={handleEdit}
              disabled={actionDisabled}
              className="p-2"
              style={{ opacity: actionDisabled ? 0.4 : 1 }}>
              <PencilIcon width={20} height={20} />
            </Pressable>
            <Pressable
              accessibilityLabel="삭제"
              onPress={handleDelete}
              disabled={actionDisabled || removeCollection.isPending}
              className="p-2"
              style={{ opacity: actionDisabled ? 0.4 : 1 }}>
              <RedTrashCanIcon width={20} height={20} />
            </Pressable>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerClassName="gap-3 px-4 pb-10 pt-3"
        showsVerticalScrollIndicator={false}>
        {detail.isPending ? (
          <View className="rounded-2xl border border-gray-200 bg-white p-4">
            <Text className="text-sm text-gray-500">불러오는 중...</Text>
          </View>
        ) : null}

        {!detail.isPending && detail.isError ? (
          <View className="rounded-2xl border border-red-200 bg-white p-4">
            <Text className="text-sm text-red-600">컬렉션 상세를 불러오지 못했습니다.</Text>
          </View>
        ) : null}

        {item ? (
          <>
            <View className="rounded-2xl border border-gray-200 bg-white p-3">
              <Image
                source={{ uri: getHighQualityCoverUrl(item.album.coverImageUrl) }}
                contentFit="contain"
                className="aspect-square w-full rounded-xl bg-gray-100"
              />
              <Text className="mt-3 text-sm text-gray-500">{item.album.artistName}</Text>
              <Text className="mt-1 text-lg font-bold text-gray-900">{item.album.title}</Text>
            </View>

            <View className="rounded-2xl border border-gray-200 bg-white p-4">
              <Text className="text-xs text-gray-500">현재 추정 시세</Text>
              <Text className="mt-1 text-3xl font-extrabold text-[#2B5FFF]">
                {formatWon(item.currentEstimatedPrice ?? item.album.listPrice)}
              </Text>
              {priceDiff ? (
                <Text className="mt-1 text-xs font-semibold text-[#0A9B47]">{priceDiff}</Text>
              ) : null}
            </View>

            <View className="rounded-2xl border border-gray-200 bg-white p-4">
              <Text className="mb-3 text-sm font-semibold text-gray-900">구매/상태 정보</Text>
              <View className="gap-2">
                <InfoRow Icon={DollarIcon} label="구매가격" value={formatWon(item.purchasePrice)} />
                <InfoRow Icon={CalendarIcon} label="구매날짜" value={item.purchaseDate ?? '-'} />
                <InfoRow Icon={StoreIcon} label="구매처" value={item.purchaseStore ?? '-'} />
                <InfoRow Icon={ConditionIcon} label="컨디션" value={item.condition ?? '-'} />
              </View>
            </View>

            <View className="rounded-2xl border border-gray-200 bg-white p-4">
              <Text className="mb-2 text-sm font-semibold text-gray-900">내 메모</Text>
              <Text className="text-sm leading-relaxed text-gray-700">
                {item.memo?.trim() || '메모가 없습니다.'}
              </Text>
            </View>
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}
