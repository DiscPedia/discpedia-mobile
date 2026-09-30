import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import SearchIcon from '@/assets/icons/search.svg';
import { useArtists, useUpdateFavoriteArtists } from '@/hooks/artists';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

type Props = {
  initialSelectedIds: number[];
  completeOnboarding: boolean;
  onSaved: () => void;
};

/**
 * 선택 상태를 이 컴포넌트가 들고 있다. 화면은 기존 관심 아티스트를 받아온 뒤에
 * 마운트해서 초기 선택을 props로 넘긴다.
 */
const FavoriteArtistPicker = ({ initialSelectedIds, completeOnboarding, onSaved }: Props) => {
  const [keyword, setKeyword] = useState('');
  const [selectedIds, setSelectedIds] = useState(initialSelectedIds);
  const [errorMessage, setErrorMessage] = useState('');

  const debouncedKeyword = useDebouncedValue(keyword.trim());
  const artists = useArtists(debouncedKeyword);
  const saveFavorites = useUpdateFavoriteArtists();

  const toggleArtist = (id: number) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));

  const handleComplete = () => {
    if (selectedIds.length === 0 || saveFavorites.isPending) return;

    setErrorMessage('');
    saveFavorites.mutate(
      { artistIds: selectedIds, completeOnboarding },
      {
        onSuccess: onSaved,
        onError: () => setErrorMessage('저장에 실패했습니다. 다시 시도해 주세요.'),
      },
    );
  };

  const items = artists.data ?? [];
  const disabled = selectedIds.length === 0 || saveFavorites.isPending;

  return (
    <View className="flex-1 px-5 py-6">
      <Text className="text-[24px] font-extrabold leading-tight text-[#111111]">
        관심있는 아티스트
      </Text>
      <Text className="mt-2 text-[13px] text-[#8B8B93]">
        선택한 아티스트의 신보 소식을 알려드려요.
      </Text>

      <View className="mt-4 h-11 flex-row items-center rounded-[12px] bg-[#ECECEF] px-4">
        <SearchIcon width={16} height={16} opacity={0.5} />
        <TextInput
          value={keyword}
          onChangeText={setKeyword}
          placeholder="아티스트 검색"
          placeholderTextColor="#A7A7AE"
          className="ml-3 flex-1 text-[14px] text-[#2B2B2B]"
        />
      </View>

      {artists.isError ? (
        <Text className="mt-2 text-xs text-red-500">아티스트를 불러오지 못했습니다.</Text>
      ) : null}

      <ScrollView className="mt-6 flex-1" showsVerticalScrollIndicator={false}>
        {artists.isPending ? (
          <Text className="text-center text-sm text-[#8B8B93]">아티스트 불러오는 중...</Text>
        ) : items.length === 0 ? (
          <Text className="text-center text-sm text-[#8B8B93]">검색 결과가 없습니다.</Text>
        ) : (
          <View className="flex-row flex-wrap pb-4">
            {items.map((artist) => {
              const selected = selectedIds.includes(artist.id);

              return (
                <Pressable
                  key={artist.id}
                  onPress={() => toggleArtist(artist.id)}
                  className="mb-6 w-1/3 items-center">
                  <View
                    className={`h-16 w-16 items-center justify-center rounded-full ${
                      selected ? 'bg-[#050505]' : 'bg-[#E7E7EA]'
                    }`}>
                    <Text
                      className={`text-[24px] font-extrabold ${
                        selected ? 'text-white' : 'text-[#A9A9AF]'
                      }`}>
                      {artist.initial}
                    </Text>
                    {selected ? (
                      <View className="absolute -bottom-0.5 -right-0.5 h-5 w-5 items-center justify-center rounded-full bg-[#2F80FF]">
                        <Text className="text-[12px] text-white">✓</Text>
                      </View>
                    ) : null}
                  </View>
                  <Text
                    numberOfLines={2}
                    className="mt-2 text-center text-[12px] font-medium text-[#222222]">
                    {artist.name}
                    {artist.subName ? ` ${artist.subName}` : ''}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>

      <View className="pb-1 pt-2">
        {errorMessage ? (
          <Text className="mb-2 text-center text-sm text-red-500">{errorMessage}</Text>
        ) : null}
        <Pressable
          onPress={handleComplete}
          disabled={disabled}
          className={`h-12 items-center justify-center rounded-[12px] ${
            disabled ? 'bg-[#CFCFD4]' : 'bg-[#050505]'
          }`}>
          <Text className="text-[15px] font-semibold text-white">
            {saveFavorites.isPending ? '저장 중...' : `${selectedIds.length}명 선택 완료`}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default FavoriteArtistPicker;
