import React from "react";
import { View, StyleSheet } from "react-native";
import { Modal, TextInput, Button } from "react-native-paper";

const AddressDialog = ({ visible, onClose }) => {
  const [input1, setInput1] = React.useState("");
  const [input2, setInput2] = React.useState("");
  const [input3, setInput3] = React.useState("");

  const handleSave = () => {
    console.log("Input 1:", input1);
    console.log("Input 2:", input2);
    console.log("Input 3:", input3);
    onClose(); // Đóng hộp thoại sau khi lưu
  };

  return (
    <Modal
      visible={visible}
      onDismiss={onClose}
      contentContainerStyle={styles.modalContainer}
      theme={{ colors: { backdrop: "rgba(0, 0, 0, 0.5)" } }} // Hiển thị nền mờ
    >
      <View>
        <TextInput
          label="Địa chỉ 1"
          value={input1}
          onChangeText={setInput1}
          style={styles.input}
        />
        <TextInput
          label="Địa chỉ 2"
          value={input2}
          onChangeText={setInput2}
          style={styles.input}
        />
        <TextInput
          label="Địa chỉ 3"
          value={input3}
          onChangeText={setInput3}
          style={styles.input}
        />
        <Button mode="contained" onPress={handleSave} style={styles.button}>
          Lưu
        </Button>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 8,
  },
  input: {
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  button: {
    marginTop: 10,
  },
});

export default AddressDialog;
