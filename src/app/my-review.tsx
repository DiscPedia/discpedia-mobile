import { useRouter } from 'expo-router';
import { Alert, FlatList, Pressable, Text, View } from 'react-native';

import type { MyReviewItem } from '@/apis/mypage/myreview';
import TrashCanIcon from '@/assets/icons/trashCan.svg';
import WriteIcon from '@/assets/icons/write.svg';
import BackHeader from '@/components/common/BackHeader';
import { StarRow } from '@/components/common/StarRow';
import { Image } from '@/components/ui/image';
import { useDeleteMyReview, useMyReviews } from '@/hooks/my-reviews';
import { confirm } from '@/lib/confirm';
import { getHighQualityCoverUrl } from '@/util/imageUtil';

export default function MyReviewScreen() {
  const router = useRouter();
  const reviews = useMyReviews();
  const removeReview = useDeleteMyReview();

  const handleEdit = (item: MyReviewItem) =>
    router.push({
      pathname: '/review/edit/[reviewId]',
      params: {
        reviewId: String(item.reviewId),
        albumId: String(item.album.albumId),
        rating: String(item.rating),
        content: item.content,
      },
    });

  const handleDelete = async (item: MyReviewItem) => {
    const ok = await confirm('리뷰를 삭제하시겠습니까?');
    if (!ok) return;

    removeReview.mutate(item.reviewId, {
      onError: () => Alert.alert('실패', '리뷰 삭제에 실패했습니다.'),
    });
  };

  const message = reviews.isPending
    ? '리뷰를 불러오는 중...'
    : reviews.isError
      ? '리뷰를 불러오지 못했습니다.'
      : '작성한 리뷰가 없습니다.';

  return (
    <View className="flex-1 bg-[#F5F5F5]">
      <BackHeader title="내 리뷰 모아보기" />
      <FlatList
        data={reviews.data?.items ?? []}
        keyExtractor={(item) => String(item.reviewId)}
        contentContainerClassName="gap-3 px-4 pb-8 pt-3"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View
            className={`rounded-2xl border bg-white p-4 ${
              reviews.isError ? 'border-red-200' : 'border-gray-200'
            }`}>
            <Text className={`text-sm ${reviews.isError ? 'text-red-600' : 'text-gray-500'}`}>
              {message}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View className="rounded-[18px] border border-gray-200 bg-white p-4 shadow-sm">
            <View className="flex-row gap-3">
              <Image
                source={{ uri: getHighQualityCoverUrl(item.album.coverImageUrl) }}
                contentFit="cover"
                className="h-[72px] w-[72px] rounded-xl bg-gray-100"
              />
              <View className="min-w-0 flex-1 pt-0.5">
                <Text numberOfLines={1} className="font-semibold text-gray-900">
                  {item.album.albumName}
                </Text>
                <Text numberOfLines={1} className="mt-0.5 text-sm text-gray-500">
                  {item.album.artistName}
                </Text>
              </View>
              <View className="flex-row gap-1 self-start pt-0.5">
                <Pressable
                  accessibilityLabel="리뷰 수정"
                  onPress={() => handleEdit(item)}
                  className="rounded-lg p-1.5">
                  <WriteIcon width={20} height={20} />
                </Pressable>
                <Pressable
                  accessibilityLabel="리뷰 삭제"
                  onPress={() => handleDelete(item)}
                  className="rounded-lg p-1.5">
                  <TrashCanIcon width={20} height={20} />
                </Pressable>
              </View>
            </View>

            <View className="mt-3 rounded-xl bg-[#f9f9f9] p-3">
              <View className="mb-2 flex-row items-center gap-3">
                <StarRow rating={item.rating} />
                <Text className="text-xs text-gray-500">{item.reviewDate}</Text>
              </View>
              <Text className="text-sm leading-relaxed text-gray-900">{item.content}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}
