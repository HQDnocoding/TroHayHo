import Login from "./Login";
import { Stack } from "../../general/General";


const AccountStackNavigator = () => {

    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name='login' component={Login} />
      </Stack.Navigator>
    );
  }

  export default AccountStackNavigator;