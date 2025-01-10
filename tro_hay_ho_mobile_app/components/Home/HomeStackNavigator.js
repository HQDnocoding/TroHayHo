import { Stack } from "../../general/General";


const HomeStackNavigator = () => {
    return (
  
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name='home' component={Home} options={{ 'title': 'Màn hình chính' }} />
        </Stack.Navigator>
  
    );
  }

export default HomeStackNavigator;