import { useQuery } from '@tanstack/react-query';

import {
  getCollectionItems,
  getCollectionSummary,
  type CollectionListParams,
} from '@/apis/collection/collection';

export const collectionKeys = {
  summary: ['collections', 'summary'] as const,
  items: (params: CollectionListParams) => ['collections', 'items', params] as const,
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
