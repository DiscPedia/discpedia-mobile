import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createCollection,
  deleteCollection,
  getCollectionItemDetail,
  getCollectionItems,
  getCollectionSummary,
  updateCollection,
  type CollectionListParams,
  type CreateCollectionRequest,
  type UpdateCollectionRequest,
} from '@/apis/collection/collection';

export const collectionKeys = {
  all: ['collections'] as const,
  summary: ['collections', 'summary'] as const,
  items: (params: CollectionListParams) => ['collections', 'items', params] as const,
  detail: (collectionItemId: number) => ['collections', 'detail', collectionItemId] as const,
};

export const useCollectionSummary = () =>
  useQuery({
    queryKey: collectionKeys.summary,
    queryFn: getCollectionSummary,
  });

export const useCollectionItems = (params: CollectionListParams) =>
  useQuery({
    queryKey: collectionKeys.items(params),
    queryFn: () => getCollectionItems(params),
  });

export const useCollectionItemDetail = (collectionItemId: number) =>
  useQuery({
    queryKey: collectionKeys.detail(collectionItemId),
    queryFn: () => getCollectionItemDetail(collectionItemId),
    enabled: Number.isFinite(collectionItemId),
  });

/** 컬렉션이 바뀌면 목록·요약·마이페이지 통계가 함께 바뀐다. */
const useCollectionInvalidation = () => {
  const queryClient = useQueryClient();

  return () => {
    void queryClient.invalidateQueries({ queryKey: collectionKeys.all });
    void queryClient.invalidateQueries({ queryKey: ['mypage', 'stats'] });
  };
};

export const useCreateCollection = () => {
  const invalidate = useCollectionInvalidation();

  return useMutation({
    mutationFn: (request: CreateCollectionRequest) => createCollection(request),
    onSuccess: invalidate,
  });
};

export const useUpdateCollection = () => {
  const invalidate = useCollectionInvalidation();

  return useMutation({
    mutationFn: ({
      collectionItemId,
      ...request
    }: UpdateCollectionRequest & { collectionItemId: number }) =>
      updateCollection(collectionItemId, request),
    onSuccess: invalidate,
  });
};

export const useDeleteCollection = () => {
  const invalidate = useCollectionInvalidation();

  return useMutation({
    mutationFn: (collectionItemId: number) => deleteCollection(collectionItemId),
    onSuccess: invalidate,
  });
};
