import PostManagement from "./PostManagement";
import { Stack } from "../../general/General";



const PostManagementStackNavigator=()=>{
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name='login' component={PostManagement} />
        </Stack.Navigator>
      );
}

export default PostManagementStackNavigator;


