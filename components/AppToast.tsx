import { colors } from "@/utils/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface AppToastRef {
  show: () => void;
  hide: () => void;
}

const ToastRoot = forwardRef<AppToastRef, unknown>((_props, ref) => {
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState(false);

  // memoized callbacks để không tạo hàm mới mỗi render
  const show = useCallback(() => setVisible(true), []);
  const hide = useCallback(() => setVisible(false), []);

  /*
   * Đảm bảo mỗi lần re-render,
   * ref sẽ không bị gán bằng null, và sau đó sẽ là một new { show, hide }
   */
  useImperativeHandle(
    ref,
    () => ({
      show,
      hide,
    }),
    [show, hide]
  );

  /* Nếu bỏ deps[] đi
   * useImperativeHandle(
   *   ref,
   *   () => ({
   *     show,
   *     hide,
   *   }),
   * );
   * Thì mỗi lần re-render, React hiểu rằng { show, hide } là một object mới, nên sẽ:
   * 1. Gán ref = null trước
   * 2. Sau đó gán ref = object { show, hide } mới đó
   * Tương ứng nó sẽ trigger hàm setRef 2 lần
   *
   * Kiểm tra:
   * Thử bỏ useCallback() và theo dõi
   * console.log("setRef is called, ref = ", ref);
   */

  return (
    <View style={{ ...StyleSheet.absoluteFillObject }} pointerEvents="box-none">
      {visible && (
        <View style={styles.modalContainer}>
          <View style={[styles.toastContainer, { marginTop: insets.top }]}>
            <TouchableOpacity
              onPress={() => setVisible(false)}
              style={{ alignSelf: "flex-end", marginBottom: 4 }}
            >
              <Ionicons name="close" size={24} color={colors.gray[400]} />
            </TouchableOpacity>

            <Text style={{ color: colors.gray[600] }}>
              Username or password is invalid, or your account is not authorized
              for access.
            </Text>
          </View>
        </View>
      )}
    </View>
  );
});

let refs: AppToastRef[] = [];

function addNewRef(newRef: AppToastRef) {
  refs.push(newRef);
}

function removeLastRef() {
  refs.pop();
}

const AppToast = () => {
  /*
   * Trường hợp:
   * <AppToast/> nằm trong <Modal/>
   * Khi <Modal/> re-render => AppToast re-render
   *   + Nếu setRef không được bọc trong useCallback
   *     -> setRef được tạo lại mỗi lần re-render,
   *        mà ref trong useImperativeHandlecủa ToastRoot nhận giá trị của setRef
   *     -> useImperativeHandle sẽ hiểu rằng ref là một giá trị hoàn toàn mới (vì setRef dã được tạo mới)
   *     -> Ban đầu ref sẽ bằng null và hàm setRef(ref: AppToastRef | null) sẽ nhận giá trị tham số ref = null
   *        Sau đó ref = { show, hide } và setRef(ref: AppToastRef | null) sẽ nhận giá trị tham số ref = { show, hide }
   *   + Nếu setRef nằm trong useCallback
   *     -> setRef không được tạo lại mỗi lần re-render
   *     -> useImperativeHandle của ToastRoot hiểu rằng ref không đổi
   *
   * Kiểm tra:
   * Thử bỏ useCallback() và theo dõi
   * console.log("setRef is called, ref = ", ref);
   */
  const setRef = useCallback((ref: AppToastRef | null) => {
    // Since we know there's a ref, we'll update `refs` to use it.
    console.log("setRef is called, ref = ", ref);
    if (ref) {
      /* Khi tham số ref === null
       * tức là <AppToast /> chứa ref này đã mount
       * Ta thêm ref vào Stack refs
       */
      addNewRef(ref);
    } else {
      /* Khi tham số ref === null
       * tức là <AppToast /> chứa ref này đã unmount
       * Ta xoá ref này khỏi Stack refs
       */
      removeLastRef();
    }
  }, []);

  return <ToastRoot ref={setRef} />;
};

AppToast.showRefs = () => {
  console.log(refs);
};

AppToast.show = () => {
  // Dùng last ref trong stack để show toast
  refs.at(-1)?.show();
};
AppToast.hide = () => {
  refs.at(-1)?.hide();
};

export default AppToast;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 20,
  },
  toastContainer: {
    backgroundColor: colors.success[50],
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.gray[300],
  },
});
