import type { NotificationItem, NotificationSettings } from './notification';

const hoursAgo = (h: number) => new Date(Date.now() - h * 60 * 60 * 1000).toISOString();

/** 피그마 N1(알림 목록) 기준 목 데이터. 백엔드 연결 후 삭제한다. */
export const mockNotifications: NotificationItem[] = [
  {
    notificationId: 1,
    type: 'RELEASE',
    title: '관심 아티스트 · 한로로',
    body: '2nd LP [집] 예약판매가 오늘 14:00에 시작돼요. 레드 마블 컬러 한정반이에요.',
    coverImageUrl: null,
    aladinItemId: null,
    read: false,
    createdAt: hoursAgo(0.2),
  },
  {
    notificationId: 2,
    type: 'PRICE',
    title: '목표가 도달 · 자몽살구클럽',
    body: '설정한 ₩60,000 아래로 내려왔어요. 현재 알라딘 중고 최저가 ₩58,000',
    coverImageUrl: null,
    aladinItemId: null,
    read: false,
    createdAt: hoursAgo(1),
  },
  {
    notificationId: 3,
    type: 'WISHLIST',
    title: '위시리스트 · 악뮤 정규 4집 개화',
    body: '중고 매물 3건이 새로 올라왔어요. 최저 ₩18,500',
    coverImageUrl: null,
    aladinItemId: null,
    read: true,
    createdAt: hoursAgo(3),
  },
  {
    notificationId: 4,
    type: 'AI',
    title: '이번 주 AI 추천이 도착했어요',
    body: '최근 담은 인디 록 음반을 바탕으로 5장을 골랐어요.',
    coverImageUrl: null,
    aladinItemId: null,
    read: true,
    createdAt: hoursAgo(72),
  },
  {
    notificationId: 5,
    type: 'ACTIVITY',
    title: '내 리뷰에 좋아요',
    body: 'vinyl_lover님 외 4명이 [집] 리뷰를 좋아해요.',
    coverImageUrl: null,
    aladinItemId: null,
    read: true,
    createdAt: hoursAgo(96),
  },
  {
    notificationId: 6,
    type: 'RELEASE',
    title: '관심 아티스트 · 실리카겔',
    body: '새 앨범 LP 발매 정보가 알라딘에 등록됐어요.',
    coverImageUrl: null,
    aladinItemId: null,
    read: true,
    createdAt: hoursAgo(120),
  },
];

/** 피그마 N2(알림 설정) 기준 기본값 */
export const mockNotificationSettings: NotificationSettings = {
  pushEnabled: true,
  newRelease: true,
  preorderStart: true,
  targetPrice: true,
  wishlistListing: true,
  reviewLike: false,
  weeklyAiRecommendation: true,
  quietHours: true,
};
