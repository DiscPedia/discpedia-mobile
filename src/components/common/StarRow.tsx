import { View } from 'react-native';

import { fillForIndex } from '@/util/starUtil';

import SingleStar from './SingleStar';

type StarRowProps = {
  rating: number;
  className?: string;
};

export const StarRow = ({ rating, className = '' }: StarRowProps) => {
  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={`별점 ${rating}점`}
      className={`flex-row items-center gap-0.5 ${className}`}>
      {Array.from({ length: 5 }, (_, i) => (
        <SingleStar key={i} fill={fillForIndex(rating, i)} />
      ))}
    </View>
  );
};
