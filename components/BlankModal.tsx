import { colors } from "@/utils/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, {
  forwardRef,
  PropsWithChildren,
  ReactNode,
  useImperativeHandle,
  useState,
} from "react";
import {
  Modal,
  ModalProps,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppToast from "./AppToast";

interface BlankModalProps extends PropsWithChildren, ModalProps {
  illustrator?: ReactNode;
  title?: string;
  titleStyle?: StyleProp<TextStyle>;
  description?: string;
  descriptionStyle?: StyleProp<TextStyle>;
  /**
   * User can close the modal by pressing outside the modal
   */
  canCloseByPressingOutside?: boolean;
  /**
   * Style for the entire modal container
   */
  outerStyle?: StyleProp<ViewStyle>;
  modalStyle?: StyleProp<ViewStyle>;
}

export interface BlankModalRef {
  open: () => void;
  close: () => void;
}

export const BlankModal = forwardRef<BlankModalRef, BlankModalProps>(
  (
    {
      illustrator,
      title,
      titleStyle,
      description,
      descriptionStyle,
      canCloseByPressingOutside,
      outerStyle,
      modalStyle,
      children,
      ...rnModalProps
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState(false);
    const insets = useSafeAreaInsets();

    const open = () => {
      setIsVisible(true);
    };

    const close = () => {
      setIsVisible(false);
    };

    useImperativeHandle(ref, () => ({
      open,
      close,
    }));

    return (
      <Modal
        visible={isVisible}
        statusBarTranslucent
        navigationBarTranslucent
        animationType="fade"
        transparent
        onRequestClose={close}
        {...rnModalProps}
      >
        <View style={[styles.modalContainer, outerStyle]}>
          {/* Modal Backdrop */}
          {canCloseByPressingOutside && (
            <TouchableWithoutFeedback onPress={close}>
              <View style={{ flex: 1 }} />
            </TouchableWithoutFeedback>
          )}

          {/* Modal */}
          <View
            style={[
              styles.modalContent,
              { paddingBottom: insets.bottom },
              modalStyle,
            ]}
          >
            <TouchableOpacity
              onPress={close}
              activeOpacity={0.7}
              hitSlop={10}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color={colors.gray[400]} />
            </TouchableOpacity>

            {/* Illustrator */}
            {illustrator}

            {/* Title */}
            {!!title && (
              <Text style={[styles.modalTitle, titleStyle]}>{title}</Text>
            )}

            {/* Description */}
            {!!description && (
              <Text style={[styles.modalDescription, descriptionStyle]}>
                {description}
              </Text>
            )}

            {children}
          </View>
        </View>

        <AppToast />
      </Modal>
    );
  }
);

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: colors.modal_background,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 8,
    paddingHorizontal: 16,
  },
  closeButton: {
    marginTop: 10,
    marginBottom: 14,
    alignSelf: "flex-end",
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: "600",
    color: colors.gray[900],
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 16,
    fontWeight: "400",
    color: colors.gray[600],
    marginBottom: 32,
    lineHeight: 24,
  },
});
