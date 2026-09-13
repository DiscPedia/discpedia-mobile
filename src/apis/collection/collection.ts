import { call } from '../auth/ApiService';
import { unwrapData, unwrapPage } from '../apiResponse';
import type { PageResponse } from '../commontype';

export type MediaType = 'LP' | 'CD' | 'ETC';
export type CollectionStatus = 'OWNED' | 'WISHLIST';
export type Condition = 'NEW' | 'SEALED' | 'USED';

export type CollectionSummary = {
  totalValue: number;
  counts: {
    total: number;
    lp: number;
    cd: number;
    wishlist: number;
    etc: number;
  };
};

export type CollectionAlbum = {
  albumId: number;
  aladinItemId?: number;
  title: string;
  artistName: string;
  releaseDate: string;
  mediaType: MediaType;
  categoryPath: string;
  coverImageUrl: string;
  listPrice: number;
};

export const getCollectionAlbumAladinItemId = (album: CollectionAlbum): number =>
  album.aladinItemId ?? album.albumId;

export type CollectionItem = {
  collectionItemId: number;
  album: CollectionAlbum;
  status: CollectionStatus;
  condition?: Condition;
  purchasePrice?: number;
  currentEstimatedPrice?: number;
  priceChangeRate?: number;
  priceChangeAmount?: number;
};

export type CollectionListParams = {
  mediaType?: MediaType;
  status?: CollectionStatus;
  q?: string;
  page?: number;
  size?: number;
  sort?: string;
};

/** POST /api/v1/collections — 실제 서버는 aladinItemId 필수 */
export type CreateCollectionRequest = {
  aladinItemId: number;
  status: CollectionStatus;
  condition?: Condition;
  purchasePrice?: number;
  purchaseDate?: string;
  purchasePlace?: string;
  memo?: string;
};

/** PATCH /api/v1/collections/{id} */
export type UpdateCollectionRequest = {
  aladinItemId: number;
  status: CollectionStatus;
  condition?: Condition;
  purchasePrice?: number;
  purchaseDate?: string;
  purchasePlace?: string;
  memo?: string;
};

export type CollectionCreatedResponse = {
  collectionItemId: number;
};

export type MarketValue = {
  currentEstimatedPrice?: number;
  priceChangeRate?: number;
  priceChangeAmount?: number;
};

export type CollectionItemDetailRaw = {
  collectionItemId: number;
  album: CollectionAlbum;
  status: CollectionStatus;
  condition?: Condition;
  purchasePrice?: number;
  purchaseDate?: string;
  purchasePlace?: string;
  purchaseStore?: string;
  memo?: string;
  marketValue?: MarketValue;
  currentEstimatedPrice?: number;
  priceChangeRate?: number;
  priceChangeAmount?: number;
};

export type CollectionItemDetail = CollectionItemDetailRaw & {
  purchaseStore?: string;
};

const COLLECTIONS_BASE = '/api/v1/collections';

const toQueryString = (params: CollectionListParams) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, String(value));
    }
  });
  const query = search.toString();
  return query ? `?${query}` : '';
};

const normalizeDetail = (raw: CollectionItemDetailRaw): CollectionItemDetail => ({
  ...raw,
  purchaseStore: raw.purchasePlace ?? raw.purchaseStore,
  currentEstimatedPrice: raw.marketValue?.currentEstimatedPrice ?? raw.currentEstimatedPrice,
  priceChangeRate: raw.marketValue?.priceChangeRate ?? raw.priceChangeRate,
  priceChangeAmount: raw.marketValue?.priceChangeAmount ?? raw.priceChangeAmount,
});

const toCreateRequestBody = (request: CreateCollectionRequest) => ({
  aladinItemId: request.aladinItemId,
  status: request.status,
  condition: request.condition,
  purchasePrice: request.purchasePrice,
  purchaseDate: request.purchaseDate,
  purchasePlace: request.purchasePlace,
  memo: request.memo,
});

/** GET /api/v1/collections/summary */
export const getCollectionSummary = async (): Promise<CollectionSummary> => {
  const res = await call(`${COLLECTIONS_BASE}/summary`, 'GET');
  return unwrapData<CollectionSummary>(res);
};

/** GET /api/v1/collections */
export const getCollectionItems = async (
  params: CollectionListParams,
): Promise<PageResponse<CollectionItem>> => {
  const query = toQueryString(params);
  const res = await call(`${COLLECTIONS_BASE}${query}`, 'GET');
  return unwrapPage<CollectionItem>(res);
};

/** POST /api/v1/collections */
export const createCollection = async (
  request: CreateCollectionRequest,
): Promise<CollectionCreatedResponse> => {
  const res = await call(COLLECTIONS_BASE, 'POST', toCreateRequestBody(request));
  return unwrapData<CollectionCreatedResponse>(res);
};

/** GET /api/v1/collections/{collectionItemId} */
export const getCollectionItemDetail = async (
  collectionItemId: number,
): Promise<CollectionItemDetail> => {
  const res = await call(`${COLLECTIONS_BASE}/${collectionItemId}`, 'GET');
  return normalizeDetail(unwrapData<CollectionItemDetailRaw>(res));
};

const toUpdateRequestBody = (request: UpdateCollectionRequest) => ({
  aladinItemId: request.aladinItemId,
  status: request.status,
  condition: request.condition,
  purchasePrice: request.purchasePrice,
  purchaseDate: request.purchaseDate,
  purchasePlace: request.purchasePlace,
  memo: request.memo,
});

/** PATCH /api/v1/collections/{collectionItemId} */
export const updateCollection = async (
  collectionItemId: number,
  request: UpdateCollectionRequest,
): Promise<CollectionItemDetail> => {
  const res = await call(
    `${COLLECTIONS_BASE}/${collectionItemId}`,
    'PATCH',
    toUpdateRequestBody(request),
  );
  return normalizeDetail(unwrapData<CollectionItemDetailRaw>(res));
};

/** DELETE /api/v1/collections/{collectionItemId} */
export const deleteCollection = async (collectionItemId: number): Promise<void> => {
  await call(`${COLLECTIONS_BASE}/${collectionItemId}`, 'DELETE');
};

/** DELETE /api/v1/albums/{albumId}/wishlist */
export const deleteWishlist = async (albumId: number): Promise<void> => {
  await call(`/api/v1/albums/${albumId}/wishlist`, 'DELETE');
};
