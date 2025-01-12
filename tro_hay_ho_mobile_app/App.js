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
