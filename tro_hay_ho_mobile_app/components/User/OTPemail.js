


import { useEffect, useState } from "react";
import { Alert, View } from "react-native";
import { Button, Dialog, Portal, TextInput } from "react-native-paper";
import { verifyOTP } from "../../utils/FireBaseAuth";
import APIs, { authAPIs, endpoints } from "../../configs/APIs";
import AsyncStorage from "@react-native-async-storage/async-storage";


const OTPmail = ({ isVisible, setVisible, email, token }) => {

    const [otp, setOtp] = useState('');
    const verify = async () => {

        const formData = new FormData();
        formData.append('email', email);
        formData.append('otp', otp);

        try {
            const res = await authAPIs(token).post(endpoints['verify-otp-email'], formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },

                }
            )
            if (res.status === 200) {
                Alert.alert("", "Xác thực thành công!");
                hideDialog();
            } else {
                Alert.alert("", "Xác thực thất bại!");
            }

        } catch (e) {
            console.error(e);
        } finally {
            // hideDialog();
            setOtp(null);
        }
    }

    const hideDialog = () => { setVisible(false); setOtp(null) }


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


export default OTPmail;