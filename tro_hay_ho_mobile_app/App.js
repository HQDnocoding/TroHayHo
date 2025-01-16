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



export default function App() {
  const [user, dispatch] = useReducer(MyUserReducer, null);

  const MyAppNavigator = () => {
    return (
      <Stack.Navigator >
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
        <Stack.Screen name='saved_posts' component={SavePosts} options={{
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
      </Stack.Navigator>
    )
  }

  return (
<NavigationContainer>
      <MyUserContext.Provider value={user}>
        <MyDispatchContext.Provider value={dispatch}>
          <MyAppNavigator />
        </MyDispatchContext.Provider>
      </MyUserContext.Provider>
    </NavigationContainer>
   

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
