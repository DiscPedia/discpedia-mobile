import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getMyReviews } from '@/apis/mypage/myreview';
import { deleteReview } from '@/apis/review';

export const myReviewKeys = {
  all: ['me', 'reviews'] as const,
};

export const useMyReviews = () =>
  useQuery({
    queryKey: myReviewKeys.all,
    queryFn: () => getMyReviews({ page: 0, size: 50 }),
  });

export const useDeleteMyReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: number) => deleteReview(reviewId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: myReviewKeys.all });
      // 마이페이지 통계의 리뷰 수도 함께 바뀐다.
      void queryClient.invalidateQueries({ queryKey: ['mypage', 'stats'] });
    },
  });
};
