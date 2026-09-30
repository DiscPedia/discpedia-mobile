import { Text, TextInput, View } from 'react-native';

type Props = {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
};

const TextAreaField = ({ label, placeholder, value, onChange }: Props) => (
  <View className="px-4">
    <Text className="mb-2 text-sm font-semibold text-gray-900">{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      placeholderTextColor="#9ca3af"
      multiline
      textAlignVertical="top"
      className="min-h-20 rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900"
    />
  </View>
);

export default TextAreaField;
