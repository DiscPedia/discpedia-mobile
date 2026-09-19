import * as WebBrowser from 'expo-web-browser';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';

import type { ReviewItem, ReviewSort } from '@/apis/review';
import AlbumHero from '@/components/detail/AlbumHero';
import BottomCTA from '@/components/detail/BottomCTA';
import DetailHeader from '@/components/detail/DetailHeader';
import PriceInfo from '@/components/detail/PriceInfo';
import ProductInfo from '@/components/detail/ProductInfo';
import ReviewList from '@/components/detail/ReviewList';
import ReviewSummary from '@/components/detail/ReviewSummary';
import SpecList from '@/components/detail/SpecList';
import { useAlbumDetail } from '@/hooks/albums';
import { useMe } from '@/hooks/me';
import { useAlbumReviews, useDeleteReview, useToggleReviewLike } from '@/hooks/reviews';
import { useToggleWishlist, useWishlistItems } from '@/hooks/wishlist';
import { confirm } from '@/lib/confirm';

const formatDate = (value: string) => value.replaceAll('-', '.');
const formatWon = (value: number) => `${value.toLocaleString('ko-KR')}원`;

const toReviewDistribution = (ratingDistribution: Record<string, number> = {}) => {
  const total = Object.values(ratingDistribution).reduce((sum, count) => sum + count, 0);

  return [5, 4, 3, 2, 1].map((score) => {
    const count = ratingDistribution[String(score)] ?? 0;
    return { score, percent: total > 0 ? Math.round((count / total) * 100) : 0 };
  });
};

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const aladinItemId = Number(id);
  const [sort, setSort] = useState<ReviewSort>('LATEST');

  const album = useAlbumDetail(aladinItemId);
  const reviews = useAlbumReviews(aladinItemId, sort);
  const me = useMe();
  const wishlist = useWishlistItems();
  const toggleWishlist = useToggleWishlist();
  const toggleLike = useToggleReviewLike(aladinItemId, sort);
  const removeReview = useDeleteReview(aladinItemId);

  const isWishlisted = (wishlist.data?.items ?? []).some(
    (item) => item.album.albumId === aladinItemId,
  );

  const specItems = useMemo(() => {
    const data = album.data;
    if (!data) return [];

    return [
      data.description,
      data.publisher ? `출판사: ${data.publisher}` : undefined,
      data.categoryName ? `카테고리: ${data.categoryName}` : undefined,
      data.isbn13 ? `ISBN13: ${data.isbn13}` : undefined,
      data.stockStatus ? `재고 상태: ${data.stockStatus}` : undefined,
    ].filter((item): item is string => Boolean(item));
  }, [album.data]);

  const handleToggleWishlist = async () => {
    if (!album.data || toggleWishlist.isPending) return;

    const ok = await confirm(
      isWishlisted ? '위시리스트에서 삭제하시겠습니까?' : '위시리스트에 등록하시겠습니까?',
    );
    if (!ok) return;

    toggleWishlist.mutate(
      { aladinItemId, isWishlisted, purchasePrice: album.data.priceSales },
      {
        onError: () =>
          Alert.alert(
            '실패',
            isWishlisted ? '위시리스트 삭제에 실패했습니다.' : '위시리스트 등록에 실패했습니다.',
          ),
      },
    );
  };

  const handleOpenProduct = () => {
    const productUrl = album.data?.productUrl;
    if (!productUrl) return;
    void WebBrowser.openBrowserAsync(productUrl);
  };

  const handleDeleteReview = async (review: ReviewItem) => {
    const ok = await confirm('리뷰를 삭제하시겠습니까?');
    if (!ok) return;

    removeReview.mutate(review.reviewId, {
      onError: () => Alert.alert('실패', '리뷰 삭제에 실패했습니다.'),
    });
  };

  if (!Number.isFinite(aladinItemId) || album.isError) {
    return (
      <View className="flex-1 bg-[#F5F5F5]">
        <DetailHeader onBack={() => router.back()} />
        <Text className="px-5 pt-20 text-center text-sm text-gray-500">
          음반 상세 정보를 불러오지 못했습니다.
        </Text>
      </View>
    );
  }

  if (album.isPending) {
    return (
      <View className="flex-1 bg-[#F5F5F5]">
        <View className="h-[280px] bg-[#E4DCF3]" />
        <View className="-mt-6 rounded-t-3xl bg-white px-5 pt-5">
          <View className="h-4 w-32 rounded bg-gray-100" />
          <View className="mt-4 h-6 w-56 rounded bg-gray-100" />
          <View className="mt-3 h-4 w-28 rounded bg-gray-100" />
        </View>
        <DetailHeader onBack={() => router.back()} />
      </View>
    );
  }

  const data = album.data;
  const summary = data.reviewSummary;

  return (
    <View className="flex-1 bg-[#F5F5F5]">
      <ScrollView showsVerticalScrollIndicator={false}>
        <AlbumHero coverAlt={data.title} coverImageUrl={data.coverImageUrl} />
        <ProductInfo
          status={data.stockStatus || 'NEW'}
          format={data.mediaType}
          genre={data.categoryName}
          title={data.title}
          artist={data.artistName}
        />
        <PriceInfo
          releaseDate={formatDate(data.releaseDate)}
          originalPrice={formatWon(data.priceStandard)}
          price={formatWon(data.priceSales)}
        />
        <SpecList items={specItems} />
        <ReviewSummary
          rating={summary?.averageRating ?? 0}
          totalReviews={summary?.ratingCount ?? 0}
          distribution={toReviewDistribution(summary?.ratingDistribution)}
          onWriteReview={() =>
            router.push({ pathname: '/review/write/[id]', params: { id: String(aladinItemId) } })
          }
        />
        <ReviewList
          items={reviews.data?.items ?? []}
          sort={sort}
          currentUserId={me.data?.subject}
          isPending={reviews.isPending}
          isError={reviews.isError}
          onSortChange={setSort}
          onToggleLike={(review) => toggleLike.mutate(review)}
          onEdit={(review) =>
            router.push({
              pathname: '/review/edit/[reviewId]',
              params: { reviewId: String(review.reviewId) },
            })
          }
          onDelete={handleDeleteReview}
        />
      </ScrollView>

      <DetailHeader
        onBack={() => router.back()}
        onToggleLike={handleToggleWishlist}
        onOpenProduct={handleOpenProduct}
        liked={isWishlisted}
        likeDisabled={toggleWishlist.isPending}
      />
      <BottomCTA
        label="내 컬렉션에 추가하기"
        onPress={() =>
          router.push({ pathname: '/collection/add/[id]', params: { id: String(aladinItemId) } })
        }
      />
    </View>
  );
}
