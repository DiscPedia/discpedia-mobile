import type { NotificationType } from '@/apis/notification/notification';

/** 알림 종류별 배지 문구와 색 (피그마 N1 기준) */
export const NOTIFICATION_META: Record<
  NotificationType,
  { label: string; badge: string; badgeText: string; iconBg: string; icon: string }
> = {
  RELEASE: {
    label: '발매',
    badge: 'bg-blue-50',
    badgeText: 'text-blue-600',
    iconBg: 'bg-blue-50',
    icon: '♪',
  },
  PRICE: {
    label: '시세',
    badge: 'bg-green-50',
    badgeText: 'text-green-700',
    iconBg: 'bg-green-50',
    icon: '₩',
  },
  WISHLIST: {
    label: '위시',
    badge: 'bg-amber-50',
    badgeText: 'text-amber-700',
    iconBg: 'bg-amber-50',
    icon: '★',
  },
  AI: {
    label: 'AI 추천',
    badge: 'bg-violet-50',
    badgeText: 'text-violet-600',
    iconBg: 'bg-violet-50',
    icon: 'AI',
  },
  ACTIVITY: {
    label: '활동',
    badge: 'bg-red-50',
    badgeText: 'text-red-500',
    iconBg: 'bg-red-50',
    icon: '♥',
  },
};

/** 필터 칩: 전체 + 피그마의 4개 탭 */
export const NOTIFICATION_FILTERS: { label: string; type?: NotificationType }[] = [
  { label: '전체' },
  { label: '발매', type: 'RELEASE' },
  { label: '시세', type: 'PRICE' },
  { label: '위시', type: 'WISHLIST' },
  { label: '활동', type: 'ACTIVITY' },
];

/** "10분 전", "3시간 전", "4일 전" */
export const formatTimeAgo = (iso: string, now = Date.now()) => {
  const diffMin = Math.max(0, Math.floor((now - new Date(iso).getTime()) / 60000));
  if (diffMin < 1) return '방금';
  if (diffMin < 60) return `${diffMin}분 전`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}시간 전`;
  return `${Math.floor(diffHour / 24)}일 전`;
};

/** 목록 섹션 구분: 오늘 / 이번 주 / 이전 */
export const getSectionTitle = (iso: string, now = new Date()) => {
  const date = new Date(iso);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  if (date.getTime() >= startOfToday) return '오늘';
  if (date.getTime() >= startOfToday - 6 * 24 * 60 * 60 * 1000) return '이번 주';
  return '이전';
};
