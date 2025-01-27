import PostCreatingForm from "./PostCreatingForm";
import { Stack } from "../../general/General";
import Map from "./Map";


const PostCreatingStackNavigator = () => {

  return (
    <Stack.Navigator screenOptions={{
      headerShown: true, headerTitle: 'Đăng tin thuê', headerStyle: {
        backgroundColor: '#FFBA00',
      },
      headerTintColor: '#fff',

      presentation: 'modal',
    }}
    >
      <Stack.Screen name='creating' component={PostCreatingForm} />

    </Stack.Navigator>
  );
}

export default PostCreatingStackNavigator;