import { useContext, useState } from "react"
import { MyUserContext } from "../../configs/UserContexts"
import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native"
import AccountSettingDetailStyle from "../../styles/dat/AccountSettingDetailStyle"
import { Switch, TextInput } from "react-native-paper"
import { TouchableOpacity } from "react-native"



const AccountSettingDetail = () => {
    const user = useContext(MyUserContext)
    const [isSwitchOn, setIsSwitchOn] = useState(false);
    const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

    return (
        <ScrollView style={AccountSettingDetailStyle.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={AccountSettingDetailStyle.section}>
                <Text style={{ fontSize: 18, fontWeight: 700 }}>Thông tin cá nhân</Text>
                <Text style={AccountSettingDetailStyle.labelInput}>Tên</Text>
                <TextInput mode="outlined" outlineColor="#CAC4D0" placeholderTextColor="#CAC4D0"
                    activeOutlineColor="#FFBA00" >{user.first_name}</TextInput>
                <Text style={AccountSettingDetailStyle.labelInput}>Họ và chữ lót</Text>
                <TextInput mode="outlined" outlineColor="#CAC4D0" placeholderTextColor="#CAC4D0"
                    activeOutlineColor="#FFBA00" >{user.last_name}</TextInput>
                <Text style={AccountSettingDetailStyle.labelInput}>Email</Text>
                <TextInput mode="outlined" outlineColor="#CAC4D0" placeholderTextColor="#CAC4D0"
                    activeOutlineColor="#FFBA00" >{user.email}</TextInput>
                <Text style={AccountSettingDetailStyle.labelInput}>Số điện thoại</Text>
                <TextInput mode="outlined" outlineColor="#CAC4D0" placeholderTextColor="#CAC4D0"
                    activeOutlineColor="#FFBA00" >{user.phone}</TextInput>
                <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
                    <Text style={{ lineHeight: 76 }}>Cho phép người khác liên lạc qua điện thoại</Text>
                    <Switch style={{ lineHeight: 76 }} value={isSwitchOn} onValueChange={onToggleSwitch} color="#FFBA00" />
                </View>
            </KeyboardAvoidingView>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={AccountSettingDetailStyle.section}>
                <Text style={{ fontSize: 18, fontWeight: 700 }}>Cài đặt tài khoản</Text>
                <Text style={AccountSettingDetailStyle.labelInput}>Mật khẩu</Text>
                <TextInput mode="outlined" outlineColor="#CAC4D0" placeholderTextColor="#CAC4D0"
                    secureTextEntry={true}
                    right={<TextInput.Icon icon={'arrow-right-drop-circle-outline'} />}
                    activeOutlineColor="#FFBA00" >{user.password}</TextInput>
                <Text style={AccountSettingDetailStyle.labelInput}>Liên kết tài khoản</Text>

                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderRadius: 4, backgroundColor: 'white' }}>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', lineHeight: 50, padding: 10 }}>
                        <Image style={{ width: 30, height: 30 }} source={require('../../assets/google-logo.png')} resizeMode="contain" />
                        <Text style={AccountSettingDetailStyle.labelInput}>Google</Text>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', lineHeight: 50, padding: 10 }}>
                        <TouchableOpacity>
                            <Text style={AccountSettingDetailStyle.connect}>Kết nối</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </KeyboardAvoidingView>
            <View style={AccountSettingDetailStyle.section}>
            <Text style={{ fontSize: 18, fontWeight: 700 }}>Khác</Text>

                <View style={{ alignItems: 'center', borderWidth: 1.5,borderColor:'#F8F4F4', borderRadius: 4, backgroundColor: 'gold', padding: 10 }}>

                    <TouchableOpacity>
                        <Text style={{ color: 'red', fontWeight: 800, fontSize: 15 }}>Yêu cầu xóa tài khoản</Text>
                    </TouchableOpacity>
                </View>
            </View>


        </ScrollView>
    )
}

export default AccountSettingDetail;