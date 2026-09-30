import { Text, TextInput, View, type KeyboardTypeOptions } from 'react-native';

type Props = {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  keyboardType?: KeyboardTypeOptions;
};

const InputField = ({ label, placeholder, value, onChange, keyboardType }: Props) => (
  <View className="px-4">
    <Text className="mb-2 text-sm font-semibold text-gray-900">{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      placeholderTextColor="#9ca3af"
      keyboardType={keyboardType}
      className="h-12 rounded-2xl border border-gray-200 px-4 text-sm text-gray-900"
    />
  </View>
);

export default InputField;
