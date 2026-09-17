import { useState } from 'react';
import { Pressable, View, type GestureResponderEvent, type LayoutChangeEvent } from 'react-native';

import { fillForIndex } from '@/util/starUtil';

import SingleStar from './SingleStar';

type Props = {
  value: number;
  onChange: (rating: number) => void;
  className?: string;
};

// 웹과 같은 조작: 별의 왼쪽 절반을 누르면 0.5점, 오른쪽 절반은 1점.
export const StarRatingInput = ({ value, onChange, className = '' }: Props) => {
  const [starWidth, setStarWidth] = useState(0);

  const handleLayout = (event: LayoutChangeEvent) => {
    setStarWidth(event.nativeEvent.layout.width);
  };

  const handlePress = (index: number, event: GestureResponderEvent) => {
    const isLeftHalf = starWidth > 0 && event.nativeEvent.locationX < starWidth / 2;
    onChange(isLeftHalf ? index + 0.5 : index + 1);
  };

  return (
    <View
      accessibilityLabel={`별점 선택, 현재 ${value}점`}
      className={`flex-row items-center justify-center gap-2 ${className}`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Pressable
          key={index}
          accessibilityLabel={`${index + 1}번째 별`}
          onLayout={handleLayout}
          onPress={(event) => handlePress(index, event)}
          className="p-1">
          <SingleStar fill={fillForIndex(value, index)} size="text-4xl" />
        </Pressable>
      ))}
    </View>
  );
};
