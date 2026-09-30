import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

import ConditionSelector, { type ConditionType } from './ConditionSelector';
import InputField from './InputField';
import RecordSummaryCard from './RecordSummaryCard';
import SubmitBar from './SubmitBar';
import TextAreaField from './TextAreaField';

export type CollectionFormValues = {
  condition: ConditionType;
  price: string;
  purchaseDate: string;
  store: string;
  memo: string;
};

type Props = {
  record: { title: string; subtitle: string; coverImageUrl?: string };
  initialValues: CollectionFormValues;
  submitLabel: string;
  isSubmitting: boolean;
  onSubmit: (values: CollectionFormValues) => void;
};

/**
 * 폼 상태를 이 컴포넌트가 들고 있다. 화면은 서버 값이 준비된 뒤에 마운트해서
 * 초기값을 props로 넘긴다 (effect에서 setState 하지 않기 위해).
 */
const CollectionForm = ({ record, initialValues, submitLabel, isSubmitting, onSubmit }: Props) => {
  const [condition, setCondition] = useState(initialValues.condition);
  const [price, setPrice] = useState(initialValues.price);
  const [purchaseDate, setPurchaseDate] = useState(initialValues.purchaseDate);
  const [store, setStore] = useState(initialValues.store);
  const [memo, setMemo] = useState(initialValues.memo);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1">
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerClassName="gap-6 pb-32 pt-4">
        <RecordSummaryCard
          title={record.title}
          subtitle={record.subtitle}
          coverImageUrl={record.coverImageUrl}
        />
        <ConditionSelector value={condition} onChange={setCondition} />
        <InputField
          label="구매 가격 (원)"
          placeholder="예) 45000"
          keyboardType="number-pad"
          value={price}
          onChange={setPrice}
        />
        <InputField
          label="구매 날짜"
          placeholder="예) 2026-01-15"
          value={purchaseDate}
          onChange={setPurchaseDate}
        />
        <InputField
          label="구매처"
          placeholder="예) 알라딘, 바이닐샵 등"
          value={store}
          onChange={setStore}
        />
        <TextAreaField
          label="메모"
          placeholder="예) 정말 가지고 싶었는데... 너무 좋다"
          value={memo}
          onChange={setMemo}
        />
      </ScrollView>
      <SubmitBar
        label={submitLabel}
        disabled={isSubmitting}
        onSubmit={() => onSubmit({ condition, price, purchaseDate, store, memo })}
      />
    </KeyboardAvoidingView>
  );
};

export default CollectionForm;
