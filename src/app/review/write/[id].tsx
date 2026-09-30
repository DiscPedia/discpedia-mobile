import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert } from 'react-native';

import ReviewForm from '@/components/review/ReviewForm';
import { useAlbumDetail } from '@/hooks/albums';
import { useCreateReview } from '@/hooks/reviews';

export default function WriteReviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const aladinItemId = Number(id);

  const album = useAlbumDetail(aladinItemId);
  const createReview = useCreateReview(aladinItemId);

  return (
    <ReviewForm
      title="리뷰 작성"
      submitLabel="등록"
      submittingLabel="등록 중"
      hint="이 음반, 어떠셨나요?"
      placeholder="이 음반에 대한 생각을 자유롭게 남겨주세요."
      album={album.data}
      albumLoading={album.isPending}
      isSubmitting={createReview.isPending}
      onSubmit={(values) =>
        createReview.mutate(values, {
          onSuccess: () => router.back(),
          onError: () => Alert.alert('실패', '리뷰 작성에 실패했습니다.'),
        })
      }
    />
  );
}
