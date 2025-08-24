import AppToast from "@/components/AppToast";
import { BlankModal, BlankModalRef } from "@/components/BlankModal";
import React, { useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const modalRef = useRef<BlankModalRef>(null);

  const [count, setCount] = useState(0);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 20,
      }}
    >
      <TouchableOpacity
        style={styles.button}
        onPress={() => AppToast.showRefs()}
      >
        <Text style={styles.text}>Show Stack Refs</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => AppToast.show()}>
        <Text style={styles.text}>Show Toast</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => modalRef.current?.open()}
      >
        <Text style={styles.text}>Show Modal</Text>
      </TouchableOpacity>

      <BlankModal
        ref={modalRef}
        title={"Interested in becoming a SIX Storekeeper?"}
        description={
          "If you want to join SIX as a storekeeper, get in touch with us and our team will guide you through the next steps"
        }
        canCloseByPressingOutside
      >
        <Text style={{ marginBottom: 10 }}>Count: ${count}</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setCount(count + 1)}
        >
          <Text style={styles.text}>Increase</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => AppToast.showRefs()}
        >
          <Text style={styles.text}>Show Stack Refs</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => AppToast.show()}>
          <Text style={styles.text}>Show Toast</Text>
        </TouchableOpacity>
      </BlankModal>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#DD2636",
    height: 44,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
