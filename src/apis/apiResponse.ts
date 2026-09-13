import type { ApiResponse, PageResponse } from './commontype';

/** ApiResponse 래핑 또는 plain body 모두 처리 */
export function unwrapData<T>(res: unknown): T {
  const root = res as Record<string, unknown>;
  if (
    root &&
    typeof root === 'object' &&
    'data' in root &&
    root.data !== undefined &&
    root.data !== null
  ) {
    return root.data as T;
  }
  return res as T;
}

/** page/size/totalItems 또는 limit/offset/total 형식 모두 처리 */
export function unwrapPage<T>(res: unknown): PageResponse<T> {
  const page = unwrapData<Record<string, unknown>>(res);
  const items = (Array.isArray(page.items) ? page.items : []) as T[];

  const size =
    typeof page.size === 'number'
      ? page.size
      : typeof page.limit === 'number'
        ? page.limit
        : items.length;

  const pageIndex =
    typeof page.page === 'number'
      ? page.page
      : typeof page.offset === 'number' && size > 0
        ? Math.floor(page.offset / size)
        : 0;

  const totalItems =
    typeof page.totalItems === 'number'
      ? page.totalItems
      : typeof page.total === 'number'
        ? page.total
        : items.length;

  const totalPages =
    typeof page.totalPages === 'number'
      ? page.totalPages
      : size > 0
        ? Math.ceil(totalItems / size)
        : 1;

  const hasNext = typeof page.hasNext === 'boolean' ? page.hasNext : pageIndex + 1 < totalPages;

  return {
    items,
    page: pageIndex,
    size,
    totalItems,
    totalPages,
    hasNext,
  };
}

export function asApiResponse<T>(res: unknown): ApiResponse<T> {
  return res as ApiResponse<T>;
}
