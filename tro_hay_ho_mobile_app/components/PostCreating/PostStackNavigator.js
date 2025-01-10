import PostCreatingForm from "./PostCreatingForm";
import { Stack } from "../../general/General";


const PostCreatingStackNavigator = () => {

    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name='login' component={PostCreatingForm} />
      </Stack.Navigator>
    );
  }

  export default PostCreatingStackNavigator;