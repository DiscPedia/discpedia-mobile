import { Pressable, Text, View } from 'react-native';

const conditions = ['새제품', '미개봉', '중고'] as const;
export type ConditionType = (typeof conditions)[number];

type Props = {
  value: ConditionType;
  onChange: (value: ConditionType) => void;
};

const ConditionSelector = ({ value, onChange }: Props) => (
  <View className="px-4">
    <Text className="mb-3 text-sm font-semibold text-gray-900">컨디션 기록</Text>
    <View className="flex-row gap-3">
      {conditions.map((condition) => {
        const active = value === condition;
        return (
          <Pressable
            key={condition}
            onPress={() => onChange(condition)}
            className={`h-11 flex-1 items-center justify-center rounded-2xl ${
              active ? 'bg-black' : 'bg-gray-100'
            }`}>
            <Text className={`text-sm font-semibold ${active ? 'text-white' : 'text-gray-500'}`}>
              {condition}
            </Text>
          </Pressable>
        );
      })}
    </View>
  </View>
);

export default ConditionSelector;
