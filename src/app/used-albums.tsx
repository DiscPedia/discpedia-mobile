import { useState } from 'react';
import { View } from 'react-native';

import type { AladinGenre, UsedAlbum } from '@/apis/aladin';
import type { MediaType } from '@/apis/collection/collection';
import AlbumFilterBar from '@/components/common/AlbumFilterBar';
import BackHeader from '@/components/common/BackHeader';
import type { RecordItem } from '@/components/common/Record';
import RecordGrid from '@/components/common/RecordGrid';
import { useUsedAlbums } from '@/hooks/albums';

// 중고는 발매일 대신 중고가를 보여준다 (웹 UsedAlbumsPage와 동일).
const toRecordItem = (item: UsedAlbum): RecordItem => ({
  id: item.aladinItemId,
  label: 'USED',
  format: item.mediaType,
  title: item.title,
  subtitle: item.artistName,
  date: `${item.usedPrice.toLocaleString('ko-KR')}원`,
  coverImageUrl: item.coverImageUrl,
});

export default function UsedAlbumsScreen() {
  const [mediaType, setMediaType] = useState<MediaType | undefined>();
  const [genre, setGenre] = useState<AladinGenre | undefined>();
  const query = useUsedAlbums({ page: 0, size: 50, mediaType, genre });

  return (
    <View className="flex-1 bg-[#F5F5F5]">
      <BackHeader title="중고 거래 음반" />
      <RecordGrid
        items={(query.data?.items ?? []).map(toRecordItem)}
        isPending={query.isPending}
        isError={query.isError}
        errorText="중고 거래 음반 목록을 불러오지 못했습니다."
        emptyText="중고 거래 음반이 없습니다."
        ListHeaderComponent={
          <View className="pb-6">
            <AlbumFilterBar
              mediaType={mediaType}
              genre={genre}
              onMediaTypeChange={setMediaType}
              onGenreChange={setGenre}
            />
          </View>
        }
      />
    </View>
  );
}
