import { Image as ExpoImage } from 'expo-image';
import { withUniwind } from 'uniwind';

/** expo-image는 서드파티라 className을 직접 못 받는다 — Uniwind로 감싼다. */
export const Image = withUniwind(ExpoImage);
