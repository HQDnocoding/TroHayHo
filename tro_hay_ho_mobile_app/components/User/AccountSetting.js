import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import AccountUserStyle from "../../styles/dat/AccountUserStyle";
import { Button, Icon, MD3Colors } from "react-native-paper";
import { FontAwesome } from "react-native-vector-icons";
import ItemSetting from "./ItemSetting";
import { useContext } from "react";
import { MyUserContext } from "../../configs/UserContexts";
import { useNavigation } from "@react-navigation/native";

const AccountSetting = ({ navigation }) => {

    const user = useContext(MyUserContext);
    console.log('user value:', user);

    return (
        <ScrollView style={AccountUserStyle.container}>
            <View style={AccountUserStyle.header}>
                <View style={AccountUserStyle.headerRow1}>
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
                        <>
                            <TouchableOpacity>
                                <Image
                                    source={require('../../assets/45_donald_trump.png')}
                                    style={AccountUserStyle.avatar}
                                />
                            </TouchableOpacity>
                            <Text style={AccountUserStyle.tag}>Chủ trọ</Text>
                            <View style={AccountUserStyle.headerRow2}>
                                <TouchableOpacity>
                                    <Text style={AccountUserStyle.info}>User</Text>
                                </TouchableOpacity>

                                <TouchableOpacity>
                                    <Text style={AccountUserStyle.followers}>0 Người theo dõi | 0 Đang theo dõi</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </View>


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
                {user === null ? (<></>) : <><TouchableOpacity>
                    <ItemSetting iconName={'logout'} optionSetting={'Đăng xuất'} colorIcon={'grey'} />
                </TouchableOpacity></>}
            </View>


        </ScrollView>
    )

}


export default AccountSetting;