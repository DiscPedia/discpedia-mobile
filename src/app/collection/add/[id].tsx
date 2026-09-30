import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, Text, View } from 'react-native';

import { getCollectionAlbumAladinItemId, type Condition } from '@/apis/collection/collection';
import AddCollectionHeader from '@/components/collection/AddCollectionHeader';
import CollectionForm, { type CollectionFormValues } from '@/components/collection/CollectionForm';
import { type ConditionType } from '@/components/collection/ConditionSelector';
import { useAlbumDetail } from '@/hooks/albums';
import {
  useCollectionItemDetail,
  useCreateCollection,
  useUpdateCollection,
} from '@/hooks/collection';

const conditionMap: Record<ConditionType, Condition> = {
  새제품: 'NEW',
  미개봉: 'SEALED',
  중고: 'USED',
};

const conditionLabelMap: Record<Condition, ConditionType> = {
  NEW: '새제품',
  SEALED: '미개봉',
  USED: '중고',
};

const EMPTY_VALUES: CollectionFormValues = {
  condition: '새제품',
  price: '',
  purchaseDate: '',
  store: '',
  memo: '',
};

/** 웹 AddCollectionsPage와 같이 추가·수정을 한 화면에서 처리한다. */
export default function AddCollectionScreen() {
  const { id, collectionItemId } = useLocalSearchParams<{
    id: string;
    collectionItemId?: string;
  }>();
  const router = useRouter();

  const aladinItemIdFromUrl = Number(id);
  const editItemId = Number(collectionItemId);
  const isEdit = Number.isFinite(editItemId);

  const editItem = useCollectionItemDetail(editItemId);
  const album = useAlbumDetail(isEdit ? NaN : aladinItemIdFromUrl);
  const createCollection = useCreateCollection();
  const updateCollection = useUpdateCollection();

  const item = editItem.data;
  const record = item
    ? {
        title: item.album.title,
        subtitle: item.album.artistName,
        coverImageUrl: item.album.coverImageUrl,
      }
    : album.data
      ? {
          title: album.data.title,
          subtitle: album.data.artistName,
          coverImageUrl: album.data.coverImageUrl,
        }
      : null;

  const initialValues: CollectionFormValues = item
    ? {
        condition: item.condition ? (conditionLabelMap[item.condition] ?? '새제품') : '새제품',
        price: typeof item.purchasePrice === 'number' ? String(item.purchasePrice) : '',
        purchaseDate: item.purchaseDate ?? '',
        store: item.purchasePlace ?? item.purchaseStore ?? '',
        memo: item.memo ?? '',
      }
    : EMPTY_VALUES;

  const isSubmitting = createCollection.isPending || updateCollection.isPending;
  const title = isEdit ? '컬렉션 수정' : '내 컬렉션 추가';

  const handleSubmit = (values: CollectionFormValues) => {
    const purchasePrice = Number(values.price);

    if (values.price.trim() === '' || !Number.isFinite(purchasePrice) || purchasePrice < 0) {
      Alert.alert('확인', '구매 가격을 올바르게 입력해 주세요.');
      return;
    }

    const common = {
      condition: conditionMap[values.condition],
      purchasePrice,
      purchaseDate: values.purchaseDate || undefined,
      purchasePlace: values.store || undefined,
      memo: values.memo || undefined,
    };

    if (isEdit && item) {
      updateCollection.mutate(
        {
          collectionItemId: editItemId,
          aladinItemId: getCollectionAlbumAladinItemId(item.album),
          status: item.status,
          ...common,
        },
        {
          onSuccess: () => router.back(),
          onError: () => Alert.alert('실패', '컬렉션 수정에 실패했습니다.'),
        },
      );
      return;
    }

    if (!Number.isFinite(aladinItemIdFromUrl) || aladinItemIdFromUrl <= 0) {
      Alert.alert('확인', '음반 아이디가 올바르지 않습니다.');
      return;
    }

    createCollection.mutate(
      { aladinItemId: aladinItemIdFromUrl, status: 'OWNED', ...common },
      {
        onSuccess: (data) =>
          router.replace({
            pathname: '/collection/[collectionItemId]',
            params: { collectionItemId: String(data.collectionItemId) },
          }),
        onError: () => Alert.alert('실패', '컬렉션 등록에 실패했습니다.'),
      },
    );
  };

  if (!record) {
    const loading = isEdit ? editItem.isPending : album.isPending;

    return (
      <View className="flex-1 bg-[#F5F5F5]">
        <AddCollectionHeader title={title} onBack={() => router.back()} />
        <Text className="mt-8 px-5 text-center text-sm text-gray-500">
          {loading ? '음반 정보를 불러오는 중...' : '음반 정보를 불러올 수 없습니다.'}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F5F5F5]">
      <AddCollectionHeader title={title} onBack={() => router.back()} />
      <CollectionForm
        key={item?.collectionItemId ?? 'new'}
        record={record}
        initialValues={initialValues}
        isSubmitting={isSubmitting}
        submitLabel={
          isSubmitting
            ? isEdit
              ? '수정 중...'
              : '등록 중...'
            : isEdit
              ? '수정 완료'
              : '컬렉션에 등록하기'
        }
        onSubmit={handleSubmit}
      />
    </View>
  );
}
