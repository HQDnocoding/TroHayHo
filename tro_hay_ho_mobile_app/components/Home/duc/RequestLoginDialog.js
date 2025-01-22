import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, StyleSheet } from "react-native";
import { Modal, Text, Button } from "react-native-paper";

const RequestLoginDialog = ({ visible, onClose }) => {
    const nav = useNavigation()

    const handleSave = () => {

        onClose();
    };

    return (
        <Modal
            visible={visible}
            onDismiss={onClose}
            contentContainerStyle={styles.modalContainer}
            theme={{ colors: { backdrop: "rgba(0, 0, 0, 0.5)" } }}
        >
            <View style={styles.container}>
                <Text style={styles.title}>Hãy Đăng nhập</Text>
                <View style={styles.buttonContainer}>
                    <Button mode="contained" onPress={()=>nav.navigate('login')} style={styles.loginButton} labelStyle={styles.font}>
                        Đăng nhập
                    </Button>
                    <Button mode="contained" onPress={handleSave} style={styles.backButton} labelStyle={styles.font}>
                        Trở về
                    </Button>
                </View>
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
        height: '30%',
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center', // Căn giữa theo chiều dọc
        alignItems: 'center', // Căn giữa theo chiều ngang

    },
    title: {
        fontSize: 20, // Kích thước chữ lớn hơn
        fontWeight: 'bold', // Chữ đậm
        marginBottom: 20, // Khoảng cách dưới tiêu đề
        color: '#333', // Màu chữ tối
    },
    buttonContainer: {
        fontSize:20,
        flexDirection: 'row',
        justifyContent: 'space-around', // Căn giữa các nút
        width: '100%', // Đảm bảo chiều rộng đầy đủ
    },
    loginButton: {
        backgroundColor: 'red',
        marginHorizontal: 10, // Khoảng cách giữa các nút
        width: '40%', // Chiều rộng nút
    },
    backButton: {
       
        backgroundColor: 'green',
        marginHorizontal: 10, // Khoảng cách giữa các nút
        width: '40%', // Chiều rộng nút
    },
    font:{
        fontSize:12
    }
});

export default RequestLoginDialog;
