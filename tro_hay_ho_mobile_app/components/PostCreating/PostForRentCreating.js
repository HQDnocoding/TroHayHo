import { StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { TextInput } from "react-native-paper";
import Modal from "react-native-modal";
import { useState } from "react";



const PostForRentCreating = () => {
    
    const [isModalVisible, setModalVisible] = useState(false);
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    return (
        <View style={styles.container}>
            <View style={{ flex: 5 }}>
                <View style={{ backgroundColor: '#D9D9D9', paddingVertical: 10, paddingStart: 30 }}>
                    <Text style={styles.label}>Tiêu đề, mô tả bài đăng</Text>
                </View>
                <View style={styles.flexRow}>
                    <TextInput style={styles.input} mode="outlined"
                        label={"Tên bài đăng"}
                        outlineColor="#CAC4D0"
                        placeholderTextColor="#CAC4D0"
                        activeOutlineColor="#FFBA00" />
                </View>
                <View style={styles.flexRow}>
                    <TextInput style={styles.input} mode="outlined"
                        outlineColor="#CAC4D0"
                        label={"Diện tích"}
                        placeholderTextColor="#CAC4D0"
                        activeOutlineColor="#FFBA00" />
                </View>
                <View style={{ backgroundColor: '#D9D9D9', paddingVertical: 10, paddingStart: 30 }}>
                    <Text style={styles.label}>Thông tin diện tích, giá cả</Text>
                </View>
                <View style={styles.flexRow}>
                    <TextInput style={styles.input} mode="outlined"
                        outlineColor="#CAC4D0"
                        label={"Số người ở tối đa"}
                        placeholderTextColor="#CAC4D0"
                        activeOutlineColor="#FFBA00" keyboardType="numeric" inputMode="numeric" />
                </View>
                <View style={styles.flexRow}>
                    <TextInput style={styles.input} mode="outlined"
                        outlineColor="#CAC4D0"
                        label={"Mô tả"}
                        placeholderTextColor="#CAC4D0"
                        activeOutlineColor="#FFBA00"></TextInput>
                </View>
                <View style={{ backgroundColor: '#D9D9D9', paddingVertical: 10, paddingStart: 30 }}>
                    <Text style={styles.label}>Địa chỉ</Text>
                </View>
                <TouchableWithoutFeedback onPress={() => { toggleModal() }}>
                    <View style={styles.flexRow}>

                        <TextInput style={styles.input} mode="outlined" outlineColor="#CAC4D0" placeholderTextColor="#CAC4D0"
                            secureTextEntry={true}
                            onPress={() => { }}
                            onFocus={() => { }}
                            editable={false}
                            label={"Địa chỉ"}
                            right={<TextInput.Icon icon={'arrow-right-drop-circle-outline'} onPress={() => { toggleModal() }} />}
                            activeOutlineColor="#FFBA00" ></TextInput>

                    </View>
                </TouchableWithoutFeedback>

            </View>
            <View >
                <Modal isVisible={isModalVisible}
                 onSwipeComplete={() => setModalVisible(false)}
                    onBackdropPress={() => toggleModal()} 
                    onBackButtonPress={() => toggleModal()}
                    coverScreen={true}>
                    <View style={{ flex: 1 }}>
                        <Text>I am the modal content!</Text>
                    </View>
                </Modal>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    flexRow: {
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
        paddingBottom: 10,
        paddingHorizontal: 4,
        paddingTop: 7,
    },
    label: {
        fontWeight: 600,
        fontSize: 17,
    },
    input: {
        marginHorizontal: 10,
        flex: 5,
    }
})

export default PostForRentCreating;