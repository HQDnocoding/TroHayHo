import PostManagement from "./PostManagement";
import { Stack } from "../../general/General";
import PostManagementTabNavigator from "./PostManagementTabNavigator";



const PostManagementStackNavigator=()=>{
    return (
        <Stack.Navigator screenOptions={{ headerShown: true,
                headerStyle: {
                    backgroundColor: '#FFBA00',
                },
                headerTintColor: '#fff', }}>
          <Stack.Screen name='Quản lý tin đăng' component={PostManagementTabNavigator} />
        </Stack.Navigator>
      );
}

export default PostManagementStackNavigator;


