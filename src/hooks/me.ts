import { useQuery } from '@tanstack/react-query';

import { getMe } from '@/apis/mypage/mypage';

/** 내 프로필. 리뷰의 수정·삭제 버튼 노출 판단에 쓴다. */
export const useMe = () =>
  useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    staleTime: 5 * 60_000,
  });
