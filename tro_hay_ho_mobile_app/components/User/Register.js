import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { Button, HelperText, RadioButton, TextInput } from "react-native-paper";
import LoginStyles from "../../styles/dat/LoginStyles";
import { Role } from "../../general/General";
import APIs, { endpoints } from "../../configs/APIs";


const Register = ({ navigation }) => {

    const [roles, setRoles] = useState([])
    const loadRole = async () => {
        const roles = await APIs.get(endpoints['roles']);
        setRoles(roles.data);
    }

    useEffect(() => {
        loadRole();
    }, []);

    const [user, setUser] = useState({});

    const users = {
        "first_name": {
            "title": "Tên",
            "field": "first_name",
            "icon": "text",
            "secureTextEntry": false
        },
        "last_name": {
            "title": "Họ và tên lót",
            "field": "last_name",
            "icon": "text",
            "secureTextEntry": false
        },
        "username": {
            "title": "Tên đăng nhập",
            "field": "username",
            "icon": "text",
            "secureTextEntry": false
        }, "password": {
            "title": "Mật khẩu",
            "field": "password",
            "icon": "eye",
            "secureTextEntry": true
        }, "confirm": {
            "title": "Xác nhận mật khẩu",
            "field": "confirm",
            "icon": "eye",
            "secureTextEntry": true
        }
    }

    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(false);
    const [secureTE, setSecureTE] = useState(true);
    const [checked, setChecked] = useState(Role.NGUOI_THUE_TRO);



    const change = (value, field) => {
        setUser({ ...user, [field]: value });
    }


    const register = async () => {
        try {
            print("ok")
            if (user.password !== user.confirm)
                setErr(true);
            else {
                setErr(false);
                let form = new FormData();

                for (let key in user)
                    if (key !== 'confirm') {
                        form.append(key, user[key]);
                    }


                form.append("avatar", "");
                form.append("phone", "");
                console.log("groups", checked);
                form.append("groups", checked);
                console.log(roles)
                // roles.forEach(r => {
                //     if (r.name === checked) {
                //         form.append('groups',r.id)
                //     }
                // })
                console.log(form);

                setLoading(true);
                try {
                    let res = await APIs.post(endpoints['register'], form, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    console.info(res.data)
                    navigation.navigate("login");
                } catch (ex) {
                    console.error(ex);
                } finally {
                    setLoading(false);
                }
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false);
        }

    }


    return (
        <View >
            <Text style={{ fontSize: 20, fontWeight: 800, padding: 15 }}>Đăng ký</Text>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

                <HelperText type="error" visible={err}>
                    Mật khẩu không khớp
                </HelperText>



                <TextInput mode="outlined" key={users['username'].key}
                    outlineColor="#CAC4D0"
                    placeholderTextColor="#CAC4D0"
                    activeOutlineColor="#FFBA00"
                    style={LoginStyles.textInput} placeholder={users['username'].title}
                    value={user['username']} onChangeText={t => change(t, 'username')} />

                <TextInput mode="outlined" key={users['first_name'].key}
                    outlineColor="#CAC4D0"
                    placeholderTextColor="#CAC4D0"
                    activeOutlineColor="#FFBA00"
                    style={LoginStyles.textInput} placeholder={users['first_name'].title}
                    value={user['first_name']} onChangeText={t => change(t, 'first_name')} />

                <TextInput mode="outlined" key={users['last_name'].key}
                    outlineColor="#CAC4D0"
                    placeholderTextColor="#CAC4D0"
                    activeOutlineColor="#FFBA00"
                    style={LoginStyles.textInput} placeholder={users['last_name'].title}
                    value={user['last_name']} onChangeText={t => change(t, 'last_name')} />
                <TextInput mode="outlined" key={users['password'].key}
                    secureTextEntry={true}
                    outlineColor="#CAC4D0"
                    placeholderTextColor="#CAC4D0"
                    activeOutlineColor="#FFBA00"
                    style={LoginStyles.textInput} placeholder={users['password'].title}
                    value={user['password']} onChangeText={t => change(t, 'password')} />

                <TextInput mode="outlined" key={users['confirm'].key}
                    secureTextEntry={secureTE}
                    outlineColor="#CAC4D0"
                    right={<TextInput.Icon icon={users['password'].icon} onPress={() => setSecureTE(!secureTE)} />}
                    placeholderTextColor="#CAC4D0"
                    activeOutlineColor="#FFBA00"
                    style={LoginStyles.textInput} placeholder={users['confirm'].title}
                    value={user['confirm']} onChangeText={t => change(t, 'confirm')} />
                <Text style={{ paddingStart: 10 }}>Bạn sử dụng ứng dụng với vai trò ?:</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', padding: 10 }}>


                    <View style={{ flexDirection: 'column', width: 100 }} >
                        <RadioButton
                            color="#FFC11A"
                            value={Role.NGUOI_THUE_TRO}
                            status={checked === Role.NGUOI_THUE_TRO ? 'checked' : 'unchecked'}
                            onPress={() => setChecked(Role.NGUOI_THUE_TRO)}
                        />
                        <Text>Người thuê trọ</Text>
                    </View>

                    <View style={{ flexDirection: 'column', width: 100 }} >
                        <RadioButton
                            color="#FFC11A"
                            value={Role.CHU_TRO}
                            status={checked === Role.CHU_TRO ? 'checked' : 'unchecked'}
                            onPress={() => setChecked(Role.CHU_TRO)}
                        />
                        <Text>Chủ trọ</Text>
                    </View>
                </View>
                <Button style={{ margin: 15, borderRadius: 5, backgroundColor: '#FFBA00' }} loading={loading} mode="contained" onPress={register}>ĐĂNG KÝ</Button>
            </KeyboardAvoidingView>
        </View>
    )
}







export default Register;