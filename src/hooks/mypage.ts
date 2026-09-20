import { useQuery } from '@tanstack/react-query';

import { getMyPageStats } from '@/apis/mypage/mypage';

/** 컬렉션 요약 + 내 리뷰 수를 합쳐 만든 통계 (전용 API 없음). */
export const useMyPageStats = () =>
  useQuery({
    queryKey: ['mypage', 'stats'],
    queryFn: getMyPageStats,
  });
