import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { maxContentWidth } from '@/shared/presentation/constants/theme';
import { useScreenInsets } from '@/shared/presentation/hooks/use-screen-insets';
import { makeStyles } from '@/shared/presentation/utils/make-styles';

interface Props {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function BottomSheet({ visible, onClose, children }: Props) {
  const styles = useStyles();
  const { bottom } = useScreenInsets();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}>
        <Pressable accessibilityLabel="Cerrar" onPress={onClose} style={[StyleSheet.absoluteFill, styles.backdrop]} />
        <View style={styles.sheet}>
          <ScrollView
            style={{ flexGrow: 0 }}
            contentContainerStyle={[styles.content, { paddingBottom: bottom + 10 }]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <View style={styles.handle} />
            {children}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const useStyles = makeStyles((c) => ({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
    maxWidth: maxContentWidth,
    alignSelf: 'center',
  },
  backdrop: { backgroundColor: c.backdrop },
  sheet: {
    maxHeight: '86%',
    backgroundColor: c.paper,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
  },
  content: { paddingTop: 10, paddingHorizontal: 20, gap: 16 },
  handle: { width: 40, height: 5, borderRadius: 5, backgroundColor: c.line20, alignSelf: 'center' },
}));
