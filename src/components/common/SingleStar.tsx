import { Text, View } from 'react-native';

import type { StarFill } from '@/util/starUtil';

type SingleStarProps = {
  fill: StarFill;
  /** 별 크기를 정하는 텍스트 클래스 */
  size?: string;
};

// 반별은 웹과 같은 방식 — 회색 별 위에 노란 별을 반만 겹쳐 보여준다.
const SingleStar = ({ fill, size = 'text-[17px]' }: SingleStarProps) => {
  const base = `leading-none ${size}`;

  if (fill === 'full') {
    return <Text className={`${base} text-amber-400`}>★</Text>;
  }

  if (fill === 'half') {
    return (
      <View className="relative">
        <Text className={`${base} text-gray-300`}>★</Text>
        <View className="absolute left-0 top-0 h-full w-1/2 overflow-hidden">
          <Text className={`${base} text-amber-400`}>★</Text>
        </View>
      </View>
    );
  }

  return <Text className={`${base} text-gray-300`}>★</Text>;
};

export default SingleStar;
