import { Stack } from "../../general/General";
import { IconButton, Searchbar } from "react-native-paper";


import { View, StyleSheet, TouchableOpacity } from "react-native";

import Home from "./Home";
import NotificationScreen from "./notification/NotificationScreen";
import ConversationScreen from "./conversation/ConversationScreen";
import HomeTabNavigator from "./HomeTabNavigator"
import SearchScreen from "./SearchScreen";
import NotificationTabNaviagtor from "./notification/NotificationTabNaviagtor";
import MessageScreen from "./message/MessageScreen";

const HomeStackNavigator = () => {
    return  (
        <Stack.Navigator
            screenOptions={({ navigation, route }) => ({
                headerShown: true,
                headerLeft: () => {
                    if (route.name === "HomeTab") {
                        return (
                            <TouchableOpacity onPress={() => navigation.navigate("search")}>
                                <Searchbar
                                    placeholder={"Tìm kiếm"}
                                    style={styles.searchBar}
                                    inputStyle={styles.searchInput}
                                    onFocus={() => navigation.navigate('search')}
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
                                    onPress={() => navigation.navigate('notification')}
                                />
                                <IconButton
                                    icon="message"
                                    size={24}
                                    onPress={() => navigation.navigate('conversation')}
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
                options={{ title: null }}
            />
        
            <Stack.Screen name={"search"}
                component={SearchScreen}
                options={{ title: null }} />
         

        </Stack.Navigator>
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
    }
});
export default HomeStackNavigator;