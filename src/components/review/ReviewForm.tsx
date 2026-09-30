import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import BackArrowIcon from '@/assets/icons/backArrow.svg';
import { StarRatingInput } from '@/components/common/StarRatingInput';
import { Image } from '@/components/ui/image';
import { getHighQualityCoverUrl } from '@/util/imageUtil';

type FormAlbum = {
  title?: string;
  artistName?: string;
  mediaType?: string;
  releaseDate?: string;
  coverImageUrl?: string;
};

type Props = {
  title: string;
  submitLabel: string;
  submittingLabel: string;
  hint: string;
  placeholder: string;
  album?: FormAlbum;
  albumLoading?: boolean;
  initialRating?: number;
  initialContent?: string;
  isSubmitting: boolean;
  onSubmit: (values: { rating: number; content: string }) => void;
};

/** 리뷰 작성·수정이 같은 화면 구조라 폼을 공유한다. */
const ReviewForm = ({
  title,
  submitLabel,
  submittingLabel,
  hint,
  placeholder,
  album,
  albumLoading = false,
  initialRating = 0,
  initialContent = '',
  isSubmitting,
  onSubmit,
}: Props) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [rating, setRating] = useState(initialRating);
  const [content, setContent] = useState(initialContent);

  const canSubmit = !isSubmitting && rating > 0 && content.trim().length > 0;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-white"
      style={{ paddingTop: insets.top }}>
      <View className="h-14 flex-row items-center justify-between border-b border-gray-100 px-4">
        <Pressable accessibilityLabel="뒤로 가기" onPress={() => router.back()} className="p-1">
          <BackArrowIcon width={24} height={24} />
        </Pressable>
        <Text className="text-base font-semibold text-gray-900">{title}</Text>
        <Pressable
          disabled={!canSubmit}
          onPress={() => onSubmit({ rating, content: content.trim() })}>
          <Text className={`text-sm font-medium ${canSubmit ? 'text-blue-500' : 'text-gray-300'}`}>
            {isSubmitting ? submittingLabel : submitLabel}
          </Text>
        </Pressable>
      </View>

      <ScrollView keyboardShouldPersistTaps="handled" contentContainerClassName="pb-10">
        <View className="items-center border-b border-gray-100 px-5 pb-6 pt-8">
          <View className="h-24 w-24 overflow-hidden rounded-2xl bg-gray-200">
            {album?.coverImageUrl ? (
              <Image
                source={{ uri: getHighQualityCoverUrl(album.coverImageUrl) }}
                contentFit="cover"
                className="h-full w-full"
              />
            ) : null}
          </View>
          <Text numberOfLines={1} className="mt-4 text-base font-semibold text-gray-900">
            {albumLoading ? '음반 정보를 불러오는 중...' : (album?.title ?? '음반 정보 없음')}
          </Text>
          <Text numberOfLines={1} className="mt-1 text-sm text-gray-500">
            {album?.artistName ?? ''}
          </Text>
          {album?.mediaType || album?.releaseDate ? (
            <View className="mt-2 flex-row items-center gap-2">
              {album.mediaType ? (
                <Text className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600">
                  {album.mediaType}
                </Text>
              ) : null}
              {album.releaseDate ? (
                <Text className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600">
                  {album.releaseDate.replaceAll('-', '.')}
                </Text>
              ) : null}
            </View>
          ) : null}
        </View>

        <View className="border-b border-gray-100 px-5 py-8">
          <Text className="mb-4 text-center text-sm text-gray-500">{hint}</Text>
          <StarRatingInput value={rating} onChange={setRating} />
        </View>

        <View className="px-5 py-4">
          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder={placeholder}
            placeholderTextColor="#d1d5db"
            multiline
            textAlignVertical="top"
            className="min-h-[200px] text-sm text-gray-900"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ReviewForm;
