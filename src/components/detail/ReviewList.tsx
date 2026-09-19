import { Pressable, Text, View } from 'react-native';

import type { ReviewItem, ReviewSort } from '@/apis/review';

type Props = {
  items: ReviewItem[];
  sort: ReviewSort;
  currentUserId?: string | null;
  isPending?: boolean;
  isError?: boolean;
  onSortChange?: (sort: ReviewSort) => void;
  onToggleLike?: (review: ReviewItem) => void;
  onEdit?: (review: ReviewItem) => void;
  onDelete?: (review: ReviewItem) => void;
};

const formatDate = (value: string) => value.split('T')[0]?.replaceAll('-', '.') ?? value;

const ReviewList = ({
  items,
  sort,
  currentUserId = null,
  isPending = false,
  isError = false,
  onSortChange,
  onToggleLike,
  onEdit,
  onDelete,
}: Props) => {
  const sortTextClassName = (active: boolean) =>
    active ? 'text-sm font-semibold text-gray-900' : 'text-xs text-gray-400';

  return (
    <View className="bg-white px-5 pb-24">
      <View className="mb-3 flex-row items-center justify-between">
        <Pressable onPress={() => onSortChange?.('LATEST')}>
          <Text className={sortTextClassName(sort === 'LATEST')}>최신순</Text>
        </Pressable>
        <Pressable onPress={() => onSortChange?.('RATING_DESC')}>
          <Text className={sortTextClassName(sort === 'RATING_DESC')}>별점순</Text>
        </Pressable>
      </View>

      {isPending ? (
        <View className="gap-3">
          {Array.from({ length: 3 }, (_, index) => (
            <View key={index} className="h-28 rounded-2xl border border-gray-100 bg-gray-50" />
          ))}
        </View>
      ) : null}

      {!isPending && isError ? (
        <View className="rounded-2xl border border-gray-100 p-4">
          <Text className="text-sm text-gray-500">리뷰를 불러오지 못했습니다.</Text>
        </View>
      ) : null}

      {!isPending && !isError && items.length === 0 ? (
        <View className="rounded-2xl border border-gray-100 p-4">
          <Text className="text-sm text-gray-500">아직 작성된 리뷰가 없습니다.</Text>
        </View>
      ) : null}

      {!isPending && !isError && items.length > 0 ? (
        <View className="gap-3">
          {items.map((item) => {
            const isMine = Boolean(currentUserId && item.writer.userId === currentUserId);

            return (
              <View
                key={item.reviewId}
                className="rounded-2xl border border-gray-100 p-4 shadow-sm">
                <View className="flex-row items-center justify-between">
                  <View className="min-w-0 flex-row items-center gap-2">
                    <Text className="h-7 w-7 rounded-full bg-gray-100 text-center text-xs leading-7">
                      {item.writer.profileInitial || item.writer.nickname[0]}
                    </Text>
                    <Text numberOfLines={1} className="text-sm font-semibold text-gray-900">
                      {item.writer.nickname}
                    </Text>
                  </View>
                  <Text className="text-xs text-yellow-500">★ {item.rating}</Text>
                </View>

                <Text className="mt-2 text-xs leading-relaxed text-gray-600">{item.content}</Text>

                <View className="mt-3 flex-row items-center justify-between">
                  <Text className="text-xs text-gray-400">{formatDate(item.createdAt)}</Text>
                  <View className="flex-row items-center gap-3">
                    <Pressable
                      accessibilityLabel={item.likedByMe ? '좋아요 취소' : '좋아요'}
                      onPress={() => onToggleLike?.(item)}>
                      <Text
                        className={`text-xs font-medium ${
                          item.likedByMe ? 'text-red-500' : 'text-gray-400'
                        }`}>
                        {item.likedByMe ? '♥' : '♡'} {item.likeCount}
                      </Text>
                    </Pressable>
                    {isMine ? (
                      <>
                        <Pressable onPress={() => onEdit?.(item)}>
                          <Text className="text-xs font-medium text-gray-500">수정</Text>
                        </Pressable>
                        <Pressable onPress={() => onDelete?.(item)}>
                          <Text className="text-xs font-medium text-red-400">삭제</Text>
                        </Pressable>
                      </>
                    ) : null}
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      ) : null}
    </View>
  );
};

export default ReviewList;
