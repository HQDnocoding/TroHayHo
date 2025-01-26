import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useReducer, useState } from 'react';
import { MyDispatchContext, MyUserContext } from './configs/UserContexts';
import MyUserReducer from './configs/UserReducers';
import BottomTabsNavigator from './components/Home/BottomTabsNavigator';
import { Stack } from './general/General';
import Login from './components/User/Login';
import Register from './components/User/Register';
import LoginStyles from './styles/dat/LoginStyles';
import AccountSettingDetail from './components/User/AccountSettingDetail';
import SavePosts from './components/User/SavedPosts';
import PostImage from './components/PostDetail/PostImages';
import PostForRentDetail from './components/PostDetail/PostForRentDetail';
import PostWantDetail from './components/PostDetail/PostWantDetail';
import NotificationScreen from "./components/Home/notification/NotificationScreen";
import ConversationScreen from "./components/Home/conversation/ConversationScreen";
import MessageScreen from './components/Home/message/MessageScreen';
import MessageStackNavigator from "./components/Home/message/MessageStackNavigator";
import FavouritePost from './components/User/FavouritePost';
import SearchScreen from './components/Home/SearchScreen';
import {
    GoogleSignin
} from '@react-native-google-signin/google-signin';
import ProfileUser from "./components/Home/User/ProfileUser";
import PostForRentCreating from './components/PostCreating/PostForRentCreating';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


export default function App() {
    GoogleSignin.configure({
        webClientId: '1094159227138-04u2vu85jblo2vemrqv68bmihh0jmlau.apps.googleusercontent.com', // client ID of type WEB for your server. Required to get the `idToken` on the user object, and for offline access.
        scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
        offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
        forceCodeForRefreshToken: false, // [Android] related to `serverAuthCode`, read the docs link below *.
        iosClientId: '1094159227138-lvlg2n85bnu91f8vahfifbclhgiroqls.apps.googleusercontent.com', // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    });
    const [user, dispatch] = useReducer(MyUserReducer, null);

    const MyAppNavigator = () => {
        return (
            <Stack.Navigator>
                <Stack.Screen name='bottom-tabs' component={BottomTabsNavigator} options={{ headerShown: false }} />
                <Stack.Screen name='login' component={Login} options={{
                    tabBarVisible: true,
                    headerTitle: '',
                    headerStyle: {
                        backgroundColor: '#FFBA00',
                    }
                }} />

                <Stack.Screen name='register' component={Register} options={{
                    tabBarVisible: true,
                    headerTitle: '',
                    headerStyle: {
                        backgroundColor: '#FFBA00',
                    }
                }} />
                <Stack.Screen name='account_setting_detail' component={AccountSettingDetail} options={{
                    tabBarVisible: true,
                    headerTitle: 'Cài đặt tài khoản',
                    headerStyle: {
                        backgroundColor: '#FFBA00',
                    }
                }} />
                <Stack.Screen name='saved_posts' component={FavouritePost} options={{
                    tabBarVisible: true,
                    headerTitle: 'Các tin đã lưu',
                    headerStyle: {
                        backgroundColor: '#FFBA00',
                    }
                }} />

                <Stack.Screen name='post_for_rent' component={PostForRentDetail} options={{
                    tabBarVisible: true,
                    headerTitle: 'Bài đăng',
                    headerStyle: {
                        backgroundColor: '#FFBA00',
                    }
                }} />
                <Stack.Screen name='post_want' component={PostWantDetail} options={{
                    tabBarVisible: true,
                    headerTitle: 'Bài đăng',
                    headerStyle: {
                        backgroundColor: '#FFBA00',
                    }
                }} />
                <Stack.Screen name='notification' component={NotificationScreen} options={{
                    headerTitle: 'Thông báo',
                    headerStyle: {
                        backgroundColor: '#FFBA00',
                    }
                }} />
                <Stack.Screen name='conversation' component={ConversationScreen} options={{
                    headerTitle: 'Trò chuyện',
                    headerStyle: {
                        backgroundColor: '#FFBA00',
                    }
                }} />
                <Stack.Screen name='message' component={MessageStackNavigator} options={{
                    headerShown: false,
                    headerStyle: {
                        backgroundColor: '#FFBA00',
                    }
                }} />
                <Stack.Screen name='profile_user' component={ProfileUser} options={{
                    headerShown: true,
                    headerTitle: '',
                    headerStyle: {
                        backgroundColor: '#FFBA00',
                    }
                }} />
                <Stack.Screen name={"search"}
                    component={SearchScreen}
                    options={{ title: null }} />



            </Stack.Navigator>
        )
    }

    return (
        <GestureHandlerRootView >
            <NavigationContainer>
                <MyUserContext.Provider value={user}>
                    <MyDispatchContext.Provider value={dispatch}>
                        <MyAppNavigator/>
                        {/* <PostForRentCreating /> */}
                    </MyDispatchContext.Provider>
                </MyUserContext.Provider>
            </NavigationContainer>
        </GestureHandlerRootView>



    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});