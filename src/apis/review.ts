import { call } from './auth/ApiService';
import type { ApiResponse, PageResponse } from './commontype';

export type CreateReviewRequest = {
  rating: number;
  content: string;
};

export type ReviewMutationResponse = {
  reviewId: number;
  albumId: number;
  rating: number;
  content: string;
  createdAt: string;
};

export type ReviewSort = 'LATEST' | 'RATING_DESC' | 'RATING_ASC';

export type ReviewWriter = {
  userId: string;
  nickname: string;
  profileInitial: string;
};

export type ReviewItem = {
  reviewId: number;
  writer: ReviewWriter;
  rating: number;
  content: string;
  likeCount: number;
  likedByMe: boolean;
  commentCount: number;
  createdAt: string;
};

export type ReviewLikeResponse = {
  reviewId: number;
  likeCount: number;
  likedByMe: boolean;
};

export type ReviewListParams = {
  sort?: ReviewSort;
  page?: number;
  size?: number;
};

const toQueryString = (params: ReviewListParams) => {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      search.set(key, String(value));
    }
  });

  const query = search.toString();
  return query ? `?${query}` : '';
};

export const createReview = async (
  aladinItemId: number,
  request: CreateReviewRequest,
): Promise<ReviewMutationResponse> => {
  const res = (await call(
    `/api/v1/albums/${aladinItemId}/reviews`,
    'POST',
    request,
  )) as ApiResponse<ReviewMutationResponse>;

  return res.data;
};

export const getAlbumReviews = async (
  aladinItemId: number,
  params: ReviewListParams = {},
): Promise<PageResponse<ReviewItem>> => {
  const query = toQueryString(params);
  const res = (await call(`/api/v1/albums/${aladinItemId}/reviews${query}`, 'GET')) as ApiResponse<
    PageResponse<ReviewItem>
  >;

  return res.data;
};

export const likeReview = async (reviewId: number): Promise<ReviewLikeResponse> => {
  const res = (await call(
    `/api/v1/reviews/${reviewId}/like`,
    'PUT',
  )) as ApiResponse<ReviewLikeResponse>;

  return res.data;
};

export const unlikeReview = async (reviewId: number): Promise<ReviewLikeResponse> => {
  const res = (await call(
    `/api/v1/reviews/${reviewId}/like`,
    'DELETE',
  )) as ApiResponse<ReviewLikeResponse>;

  return res.data;
};

export const updateReview = async (
  reviewId: number,
  request: CreateReviewRequest,
): Promise<ReviewMutationResponse> => {
  const res = (await call(
    `/api/v1/reviews/${reviewId}`,
    'PATCH',
    request,
  )) as ApiResponse<ReviewMutationResponse>;

  return res.data;
};

export const deleteReview = async (reviewId: number): Promise<void> => {
  await call(`/api/v1/reviews/${reviewId}`, 'DELETE');
};
