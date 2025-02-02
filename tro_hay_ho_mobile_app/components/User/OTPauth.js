import { useEffect, useState } from "react";
import { Alert, View } from "react-native";
import { Button, Dialog, Portal, TextInput } from "react-native-paper";
import { verifyOTP } from "../../utils/FireBaseAuth";
import APIs, { authAPIs, endpoints } from "../../configs/APIs";
import AsyncStorage from "@react-native-async-storage/async-storage";


const OTPauth = ({ isVisible, setVisible, phone, token }) => {

    const [otp, setOtp] = useState('');
    // const [enable, setEnable] = useState(false);
    //twilio
    const verify = async () => {


        const formData = new FormData();
        formData.append("phone_number", phone);
        formData.append("otp_code", otp);

        try {
            const res = await authAPIs(token).post(endpoints['verify-otp'], formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },

                }
            )
            if (res.status===200) {
                Alert.alert("", "Xác thực thành công!");
            } else {
                Alert.alert("", "Xác thực thất bại!");
            }

        } catch (e) {
            console.error(e);
        } finally {
            hideDialog();
            setOtp(null);
        }
    }


    const hideDialog = () => { setVisible(false); setOtp(null) }

    // const handleVerifyOTP = async () => {

    //     try {
    //         const user = await verifyOTP(confirmation, otp);
    //         if (user) {
    //             const idToken = await user.getIdToken(); // Lấy Firebase Token
    //             onVerified(phone, idToken); // Gửi số điện thoại và token lên Django
    //         } else {
    //             Alert.alert("OTP không hợp lệ, vui lòng thử lại.");
    //         }
    //     } catch (ex) {
    //         console.error(ex);
    //     } finally {
    //         hideDialog();
    //         setOtp('');
    //     }

    // };

    return (
        <View>
            <Portal>
                <Dialog visible={isVisible} onDismiss={hideDialog}>
                    <Dialog.Title>Nhập mã OTP</Dialog.Title>
                    <Dialog.Content>
                        <TextInput
                            label="OTP"
                            style={{}}
                            mode="outlined"
                            value={otp}

                            onChangeText={setOtp}
                            keyboardType="number-pad"
                            maxLength={6}

                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={hideDialog}>Hủy</Button>
                        <Button onPress={verify} disabled={otp?.length !== 6}>
                            Xác nhận
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
}


export default OTPauth;