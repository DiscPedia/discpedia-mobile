import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  getNotifications,
  getNotificationSettings,
  getUnreadCount,
  readAllNotifications,
  readNotification,
  updateNotificationSettings,
  type NotificationSettings,
  type NotificationType,
} from '@/apis/notification/notification';

export const notificationKeys = {
  all: ['notifications'] as const,
  list: (type?: NotificationType) => ['notifications', 'list', type ?? 'ALL'] as const,
  unread: ['notifications', 'unread'] as const,
  settings: ['notifications', 'settings'] as const,
};

export const useNotifications = (type?: NotificationType) =>
  useQuery({
    queryKey: notificationKeys.list(type),
    queryFn: () => getNotifications({ type }),
  });

export const useUnreadNotificationCount = () =>
  useQuery({
    queryKey: notificationKeys.unread,
    queryFn: getUnreadCount,
  });

export const useReadNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: readNotification,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationKeys.all }),
  });
};

export const useReadAllNotifications = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: readAllNotifications,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationKeys.all }),
  });
};

export const useNotificationSettings = () =>
  useQuery({
    queryKey: notificationKeys.settings,
    queryFn: getNotificationSettings,
  });

/** 토글은 바로 반영하고(낙관적 업데이트), 실패하면 이전 값으로 되돌린다. */
export const useUpdateNotificationSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateNotificationSettings,
    onMutate: async (patch: Partial<NotificationSettings>) => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.settings });
      const prev = queryClient.getQueryData<NotificationSettings>(notificationKeys.settings);
      if (prev) queryClient.setQueryData(notificationKeys.settings, { ...prev, ...patch });
      return { prev };
    },
    onError: (_err, _patch, context) => {
      if (context?.prev) queryClient.setQueryData(notificationKeys.settings, context.prev);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: notificationKeys.settings }),
  });
};
