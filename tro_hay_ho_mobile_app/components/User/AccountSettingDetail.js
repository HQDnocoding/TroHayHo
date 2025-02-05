import { useContext, useEffect, useState } from "react"
import { MyUserContext } from "../../configs/UserContexts"
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native"
import AccountSettingDetailStyle from "../../styles/dat/AccountSettingDetailStyle"
import { Button, Switch, TextInput } from "react-native-paper"
import { TouchableOpacity } from "react-native"
import { sendOTP, verifyOTP } from "../../utils/FireBaseAuth"
import OTPauth from "./OTPauth"
import APIs, { authAPIs, endpoints } from "../../configs/APIs"
import AsyncStorage from "@react-native-async-storage/async-storage"
import ChangePassWord from "./ChangePassword"
import OTPmail from "./OTPemail"
import { formatPhoneNumber } from "../../utils/Formatter"



const AccountSettingDetail = () => {
    const user = useContext(MyUserContext)
    const [isSwitchOn, setIsSwitchOn] = useState(false);
    const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
    const [visibleDialog, setVisibleDialog] = useState(false);
    const [visibleEmailDialog, setVisibleEmailDialog] = useState(false);
    const [visibleChangePW, setVisibleChangePw] = useState(false);
    const [email, setEmail] = useState(user.email !== null ? user.email : '');
    const [isChangeEmail, setIsChangeEmail] = useState(true);
    const [phone, setPhone] = useState(user.phone !== null ? user.phone : '');
    const [isChanged, setIsChanged] = useState(true);


    const [token, setToken] = useState();


    const loadToken = async () => {
        const tk = await AsyncStorage.getItem("access_token");
        setToken(tk);
    }

    useEffect(() => {
        loadToken();
    }, []);

    const handleChange = (text) => {
        setPhone(text);
        if (user.phone !== null)
            setIsChanged(text === user.phone);
        else setIsChanged(true);
    }
    const handleEmailChange = (email) => {
        setEmail(email)
        if (user.email !== null)
            setIsChangeEmail(email === user.email);
        else setIsChanged(true);
    }

    const handlePressSaveMail = () => {
        setVisibleEmailDialog(true);
        checkMail();
    }



    const checkMail = async () => {
        const formData = new FormData();
        formData.append('email', email);
        try {
            const res = await authAPIs(token).post(endpoints['check-email'], formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                }
            )
            if (res.status === 400) {
                Alert.alert("", res.data.error);
            } else {

            }
        } catch (ex) {
            console.error(ex);
        }

    }

    //twilio
    const sendOTP = async () => {
        try {
            console.log("send");
            const formData = new FormData();
            formData.append("phone_number", formatPhoneNumber(phone));
            console.log(formData);
            const res = await APIs.post(endpoints['send-otp'], formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                })

        } catch (e) {
            console.error(e);
        }
    }

    const handleOnPressSave = () => {
        setVisibleDialog(true);
    }
    const handlePressPwDialog = () => {
        setVisibleChangePw(true);
    }

    return (
        <ScrollView style={AccountSettingDetailStyle.container}>
            <ChangePassWord isVisible={visibleChangePW} setIsVisible={setVisibleChangePw} token={token} />
            <OTPmail isVisible={visibleEmailDialog} setVisible={setVisibleEmailDialog} token={token} email={email} />
            <OTPauth isVisible={visibleDialog} setVisible={setVisibleDialog} phone={formatPhoneNumber(phone)} token={token} />
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={AccountSettingDetailStyle.section}>
                <Text style={{ fontSize: 18, fontWeight: 700 }}>Thông tin cá nhân</Text>
                <Text style={AccountSettingDetailStyle.labelInput}>Tên</Text>
                <TextInput disabled={true}  mode="outlined" outlineColor="#CAC4D0" placeholderTextColor="#CAC4D0"
                    activeOutlineColor="#FFBA00" >{user.first_name}</TextInput>
                <Text style={AccountSettingDetailStyle.labelInput}>Họ và chữ lót</Text>
                <TextInput disabled={true}  mode="outlined" outlineColor="#CAC4D0" placeholderTextColor="#CAC4D0"
                    activeOutlineColor="#FFBA00" >{user.last_name}</TextInput>
                <Text style={AccountSettingDetailStyle.labelInput}>Email</Text>
                <TextInput mode="outlined" outlineColor="#CAC4D0" placeholderTextColor="#CAC4D0"
                    activeOutlineColor="#FFBA00"
                    value={email ? email : ''}

                    onChangeText={handleEmailChange}
                    right={<TextInput.Icon disabled={isChangeEmail} icon={"content-save"} onPress={() => {
                        handlePressSaveMail();
                    }} />}></TextInput>
                <Text style={AccountSettingDetailStyle.labelInput}>Số điện thoại</Text>
                <TextInput mode="outlined" outlineColor="#CAC4D0" placeholderTextColor="#CAC4D0"
                    activeOutlineColor="#FFBA00"
                    onChangeText={handleChange}
                    value={phone ? phone : ''}
                    right={<TextInput.Icon disabled={isChanged} icon={"content-save"} onPress={() => {
                        handleOnPressSave();
                        sendOTP();
                    }} />}></TextInput>
                <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
                    <Text style={{ lineHeight: 76 }}>Cho phép người khác liên lạc qua điện thoại</Text>
                    <Switch style={{ lineHeight: 76 }} value={isSwitchOn} onValueChange={onToggleSwitch} color="#FFBA00" />
                </View>
            </KeyboardAvoidingView>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={AccountSettingDetailStyle.section}>
                <Text style={{ fontSize: 18, fontWeight: 700 }}>Cài đặt tài khoản</Text>
                <Text style={AccountSettingDetailStyle.labelInput}>Mật khẩu</Text>
                <TouchableOpacity onPress={() => { handlePressPwDialog() }} activeOpacity={0.7}>
                    <TextInput mode="outlined" outlineColor="#CAC4D0" placeholderTextColor="#CAC4D0"
                        secureTextEntry={true}
                        editable={false}
                        right={<TextInput.Icon icon={'arrow-right-drop-circle-outline'} onPress={() => { handlePressPwDialog }} />}
                        activeOutlineColor="#FFBA00" >******************</TextInput>
                </TouchableOpacity>
            </KeyboardAvoidingView>
            <View style={AccountSettingDetailStyle.section}>
                <Text style={{ fontSize: 18, fontWeight: 700 }}>Khác</Text>

                <View style={{ alignItems: 'center', borderWidth: 1.5, borderColor: '#F8F4F4', borderRadius: 4, backgroundColor: 'gold', padding: 10 }}>

                    <TouchableOpacity>
                        <Text style={{ color: 'red', fontWeight: 800, fontSize: 15 }}>Yêu cầu xóa tài khoản</Text>
                    </TouchableOpacity>
                </View>
            </View>


        </ScrollView>
    )
}

export default AccountSettingDetail;    