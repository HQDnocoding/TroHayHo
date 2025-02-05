import { useEffect, useState } from "react";
import { Alert, View } from "react-native";
import { Button, Dialog, Portal, TextInput } from "react-native-paper"
import APIs, { authAPIs, endpoints } from "../../configs/APIs";



const ChangePassWord = ({ isVisible, setIsVisible, token }) => {

    const [enable, setEnable] = useState(false);
    const [oldPw, setOldPw] = useState('');
    const [newPw, setNewPw] = useState('');
    const [newPwConfirming, setNewPwConfirming] = useState('');

    const hideDialog = () => {
        setIsVisible(false);
        reset();
    }

    const reset = () => {
        setOldPw('');
        setNewPw('');
        setNewPwConfirming('');
    }

    const handelChangePw = async () => {

        const form = new FormData()

        form.append("old_password", oldPw);
        form.append("new_password", newPw);
        form.append("confirm_password", newPwConfirming);


        try {
            const res = await authAPIs(token).post(endpoints['change-password'], form,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            )

            if (res.status === 200) {
                Alert.alert("", "Thay đổi mật khẩu thành công");
            } else {
                Alert.alert("", "Đổi mật khẩu không thành công");
            }
        }
        catch (e) {
            console.log(e);
        } finally {
            hideDialog();
        }
    }

    useEffect(() => {
        if (oldPw === '' || newPw === '' || newPwConfirming === '' || newPw == newPwConfirming) {
            setEnable(false)
        } else setEnable(true);
    }, [oldPw, newPw, newPwConfirming]);


    return (
        <View>
            <Portal>
                <Dialog visible={isVisible} onDismiss={hideDialog}>
                    <Dialog.Title >Đổi mật khẩu</Dialog.Title>
                    <Dialog.Content>
                        <TextInput label="Mật khẩu cũ"
                            style={{}}
                            onChangeText={setOldPw}
                            mode='outlined'
                            secureTextEntry={true}
                        />
                    </Dialog.Content>
                    <Dialog.Content>
                        <TextInput label="Mật khẩu mới"
                            style={{}}
                            onChangeText={setNewPw}
                            mode='outlined'
                            secureTextEntry={true}
                        />
                    </Dialog.Content>
                    <Dialog.Content>
                        <TextInput label="Xác nhận mật khẩu mới"
                            style={{}}
                            secureTextEntry={true}
                            onChangeText={setNewPwConfirming}
                            mode='outlined'
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={hideDialog}>Hủy</Button>
                        <Button onPress={handelChangePw} disabled={enable}>Xác nhận
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    )
}

export default ChangePassWord;