import { Stack } from "../../general/General";
import { IconButton, Searchbar, Modal, Portal, Provider, Icon } from "react-native-paper";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useState, useContext, useRef } from 'react';
import { FontAwesome, Entypo, MaterialIcons } from '@expo/vector-icons';
import Home from "./Home";
import NotificationScreen from "./notification/NotificationScreen";
import ConversationScreen from "./conversation/ConversationScreen";
import HomeTabNavigator from "./HomeTabNavigator";
import SearchScreen from "./search/SearchScreen";
import NotificationTabNaviagtor from "./notification/NotificationTabNaviagtor";
import MessageScreen from "./message/MessageScreen";
import RequestLoginDialog from "./duc/RequestLoginDialog";
import { MyUserContext } from "../../configs/UserContexts";
import { useNavigation } from "@react-navigation/native";
import { useRequestLoginDialog } from "../../utils/RequestLoginDialogContext";
import BottomSheetSendToFollowed from "./User/BottomSheetSendToFollowed";
import { BottomSendToFollowedContextProvider, useBottomSendToFollowedContext } from "../../utils/BottomSendToFollowedContext";

const HomeStackNavigator = () => {

    const { showDialog } = useRequestLoginDialog()
    const nav = useNavigation()
    const currentUser = useContext(MyUserContext)


    const handleToSearch = () => {
        console.log("home seact")
        nav.navigate('search')
    }
    const handleToRoute = (routeName) => {
        if (currentUser !== null) {
            nav.navigate(routeName)
        } else {
            showDialog()
        }
    }
    return (
        <Provider>
                <Stack.Navigator
                    screenOptions={({ navigation, route }) => ({
                        headerShown: true,
                        headerLeft: () => {
                            if (route.name === "HomeTab") {
                                return (
                                    <TouchableOpacity onPress={handleToSearch}>
                                        <View
                                            style={styles.searchBar}
                                        >
                                            <MaterialIcons style={styles.iconSearch} name="search" size={24} color="black" />
                                            <Text style={styles.searchInput}>Tìm kiếm ...</Text>
                                        </View>
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
                                            onPress={() => handleToRoute("notification")}
                                        />
                                        <IconButton
                                            icon="message"
                                            size={24}
                                            onPress={() => handleToRoute('conversation')}
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
        alignItems: 'center',
        flexDirection: 'row',


    },
    iconSearch: {
        marginLeft: 10,

    },
    searchInput: {
        fontSize: 14,
        minHeight: 0,
        marginLeft: 10,
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