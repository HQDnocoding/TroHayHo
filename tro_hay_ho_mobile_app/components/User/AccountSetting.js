import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import AccountUserStyle from "../../styles/dat/AccountUserStyle";
import ItemSetting from "./ItemSetting";
import React, { useContext, useState } from "react";
import { MyDispatchContext, MyUserContext } from "../../configs/UserContexts";
import APIs, { endpoints } from "../../configs/APIs";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AccountSetting = ({ navigation }) => {

    const user = useContext(MyUserContext);
    const dispatch = useContext(MyDispatchContext);
    const [role, setRole] = useState(null)

    console.log('user value:', user);

    const logout = async () => {
        await AsyncStorage.removeItem("token");
        dispatch({
            "type": "logout"
        });
        navigation.navigate('login');
    }


    // const roleName = await AsyncStorage.getItem("roleName");

    return (
        <ScrollView style={AccountUserStyle.container}>
            <View style={AccountUserStyle.header}>

                {user === null ? (
                    <>
                        <Image
                            source={require('../../assets/45_donald_trump.png')}
                            style={AccountUserStyle.avatar}
                        />
                        <View style={AccountUserStyle.loginRegister}>
                            <TouchableOpacity onPress={() => navigation.navigate('login')}>
                                <Text style={{ fontWeight: 800 }}>Đăng nhập</Text>
                            </TouchableOpacity>
                            <Text style={{ fontWeight: 800 }}> / </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('register')}>
                                <Text style={{ fontWeight: 800 }}>Đăng ký</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                ) : (
                    <><View style={AccountUserStyle.headerRow1}>
                        <TouchableOpacity>
                            <Image
                                source={require('../../assets/45_donald_trump.png')}
                                style={AccountUserStyle.avatar}
                            />
                        </TouchableOpacity>
                        {/* <Text style={AccountUserStyle.tag}>{role}</Text> */}
                    </View>
                        <View style={AccountUserStyle.headerRow2}>
                            <TouchableOpacity>
                                <Text style={AccountUserStyle.info} > {user?.first_name} {user?.last_name}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity>
                                <Text style={AccountUserStyle.followers}>0 Người theo dõi | 0 Đang theo dõi</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}



            </View>
            <View style={AccountUserStyle.section}>
                <Text style={{ marginStart: 10, fontWeight: 700, marginTop: 20 }}>Tiện ích</Text>
                <TouchableOpacity>
                    <ItemSetting iconName={"heart-circle"} optionSetting={"Các tin đã lưu"} colorIcon={'red'} />

                </TouchableOpacity>
            </View>
            <View style={AccountUserStyle.section}>
                <Text style={{ marginStart: 10, fontWeight: 700, marginTop: 20 }}>Khác</Text>
                <TouchableOpacity onPress={() => {
                    if (user === null) {
                        navigation.navigate('login');

                    } else {

                    }
                }}>
                    <ItemSetting iconName={'cog'} optionSetting={'Cài đặt tài khoản'} colorIcon={'grey'} />
                </TouchableOpacity>
                {user === null ? (<></>) : <><TouchableOpacity onPress={logout}>
                    <ItemSetting iconName={'logout'} optionSetting={'Đăng xuất'} colorIcon={'grey'} />
                </TouchableOpacity></>}
            </View>


        </ScrollView>
    )

}


export default AccountSetting;