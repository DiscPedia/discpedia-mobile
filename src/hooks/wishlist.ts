import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createCollection, deleteWishlist, getCollectionItems } from '@/apis/collection/collection';

export const wishlistKeys = {
  all: ['collections', 'wishlist'] as const,
};

/** 위시리스트는 컬렉션 목록에서 status=WISHLIST로 걸러 쓴다 (전용 조회 API 없음). */
export const useWishlistItems = () =>
  useQuery({
    queryKey: wishlistKeys.all,
    queryFn: () => getCollectionItems({ status: 'WISHLIST', page: 0, size: 100 }),
  });

type ToggleWishlistArgs = {
  aladinItemId: number;
  isWishlisted: boolean;
  purchasePrice?: number;
};

export const useToggleWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ aladinItemId, isWishlisted, purchasePrice }: ToggleWishlistArgs) => {
      if (isWishlisted) {
        await deleteWishlist(aladinItemId);
        return;
      }

      await createCollection({
        aladinItemId,
        status: 'WISHLIST',
        condition: 'NEW',
        purchasePrice,
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: wishlistKeys.all }),
  });
};
