import { Switch, Text, View } from 'react-native';

type Props = {
  title: string;
  description?: string;
  value: boolean;
  disabled?: boolean;
  onChange: (value: boolean) => void;
};

/** 알림 설정 한 줄: 제목 · 설명 · 토글 (피그마 N2) */
const SettingToggleRow = ({ title, description, value, disabled, onChange }: Props) => (
  <View className={`flex-row items-center gap-3 px-4 py-3.5 ${disabled ? 'opacity-40' : ''}`}>
    <View className="flex-1">
      <Text className="text-[15px] font-semibold text-gray-900">{title}</Text>
      {description ? <Text className="mt-0.5 text-xs text-gray-400">{description}</Text> : null}
    </View>
    <Switch
      value={value}
      disabled={disabled}
      onValueChange={onChange}
      trackColor={{ false: '#D1D5DB', true: '#ED732E' }}
      thumbColor="#FFFFFF"
    />
  </View>
);

export default SettingToggleRow;
