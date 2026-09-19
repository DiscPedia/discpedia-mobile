import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { PageResponse } from '@/apis/commontype';
import {
  deleteReview,
  getAlbumReviews,
  likeReview,
  unlikeReview,
  type ReviewItem,
  type ReviewSort,
} from '@/apis/review';

export const reviewKeys = {
  album: (aladinItemId: number) => ['reviews', aladinItemId] as const,
  albumSorted: (aladinItemId: number, sort: ReviewSort) => ['reviews', aladinItemId, sort] as const,
};

export const useAlbumReviews = (aladinItemId: number, sort: ReviewSort) =>
  useQuery({
    queryKey: reviewKeys.albumSorted(aladinItemId, sort),
    queryFn: () => getAlbumReviews(aladinItemId, { sort, page: 0, size: 20 }),
    enabled: Number.isFinite(aladinItemId),
  });

const patchReview = (
  page: PageResponse<ReviewItem> | undefined,
  reviewId: number,
  patch: (item: ReviewItem) => ReviewItem,
) =>
  page
    ? {
        ...page,
        items: page.items.map((item) => (item.reviewId === reviewId ? patch(item) : item)),
      }
    : page;

/** 웹과 같이 좋아요는 화면에 먼저 반영하고, 실패하면 되돌린다. */
export const useToggleReviewLike = (aladinItemId: number, sort: ReviewSort) => {
  const queryClient = useQueryClient();
  const queryKey = reviewKeys.albumSorted(aladinItemId, sort);

  return useMutation({
    mutationFn: (review: ReviewItem) =>
      review.likedByMe ? unlikeReview(review.reviewId) : likeReview(review.reviewId),
    onMutate: async (review) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<PageResponse<ReviewItem>>(queryKey);

      queryClient.setQueryData<PageResponse<ReviewItem>>(queryKey, (page) =>
        patchReview(page, review.reviewId, (item) => ({
          ...item,
          likedByMe: !item.likedByMe,
          likeCount: item.likedByMe ? Math.max(0, item.likeCount - 1) : item.likeCount + 1,
        })),
      );

      return { previous };
    },
    onError: (_error, _review, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData<PageResponse<ReviewItem>>(queryKey, (page) =>
        patchReview(page, data.reviewId, (item) => ({
          ...item,
          likeCount: data.likeCount,
          likedByMe: data.likedByMe,
        })),
      );
    },
  });
};

export const useDeleteReview = (aladinItemId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: number) => deleteReview(reviewId),
    onSuccess: () => {
      // 리뷰 목록과 별점 요약(앨범 상세)이 함께 바뀐다.
      void queryClient.invalidateQueries({ queryKey: reviewKeys.album(aladinItemId) });
      void queryClient.invalidateQueries({ queryKey: ['aladin', 'detail', aladinItemId] });
    },
  });
};
