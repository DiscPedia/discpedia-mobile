import { QueryClient } from '@tanstack/react-query';

/**
 * 앱은 화면 재진입이 잦아 기본 staleTime을 1분 둔다 —
 * 탭을 오갈 때마다 목록을 다시 받지 않게 한다.
 */
export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        retry: 1,
      },
    },
  });
