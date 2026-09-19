import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

import type { RecordItem } from '@/components/common/Record';
import RecordGrid from '@/components/common/RecordGrid';
import { useNewReleases, useSearchAlbums } from '@/hooks/albums';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

type AlbumLike = {
  aladinItemId: number;
  title: string;
  artistName: string;
  mediaType: string;
  releaseDate: string;
  coverImageUrl?: string;
};

const toRecordItem = (item: AlbumLike): RecordItem => ({
  id: item.aladinItemId,
  label: 'NEW',
  format: item.mediaType,
  title: item.title,
  subtitle: item.artistName,
  date: item.releaseDate.replaceAll('-', '.'),
  coverImageUrl: item.coverImageUrl,
});

export default function SearchScreen() {
  const [keyword, setKeyword] = useState('');
  const debouncedKeyword = useDebouncedValue(keyword.trim());
  const isSearching = debouncedKeyword.length > 0;

  const search = useSearchAlbums(debouncedKeyword);
  const newReleases = useNewReleases({ page: 0, size: 20 });
  const source = isSearching ? search : newReleases;

  const items = (isSearching ? search.data?.items : newReleases.data?.items) ?? [];

  return (
    <View className="flex-1 bg-[#F5F5F5]">
      <RecordGrid
        items={items.map(toRecordItem)}
        isPending={source.isPending}
        isError={source.isError}
        errorText={
          isSearching ? '검색 결과를 불러오지 못했습니다.' : '새 음반 목록을 불러오지 못했습니다.'
        }
        emptyText={isSearching ? '검색 결과가 없습니다.' : '새로 나온 음반이 없습니다.'}
        ListHeaderComponent={
          <View className="gap-6 pb-6">
            <View className="flex-row items-center gap-3 rounded-full border border-gray-100 bg-white px-4 py-3 shadow-sm">
              <View className="h-5 w-5 rounded-full border-2 border-gray-300" />
              <TextInput
                value={keyword}
                onChangeText={setKeyword}
                placeholder="아티스트, 앨범명, 장르 검색"
                placeholderTextColor="#9ca3af"
                returnKeyType="search"
                className="flex-1 text-sm text-gray-700"
              />
            </View>
            <Text className="pl-3 text-2xl font-bold text-gray-900">
              {isSearching ? '검색 결과' : '새로 나온 음반'}
            </Text>
          </View>
        }
      />
    </View>
  );
}
