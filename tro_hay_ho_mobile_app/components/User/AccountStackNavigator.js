import Login from "./Login";
import { Stack } from "../../general/General";
import AccountSetting from "./AccountSetting";
import { IconButton } from "react-native-paper";
import { View } from "react-native";
import Register from "./Register";
import { useNavigation, useNavigationState } from "@react-navigation/native";


const AccountStackNavigator = () => {

 

  return (
    <Stack.Navigator
  
     screenOptions={({ navigation, route }) => ({
      headerShown: true,
      headerRight: () => {
        if (route.name === "account-setting") {
          return (
            <View style={{ flexDirection: 'row' }}>

              <IconButton
                icon="bell"
                size={24}
                onPress={() => navigation.navigate('notification')}
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

      

    })}>
      <Stack.Screen name='account-setting' component={AccountSetting} options={{title:'Tài khoản'}} />
      <Stack.Screen name='login' component={Login} />
      <Stack.Screen name='register' component={Register} />
    </Stack.Navigator>
  );
}

export default AccountStackNavigator;