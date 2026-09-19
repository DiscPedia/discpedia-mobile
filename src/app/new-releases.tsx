import { useState } from 'react';
import { View } from 'react-native';

import type { AladinGenre, NewRelease } from '@/apis/aladin';
import type { MediaType } from '@/apis/collection/collection';
import AlbumFilterBar from '@/components/common/AlbumFilterBar';
import BackHeader from '@/components/common/BackHeader';
import type { RecordItem } from '@/components/common/Record';
import RecordGrid from '@/components/common/RecordGrid';
import { useNewReleases } from '@/hooks/albums';

const toRecordItem = (item: NewRelease): RecordItem => ({
  id: item.aladinItemId,
  label: 'NEW',
  format: item.mediaType,
  title: item.title,
  subtitle: item.artistName,
  date: item.releaseDate.replaceAll('-', '.'),
  coverImageUrl: item.coverImageUrl,
});

export default function NewReleasesScreen() {
  const [mediaType, setMediaType] = useState<MediaType | undefined>();
  const [genre, setGenre] = useState<AladinGenre | undefined>();
  const query = useNewReleases({ page: 0, size: 50, mediaType, genre });

  return (
    <View className="flex-1 bg-[#F5F5F5]">
      <BackHeader title="새로 나온 음반" />
      <RecordGrid
        items={(query.data?.items ?? []).map(toRecordItem)}
        isPending={query.isPending}
        isError={query.isError}
        errorText="새로 나온 음반 목록을 불러오지 못했습니다."
        emptyText="새로 나온 음반이 없습니다."
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
