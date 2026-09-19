import { Alert } from 'react-native';

/** 웹 window.confirm 대응 — 취소/확인을 Promise<boolean>으로 돌려준다. */
export const confirm = (title: string, message?: string) =>
  new Promise<boolean>((resolve) => {
    Alert.alert(
      title,
      message,
      [
        { text: '취소', style: 'cancel', onPress: () => resolve(false) },
        { text: '확인', onPress: () => resolve(true) },
      ],
      { cancelable: true, onDismiss: () => resolve(false) },
    );
  });
