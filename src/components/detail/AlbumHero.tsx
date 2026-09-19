import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';

import { Image } from '@/components/ui/image';
import { getHighQualityCoverUrl } from '@/util/imageUtil';

type Props = {
  coverAlt: string;
  coverImageUrl?: string;
};

// Uniwind에 그라데이션 유틸이 없어 이 영역만 expo-linear-gradient를 쓴다.
const AlbumHero = ({ coverAlt, coverImageUrl }: Props) => (
  <LinearGradient
    colors={['#DCD0F1', '#F4F1FA']}
    style={{ height: 280, alignItems: 'center', justifyContent: 'center' }}>
    <View className="h-[150px] w-[150px] overflow-hidden rounded-2xl bg-[#D8C7A9] shadow-xl">
      {coverImageUrl ? (
        <Image
          accessibilityLabel={coverAlt}
          source={{ uri: getHighQualityCoverUrl(coverImageUrl) }}
          contentFit="cover"
          className="h-full w-full"
        />
      ) : null}
    </View>
  </LinearGradient>
);

export default AlbumHero;
