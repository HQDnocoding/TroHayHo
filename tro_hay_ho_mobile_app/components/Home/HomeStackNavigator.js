import { Stack } from "../../general/General";
import { IconButton, Searchbar, Modal, Portal, Provider } from "react-native-paper";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useState,useContext } from 'react';

import Home from "./Home";
import NotificationScreen from "./notification/NotificationScreen";
import ConversationScreen from "./conversation/ConversationScreen";
import HomeTabNavigator from "./HomeTabNavigator";
import SearchScreen from "./SearchScreen";
import NotificationTabNaviagtor from "./notification/NotificationTabNaviagtor";
import MessageScreen from "./message/MessageScreen";
import RequestLoginDialog from "./duc/RequestLoginDialog";
import { MyUserContext } from "../../configs/UserContexts";
import { useNavigation } from "@react-navigation/native";

const HomeStackNavigator = () => {
    const [visible, setVisible] = useState(false);
    const nav= useNavigation()
    const currentUser = useContext(MyUserContext)

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
 
    const handleToRoute=(routeName)=>{
        if (currentUser!==null){
            nav.navigate(routeName)
        }else{
            showModal()
        }
    }
    return (
        <Provider>
            <Portal>
                <RequestLoginDialog onClose={hideModal} visible={visible} />
            </Portal>

            <Stack.Navigator
                screenOptions={({ navigation, route }) => ({
                    headerShown: true,
                    headerLeft: () => {
                        if (route.name === "HomeTab") {
                            return (
                                <TouchableOpacity>
                                    <Searchbar
                                        placeholder={"Tìm kiếm"}
                                        style={styles.searchBar}
                                        inputStyle={styles.searchInput}
                                    />
                                </TouchableOpacity>
                            );
                        }
                        return null;
                    },
                    headerRight: () => {
                        if (route.name === "HomeTab") {
                            return (
                                <View style={{ flexDirection: 'row' }}>
                                    <IconButton
                                        icon="bell"
                                        size={24}
                                        onPress={()=>handleToRoute("notification")}
                                    />
                                    <IconButton
                                        icon="message"
                                        size={24}
                                        onPress={()=>handleToRoute('conversation')}
                                    />
                                </View>
                            )
                        }
                        return null
                    },
                    headerStyle: {
                        backgroundColor: '#FFBA00',
                    },
                    headerTintColor: '#fff',
                })}
            >
                <Stack.Screen
                    name='HomeTab'
                    component={HomeTabNavigator}
                    options={{ title: null, headerShown: true }}
                />
                
                <Stack.Screen 
                    name={"search"}
                    component={SearchScreen}
                    options={{ title: null }} 
                />
            </Stack.Navigator>
        </Provider>
    );
}

const styles = StyleSheet.create({
    searchBar: {
        width: 220,
        height: 40,
        padding: 0,
        marginLeft: 10,
        backgroundColor: '#fff',
        elevation: 0,
        borderRadius: 20,
    },
    searchInput: {
        fontSize: 14,
        minHeight: 0,
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
        borderRadius: 10,
        height: '80%',
    },
    modalContent: {
        flex: 1,
    },
    closeButton: {
        position: 'absolute',
        right: 0,
        top: 0,
    }
});

export default HomeStackNavigator;