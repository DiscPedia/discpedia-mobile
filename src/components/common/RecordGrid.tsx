import type { ReactElement } from 'react';
import { FlatList, Text, View } from 'react-native';

import Record, { type RecordItem } from './Record';

type Props = {
  items: RecordItem[];
  isPending: boolean;
  isError: boolean;
  errorText: string;
  emptyText: string;
  /** 검색창·필터처럼 목록과 함께 스크롤되는 영역 */
  ListHeaderComponent?: ReactElement;
};

const SKELETON_COUNT = 8;

/** 웹의 `grid grid-cols-2 gap-6` 목록 대응. 목록이 길어 FlatList로 그린다. */
const RecordGrid = ({
  items,
  isPending,
  isError,
  errorText,
  emptyText,
  ListHeaderComponent,
}: Props) => {
  if (isPending) {
    return (
      <FlatList
        data={Array.from({ length: SKELETON_COUNT }, (_, index) => index)}
        keyExtractor={(index) => `skeleton-${index}`}
        numColumns={2}
        ListHeaderComponent={ListHeaderComponent}
        columnWrapperClassName="gap-6"
        contentContainerClassName="gap-6 px-4 pb-10 pt-4"
        showsVerticalScrollIndicator={false}
        renderItem={() => (
          <View className="h-[250px] flex-1 rounded-3xl border border-gray-100 bg-white" />
        )}
      />
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => String(item.id)}
      numColumns={2}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={
        <View className="rounded-2xl border border-gray-100 bg-white p-4">
          <Text className="text-sm text-gray-500">{isError ? errorText : emptyText}</Text>
        </View>
      }
      columnWrapperClassName="gap-6"
      contentContainerClassName="gap-6 px-4 pb-10 pt-4"
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <View className="flex-1">
          <Record item={item} />
        </View>
      )}
    />
  );
};

export default RecordGrid;
