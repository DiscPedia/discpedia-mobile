/// <reference types="expo/types" />

// SVG는 react-native-svg-transformer를 거쳐 React 컴포넌트가 된다.
declare module '*.svg' {
  import type { FC } from 'react';
  import type { SvgProps } from 'react-native-svg';
  const content: FC<SvgProps>;
  export default content;
}
