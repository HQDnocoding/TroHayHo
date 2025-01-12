import { useContext, useState } from "react";
import { MyDispatchContext } from "../../configs/UserContexts";
import { KeyboardAvoidingView, Platform } from "react-native";
import { Button, TextInput } from "react-native-paper";
import APIs, { authAPIs, endpoints } from "../../configs/APIs";
import AsyncStorage from "@react-native-async-storage/async-storage";




const Login = ({navigation}) => {

   

    const [user, setUser] = useState({
        "username": "",
        "password": ""
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
        try {

            console.log("Request payload:", {
                "client_id": "...",
                "client_secret": "...",
                "grant_type": "password",
                ...user,
            });
            console.log("Endpoint:", endpoints['login']);

            setLoading(true);



            const res = await APIs.post(endpoints['login'], {
                "client_id": "0R6hMr4Zhgl9LeXoWrxDNSTkLgpZymmtLJeINUFN",
                "client_secret": "AG1n41T3umckBclAVuc97nNwW0YJTqxpDUanvjS2yju0kxLpwSp88FtuOZesCxm2jmPhwREN2wpHHq8xdztMEsBDUYGWaMnDPDS6vLG7o851KmYvrESeBeI8sGvYzsgw",
                "grant_type": "password",
                ...user
            });

            console.info(res.data.access_token)
            await AsyncStorage.setItem('token', res.data.access_token);

            setTimeout(async () => {
                const token = await AsyncStorage.getItem("token");
                console.info(token);
                user = await authAPIs(token).get(endpoints['current-user']);

                console.info(user.data);

                dispatch({ "type": "login", "payload": { "username": user.username } });
            }, 500);

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
    
    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
            {Object.values(users).map(u => <TextInput right={<TextInput.Icon icon={u.icon} />} key={u.field}
                secureTextEntry={u.secure} style={{ margin: 15, }} placeholder={u.title}
                value={user[u.field]} onChangeText={t => updateUser(t, u.field)} />)}


            <Button onPress={login} loading={loading} style={{ margin: 15, }}
                icon="account-check" mode="contained">Đăng nhập</Button>
        </KeyboardAvoidingView>
    );
}

export default Login;