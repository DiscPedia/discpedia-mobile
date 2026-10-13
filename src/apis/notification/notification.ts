import { call } from '../auth/ApiService';
import { unwrapData, unwrapPage } from '../apiResponse';
import type { PageResponse } from '../commontype';
import { mockNotifications, mockNotificationSettings } from './notificationMock';

/**
 * 알림 API (초안)
 * 백엔드 알림 API가 아직 없어서 USE_MOCK=true면 목 데이터로 동작한다.
 * 백엔드가 Swagger에 계약을 올리면 경로·필드만 맞추고 USE_MOCK을 false로 바꾼다.
 */
const USE_MOCK = true;

export type NotificationType = 'RELEASE' | 'PRICE' | 'WISHLIST' | 'AI' | 'ACTIVITY';

export type NotificationItem = {
  notificationId: number;
  type: NotificationType;
  title: string;
  body: string;
  /** 앨범 관련 알림이면 커버, 아니면 null */
  coverImageUrl: string | null;
  /** 탭했을 때 이동할 알라딘 itemId (없으면 이동하지 않음) */
  aladinItemId: number | null;
  read: boolean;
  createdAt: string;
};

export type NotificationSettings = {
  pushEnabled: boolean;
  newRelease: boolean;
  preorderStart: boolean;
  targetPrice: boolean;
  wishlistListing: boolean;
  reviewLike: boolean;
  weeklyAiRecommendation: boolean;
  quietHours: boolean;
};

export type GetNotificationsParams = {
  type?: NotificationType;
  page?: number;
  size?: number;
};

let mockStore = [...mockNotifications];
let mockSettings = { ...mockNotificationSettings };

/** GET /api/v1/notifications?type=&page=&size= */
export const getNotifications = async (
  params: GetNotificationsParams = {},
): Promise<PageResponse<NotificationItem>> => {
  const { type, page = 0, size = 20 } = params;

  if (USE_MOCK) {
    const items = type ? mockStore.filter((n) => n.type === type) : mockStore;
    return {
      items,
      page,
      size,
      totalItems: items.length,
      totalPages: 1,
      hasNext: false,
    };
  }

  const query = new URLSearchParams({ page: String(page), size: String(size) });
  if (type) query.set('type', type);
  const res = await call(`/api/v1/notifications?${query.toString()}`, 'GET');
  return unwrapPage<NotificationItem>(res);
};

/** GET /api/v1/notifications/unread-count */
export const getUnreadCount = async (): Promise<number> => {
  if (USE_MOCK) return mockStore.filter((n) => !n.read).length;

  const res = await call('/api/v1/notifications/unread-count', 'GET');
  return unwrapData<{ count: number }>(res).count;
};

/** PATCH /api/v1/notifications/{notificationId}/read */
export const readNotification = async (notificationId: number): Promise<void> => {
  if (USE_MOCK) {
    mockStore = mockStore.map((n) =>
      n.notificationId === notificationId ? { ...n, read: true } : n,
    );
    return;
  }

  await call(`/api/v1/notifications/${notificationId}/read`, 'PATCH');
};

/** PATCH /api/v1/notifications/read-all */
export const readAllNotifications = async (): Promise<void> => {
  if (USE_MOCK) {
    mockStore = mockStore.map((n) => ({ ...n, read: true }));
    return;
  }

  await call('/api/v1/notifications/read-all', 'PATCH');
};

/** GET /api/v1/me/notification-settings */
export const getNotificationSettings = async (): Promise<NotificationSettings> => {
  if (USE_MOCK) return mockSettings;

  const res = await call('/api/v1/me/notification-settings', 'GET');
  return unwrapData<NotificationSettings>(res);
};

/** PATCH /api/v1/me/notification-settings — 바뀐 항목만 보낸다 */
export const updateNotificationSettings = async (
  patch: Partial<NotificationSettings>,
): Promise<NotificationSettings> => {
  if (USE_MOCK) {
    mockSettings = { ...mockSettings, ...patch };
    return mockSettings;
  }

  const res = await call('/api/v1/me/notification-settings', 'PATCH', patch);
  return unwrapData<NotificationSettings>(res);
};
