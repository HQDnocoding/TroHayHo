import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import Login from './components/User/Login';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { useReducer } from 'react';
import { MyDispatchContext, MyUserContext } from './configs/UserContexts';
import MyUserReducer from './configs/UserReducers';

const Stack=createNativeStackNavigator();

const StackNavigator=()=>{

  return (
    <Stack.Navigator screenOptions={{headerShown:false}}>
      <Stack.Screen name='login' component={Login}/>
    </Stack.Navigator>
  );
}


const Tab=createBottomTabNavigator()

const TabNavigator=()=>{
  
  return (
    <Tab.Navigator>

<Tab.Screen name='account' component={StackNavigator} options={{title:'Tài khoản',tabBarIcon:()=><Icon source="account" size={20}/>}}/>

    </Tab.Navigator>
  )

}


export default function App() {
  const [user, dispatch] = useReducer(MyUserReducer, null);
  return (
    
    <NavigationContainer>
    <MyUserContext.Provider value={user}>
      <MyDispatchContext.Provider value={dispatch}>
        <TabNavigator />
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
