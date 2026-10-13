import { Alert, ScrollView, Text, View } from 'react-native';

import type { NotificationSettings } from '@/apis/notification/notification';
import BackHeader from '@/components/common/BackHeader';
import SettingToggleRow from '@/components/notification/SettingToggleRow';
import { useNotificationSettings, useUpdateNotificationSettings } from '@/hooks/notifications';

type Row = { key: keyof NotificationSettings; title: string; description?: string };

/** 피그마 N2 섹션 구성 */
const SECTIONS: { title: string; rows: Row[] }[] = [
  {
    title: '발매',
    rows: [
      {
        key: 'newRelease',
        title: '관심 아티스트 신보',
        description: '관심 아티스트의 음반이 알라딘에 등록되면',
      },
      {
        key: 'preorderStart',
        title: '예약판매 시작 알림',
        description: '시작 하루 전 · 당일 오전에 알려드려요',
      },
    ],
  },
  {
    title: '시세 · 위시리스트',
    rows: [
      {
        key: 'targetPrice',
        title: '목표가 도달',
        description: '음반별로 설정한 가격 이하로 떨어지면',
      },
      {
        key: 'wishlistListing',
        title: '위시리스트 새 매물',
        description: '위시리스트 음반의 중고 매물이 올라오면',
      },
    ],
  },
  {
    title: '활동 · 추천',
    rows: [
      { key: 'reviewLike', title: '리뷰 좋아요' },
      {
        key: 'weeklyAiRecommendation',
        title: '주간 AI 추천',
        description: '매주 월요일 오전 10시',
      },
    ],
  },
  {
    title: '방해 금지',
    rows: [
      {
        key: 'quietHours',
        title: '야간 방해 금지',
        description: '22:00 ~ 08:00 알림을 모아서 아침에 보내요',
      },
    ],
  },
];

/** 알림 설정 (피그마 N2). 토글은 바로 저장된다. */
export default function NotificationSettingsScreen() {
  const settings = useNotificationSettings();
  const update = useUpdateNotificationSettings();

  const change = (key: keyof NotificationSettings, value: boolean) =>
    update.mutate(
      { [key]: value },
      { onError: () => Alert.alert('실패', '알림 설정을 저장하지 못했습니다.') },
    );

  if (!settings.data) {
    return (
      <View className="flex-1 bg-[#F5F5F5]">
        <BackHeader title="알림 설정" />
        <Text className="px-4 pt-3 text-sm text-gray-500">
          {settings.isError ? '알림 설정을 불러오지 못했습니다.' : '불러오는 중...'}
        </Text>
      </View>
    );
  }

  const data = settings.data;

  return (
    <View className="flex-1 bg-[#F5F5F5]">
      <BackHeader title="알림 설정" />
      <ScrollView contentContainerClassName="gap-2 px-4 pb-10 pt-2">
        <View className="overflow-hidden rounded-2xl bg-white">
          <SettingToggleRow
            title="푸시 알림 받기"
            description="꺼두면 모든 알림이 앱 안에서만 쌓여요"
            value={data.pushEnabled}
            onChange={(v) => change('pushEnabled', v)}
          />
        </View>

        {SECTIONS.map((section) => (
          <View key={section.title} className="gap-2">
            <Text className="mt-3 text-sm font-semibold text-gray-500">{section.title}</Text>
            <View className="overflow-hidden rounded-2xl bg-white">
              {section.rows.map((row, i) => (
                <View key={row.key} className={i > 0 ? 'border-t border-gray-100' : ''}>
                  <SettingToggleRow
                    title={row.title}
                    description={row.description}
                    value={data[row.key]}
                    disabled={!data.pushEnabled}
                    onChange={(v) => change(row.key, v)}
                  />
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
