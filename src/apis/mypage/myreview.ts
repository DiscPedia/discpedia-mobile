import { call } from '../auth/ApiService';
import { unwrapPage } from '../apiResponse';
import type { PageResponse } from '../commontype';

/** GET /api/v1/me/reviews — MyReview */
export type MyReviewApiItem = {
  reviewId: number;
  album: {
    albumId: number;
    title: string;
    artistName: string;
    coverImageUrl: string;
  };
  rating: number;
  content: string;
  createdAt: string;
};

/** MyReviewPage UI용 */
export type MyReviewItem = {
  reviewId: number;
  album: {
    albumId: number;
    coverImageUrl: string;
    albumName: string;
    artistName: string;
  };
  rating: number;
  reviewDate: string;
  content: string;
};

const formatReviewDate = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
};

const toMyReviewItem = (item: MyReviewApiItem): MyReviewItem => ({
  reviewId: item.reviewId,
  album: {
    albumId: item.album.albumId,
    coverImageUrl: item.album.coverImageUrl,
    albumName: item.album.title,
    artistName: item.album.artistName,
  },
  rating: item.rating,
  reviewDate: formatReviewDate(item.createdAt),
  content: item.content,
});

export type GetMyReviewsParams = {
  page?: number;
  size?: number;
};

/** 내 리뷰 목록 */
export const getMyReviews = async (
  params: GetMyReviewsParams = {},
): Promise<PageResponse<MyReviewItem>> => {
  const page = params.page ?? 0;
  const size = params.size ?? 50;
  const res = await call(`/api/v1/me/reviews?page=${page}&size=${size}`, 'GET');
  const pageData = unwrapPage<MyReviewApiItem>(res);
  return {
    ...pageData,
    items: pageData.items.map(toMyReviewItem),
  };
};

/** @deprecated getMyReviews 사용 */
export const getMyReview = async (): Promise<MyReviewItem[]> => {
  const page = await getMyReviews();
  return page.items;
};
