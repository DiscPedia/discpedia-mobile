import { Pressable, ScrollView, Text, View } from 'react-native';

import type { AladinGenre } from '@/apis/aladin';
import type { MediaType } from '@/apis/collection/collection';

const mediaTypeOptions: MediaType[] = ['LP', 'CD'];
const genreOptions: { label: string; value: AladinGenre }[] = [
  { label: '인디/록', value: 'INDIE_ROCK' },
  { label: 'K-POP', value: 'K_POP' },
  { label: '재즈', value: 'JAZZ' },
  { label: '클래식', value: 'CLASSIC' },
  { label: '팝', value: 'POP' },
  { label: '힙합/R&B', value: 'HIPHOP_RNB' },
  { label: '일렉트로닉', value: 'ELECTRONIC' },
  { label: 'OST', value: 'OST' },
  { label: '뉴에이지', value: 'NEW_AGE' },
  { label: '월드', value: 'WORLD' },
  { label: '기타', value: 'ETC' },
];

type Props = {
  mediaType?: MediaType;
  genre?: AladinGenre;
  onMediaTypeChange: (value?: MediaType) => void;
  onGenreChange: (value?: AladinGenre) => void;
};

const chipClassName = (active: boolean) =>
  `h-10 shrink-0 items-center justify-center rounded-full border px-5 ${
    active ? 'border-[#4C6FFF] bg-[#EEF3FF]' : 'border-gray-200 bg-white'
  }`;

const chipTextClassName = (active: boolean) =>
  `text-sm font-medium ${active ? 'text-[#2B5FFF]' : 'text-gray-700'}`;

const AlbumFilterBar = ({ mediaType, genre, onMediaTypeChange, onGenreChange }: Props) => {
  return (
    <View className="gap-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-lg font-bold text-gray-900">추천 필터</Text>
        <View className="flex-row items-center gap-1">
          <Text className="text-sm font-medium text-gray-500">▽</Text>
          <Text className="text-sm font-medium text-gray-500">필터</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-3 pb-1">
        {mediaTypeOptions.map((option) => {
          const active = mediaType === option;
          return (
            <Pressable
              key={option}
              onPress={() => onMediaTypeChange(active ? undefined : option)}
              className={chipClassName(active)}>
              <Text className={chipTextClassName(active)}>{option}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-3 pb-1">
        {genreOptions.map((option) => {
          const active = genre === option.value;
          return (
            <Pressable
              key={option.value}
              onPress={() => onGenreChange(active ? undefined : option.value)}
              className={chipClassName(active)}>
              <Text className={chipTextClassName(active)}>{option.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default AlbumFilterBar;
