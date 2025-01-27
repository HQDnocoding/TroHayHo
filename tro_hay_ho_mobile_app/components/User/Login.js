import { useContext, useEffect, useState } from "react";
import { MyDispatchContext } from "../../configs/UserContexts";
import { Image, KeyboardAvoidingView, Platform, TouchableOpacity, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import APIs, { authAPIs, endpoints } from "../../configs/APIs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import LoginStyles from "../../styles/dat/LoginStyles";

const Login = () => {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const [secureTE, setSecureTE] = useState(true);
    const dispatch = useContext(MyDispatchContext);
    const nav = useNavigation();



    const updateUser = (value, field) => {
        setUser({ ...user, [field]: value });
    };



    // **Xử lý đăng nhập bình thường**
    const login = async () => {
        setLoading(true);
        try {
            const res = await APIs.post(endpoints["login"],{
                "grant_type":"password",
                "client_id":"0R6hMr4Zhgl9LeXoWrxDNSTkLgpZymmtLJeINUFN",
                "client_secret":"AG1n41T3umckBclAVuc97nNwW0YJTqxpDUanvjS2yju0kxLpwSp88FtuOZesCxm2jmPhwREN2wpHHq8xdztMEsBDUYGWaMnDPDS6vLG7o851KmYvrESeBeI8sGvYzsgw",
                "username":user.username,
                "password":user.password
            });

            await AsyncStorage.setItem("access_token", res.data.access_token);
            await AsyncStorage.setItem("refresh_token", res.data.refresh_token);

            // Lấy thông tin người dùng
            const token = res.data.access_token;
            const userInfo = await authAPIs(token).get(endpoints["current-user"]);

            // Lưu vào context
            dispatch({ type: "login", payload: userInfo.data });

            // Điều hướng về màn hình chính
            nav.navigate("bottom-tabs");
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
    };

    // **Xử lý Google Sign-In**
    const signInGoogle = async () => {
        setLoading(true);
        try {
            // Kiểm tra Google Play Services
            await GoogleSignin.hasPlayServices();

            // Đăng nhập với Google
            const userInfo = await GoogleSignin.signIn();
            const response = await APIs.post(endpoints["google-login"], {
                token: userInfo.data.idToken,
            });


            await AsyncStorage.setItem("access_token", response.data.access_token);
            // await AsyncStorage.setItem("refresh_token", response.data.refresh_token);

            // Lấy thông tin người dùng
            const token = response.data.access_token;
            const user = await authAPIs(token).get(endpoints["current-user"]);

            // Lưu vào context
            dispatch({ type: "login", payload: user.data });

            // Điều hướng về màn hình chính
            nav.navigate("bottom-tabs");
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
    };

    const users = {
        username: {
            title: "Tên đăng nhập",
            field: "username",
            secure: false,
            icon: "text",
        },
        password: {
            title: "Mật khẩu",
            field: "password",
            secure: true,
            icon: "eye",
        },
    };

    const signOut = async () => {
        try {
            await GoogleSignin.signOut();
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        signOut();
    }, [])

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <Text style={{ fontSize: 20, fontWeight: "800", padding: 15 }}>Đăng nhập</Text>

            {/* Nhập tài khoản */}
            <TextInput
                mode="outlined"
                outlineColor="#CAC4D0"
                placeholderTextColor="#CAC4D0"
                activeOutlineColor="#FFBA00"
                style={LoginStyles.textInput}
                placeholder={users["username"].title}
                value={user["username"]}
                onChangeText={(t) => updateUser(t, "username")}
            />
            <TextInput
                mode="outlined"
                outlineColor="#CAC4D0"
                placeholderTextColor="#CAC4D0"
                activeOutlineColor="#FFBA00"
                secureTextEntry={secureTE}
                right={<TextInput.Icon icon={users["password"].icon} onPress={() => setSecureTE(!secureTE)} />}
                style={LoginStyles.textInput}
                placeholder={users["password"].title}
                value={user["password"]}
                onChangeText={(t) => updateUser(t, "password")}
            />

            {/* Quên mật khẩu */}
            <TouchableOpacity onPress={() => { }}>
                <Text style={{ color: "blue", paddingStart: 15 }}>Quên mật khẩu</Text>
            </TouchableOpacity>

            {/* Nút đăng nhập */}
            <Button
                onPress={login}
                loading={loading}
                style={{ margin: 15, borderRadius: 5, backgroundColor: "#FFBA00" }}
                mode="contained"
            >
                <Text style={{ fontSize: 18, fontWeight: "800", color: "white" }}>Đăng nhập</Text>
            </Button>

            {/* Đăng nhập bằng Google */}
            <View style={LoginStyles.containerOtherLogin}>
                <View style={LoginStyles.containerLine}>
                    <View style={LoginStyles.line} />
                    <TouchableOpacity>
                        <Text style={{ marginHorizontal: 4 }}>Hoặc đăng nhập bằng</Text>
                    </TouchableOpacity>
                    <View style={LoginStyles.line} />
                </View>
                <TouchableOpacity onPress={signInGoogle}>
                    <Image
                        style={{ width: 80, height: 80 }}
                        source={require("../../assets/google-logo.png")}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>

            {/* Đăng ký tài khoản mới */}
            <View style={LoginStyles.containerLine}>
                <Text>Chưa có tài khoản</Text>
                <TouchableOpacity onPress={() => nav.navigate("register")}>
                    <Text style={{ marginStart: 10, color: "blue" }}>Đăng ký tài khoản mới</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

export default Login;
