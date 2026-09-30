import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert } from 'react-native';

import ReviewForm from '@/components/review/ReviewForm';
import { useAlbumDetail } from '@/hooks/albums';
import { useUpdateReview } from '@/hooks/reviews';

/**
 * 웹은 라우터 state로 리뷰 객체를 통째로 넘겼지만, 앱 라우터는 문자열 파라미터만
 * 넘길 수 있어 기존 별점·내용을 값으로 받는다. 앨범 정보는 albumId로 다시 조회한다.
 */
export default function EditReviewScreen() {
  const { reviewId, albumId, rating, content } = useLocalSearchParams<{
    reviewId: string;
    albumId?: string;
    rating?: string;
    content?: string;
  }>();
  const router = useRouter();
  const aladinItemId = Number(albumId);

  const album = useAlbumDetail(aladinItemId);
  const updateReview = useUpdateReview(aladinItemId);

  return (
    <ReviewForm
      title="리뷰 수정"
      submitLabel="수정"
      submittingLabel="수정 중"
      hint="별점과 리뷰 내용을 수정해 주세요."
      placeholder="이 음반에 대한 생각을 자유롭게 남겨주세요."
      album={album.data}
      albumLoading={album.isPending}
      initialRating={Number(rating) || 0}
      initialContent={content ?? ''}
      isSubmitting={updateReview.isPending}
      onSubmit={(values) =>
        updateReview.mutate(
          { reviewId: Number(reviewId), ...values },
          {
            onSuccess: () => router.back(),
            onError: () => Alert.alert('실패', '리뷰 수정에 실패했습니다.'),
          },
        )
      }
    />
  );
}
