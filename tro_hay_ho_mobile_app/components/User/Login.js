import { useContext, useState } from "react";
import { MyDispatchContext } from "../../configs/UserContexts";
import { Image, KeyboardAvoidingView, Platform, TouchableOpacity, View } from "react-native";
import { Button, IconButton, Text, TextInput } from "react-native-paper";
import APIs, { authAPIs, endpoints } from "../../configs/APIs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TextInputStyles from "../../styles/dat/TextInputStyles";
import { styles } from "react-native-image-slider-banner/src/style";
import LoginStyles from "../../styles/dat/LoginStyles";
import { useNavigation } from "@react-navigation/native";




const Login = () => {

    const nav = useNavigation();


    const [user, setUser] = useState({
    });
    const [loading, setLoading] = useState(false)

    const users = {
        "username": {
            "title": "Tên đăng nhập",
            "field": "username",
            "secure": false,
            "icon": "text"
        }, "password": {
            "title": "Mật khẩu",
            "field": "password",
            "secure": true,
            "icon": "eye"
        }
    }

    const dispatch = useContext(MyDispatchContext);


    const updateUser = (value, field) => {
        setUser({ ...user, [field]: value });
    }

    const login = async () => {
        setLoading(true);
        try {
            const res = await APIs.post(endpoints['login'], {
                "client_id": "0R6hMr4Zhgl9LeXoWrxDNSTkLgpZymmtLJeINUFN",
                "client_secret": "AG1n41T3umckBclAVuc97nNwW0YJTqxpDUanvjS2yju0kxLpwSp88FtuOZesCxm2jmPhwREN2wpHHq8xdztMEsBDUYGWaMnDPDS6vLG7o851KmYvrESeBeI8sGvYzsgw",
                "grant_type": "password",
                ...user
            });

            console.info(res.data.access_token)
            await AsyncStorage.setItem('token', res.data.access_token);

            setTimeout(async () => {
                try {
                    const token = await AsyncStorage.getItem("token");
                    console.info(token);
                    let user = await authAPIs(token).get(endpoints['current-user']);

                    console.info(user.data);

                    dispatch({ "type": "login", "payload": user.data });
                    nav.navigate('bottom-tabs');
                } catch (e) {
                    console.error(e);
                }

            }, 100);



        } catch (e) {
            if (e.response) {
                console.log("Status:", e.response.status);
                console.log("Data:", e.response.data);
            } else {
                console.error("Error Message:", e.message);
            }
        } finally {
            setLoading(false);
        }
    }
    const [secureTE, setSecureTE] = useState(true);
    return (
        <KeyboardAvoidingView

            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
            <Text style={{ fontSize: 20, fontWeight: 800, padding: 15 }}>Đăng nhập</Text>

            <TextInput mode="outlined" key={users['username'].key}
                outlineColor="#CAC4D0"
                placeholderTextColor="#CAC4D0"
                activeOutlineColor="#FFBA00"
                style={LoginStyles.textInput} placeholder={users['username'].title}
                value={user['username']} onChangeText={t => updateUser(t, 'username')} />
            <TextInput key={users['password'].key}
                mode="outlined"
                outlineColor="#CAC4D0"
                placeholderTextColor="#CAC4D0"
                activeOutlineColor="#FFBA00"
                secureTextEntry={secureTE} right={<TextInput.Icon icon={users['password'].icon} onPress={() => setSecureTE(!secureTE)} />}
                style={LoginStyles.textInput} placeholder={users['password'].title}
                value={user['password']} onChangeText={t => updateUser(t, 'password')} />
            <TouchableOpacity onPress={() => { }}>
                <Text style={{ color: 'blue', paddingStart: 15, }}>Quên mật khẩu</Text>
            </TouchableOpacity>

            <Button onPress={login} loading={loading} style={{ margin: 15, borderRadius: 5, backgroundColor: '#FFBA00' }}
                mode="contained"><Text style={{ fontSize: 18, fontWeight: 800, color: 'white' }}>Đăng nhập</Text></Button>

            <View style={LoginStyles.containerOtherLogin}>
                <View style={LoginStyles.containerLine}>
                    <View style={LoginStyles.line} />
                    <TouchableOpacity>
                        <Text style={{ marginHorizontal: 4 }}>Hoặc đăng nhập bằng</Text>
                    </TouchableOpacity>
                    <View style={LoginStyles.line} />
                </View>
                <TouchableOpacity>
                    <Image style={{ width: 80, height: 80 }} source={require('../../assets/google-logo.png')} resizeMode="contain" />
                </TouchableOpacity>
            </View>

            <View style={LoginStyles.containerLine}>
                <Text>Chưa có tài khoản</Text>
                <TouchableOpacity onPress={() => nav.navigate('register')}>
                    <Text style={{ marginStart: 10, color: 'blue' }}>Đăng ký tài khoản mới</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );

}



export default Login;