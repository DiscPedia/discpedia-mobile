import { call } from '../auth/ApiService';
import type { ApiResponse, PageResponse } from '../commontype';

/** GET /api/v1/me — UserProfileResponse */
export type Me = {
  subject: string;
  name?: string;
  nickname?: string;
  userName?: string;
  username?: string;
  email?: string;
  provider?: string;
  providerId?: string;
};

export type MyPageStats = {
  collectionCount: number;
  wishlistCount: number;
  reviewCount: number;
};

type CollectionSummaryData = {
  totalValue: number;
  counts: {
    total: number;
    lp: number;
    cd: number;
    wishlist: number;
    etc: number;
  };
};

/** 내 프로필 */
export const getMe = async (): Promise<Me> => {
  const res = (await call('/api/v1/me', 'GET')) as ApiResponse<Me>;
  return res.data;
};

/**
 * 마이페이지 통계 (전용 API 없음 → Swagger 조합)
 * - 컬렉션/위시: GET /api/v1/collections/summary
 * - 리뷰 수: GET /api/v1/me/reviews (totalItems)
 */
export const getMyPageStats = async (): Promise<MyPageStats> => {
  const [summaryRes, reviewsRes] = await Promise.all([
    call('/api/v1/collections/summary', 'GET'),
    call('/api/v1/me/reviews?page=0&size=1', 'GET'),
  ]);

  const summary = (summaryRes as ApiResponse<CollectionSummaryData>).data;
  const reviews = (reviewsRes as ApiResponse<PageResponse<unknown>>).data;

  return {
    collectionCount: summary.counts.total,
    wishlistCount: summary.counts.wishlist,
    reviewCount: reviews.totalItems,
  };
};
