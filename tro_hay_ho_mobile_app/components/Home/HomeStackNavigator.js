import {Stack} from "../../general/General";
import {IconButton,Searchbar} from "react-native-paper";
import {View} from "react-native";
import Home from "./Home";
import NotificationScreen from "../Home/duc/NotificationScreen";
import MessageScreen from "./duc/MessageScreen";
import HomeTabNavigator from "./HomeTabNavigator"

const HomeStackNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={({navigation,route}) => ({
                headerShown: true,
                headerRight: () => {
                  if(route.name === "HomeTab"){
                    return (
                      <View style={{flexDirection: 'row'}}>
                       
                      <IconButton
                          icon="bell"
                          size={24}
                          onPress={() => navigation.navigate('notification')}
                      />
                      <IconButton
                          icon="message"
                          size={24}
                          onPress={() => navigation.navigate('message')}
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
                options={{title: "Trang chủ"}}
            />
            <Stack.Screen
                name='notification'
                component={NotificationScreen}
                options={{title: 'Thông báo'}}
            />
            <Stack.Screen
                name='message'
                component={MessageScreen}
                options={{title: 'Tin nhắn'}}
            />
        </Stack.Navigator>
    );
}

export default HomeStackNavigator;