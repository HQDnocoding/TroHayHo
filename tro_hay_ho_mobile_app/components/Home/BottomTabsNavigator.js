import HomeTabNavigator from "./HomeTabNavigator";
import AccountStackNavigator from "../User/AccountStackNavigator";
import { Icon } from "react-native-paper";
import PostCreatingStackNavigator from "../PostCreating/PostStackNavigator";
import PostManagementStackNavigator from "../PostManagement/PostManagementStackNavigator";
import { Tab } from "../../general/General";



const BottomTabsNavigator = () => {

    return (
      <Tab.Navigator screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: '#FFBA00', // Màu nền của Tab Navigator
        },
        tabBarActiveTintColor: '#FFFFFF', // Màu icon và text khi được chọn
        tabBarInactiveTintColor: '#000000', // Màu icon và text khi không được chọn
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'home':
              iconName = 'home';
              break;
            case 'post-management':
              iconName = 'post-outline';
              break;
            case 'post-creating':
              iconName = 'square-edit-outline';
              break;
            case 'account':
              iconName = 'account';
              break;
            default:
              iconName = 'circle';
          }
          return <Icon source={iconName} size={size || 20} color={color} />;
        },
      })}>
  
        <Tab.Screen name="home" component={HomeTabNavigator} options={{ title: 'Trang chủ' }} />
        <Tab.Screen name="post-management" component={PostManagementStackNavigator} options={{ title: 'Quản lý tin' }} />
        <Tab.Screen name="post-creating" component={PostCreatingStackNavigator} options={{ title: 'Đăng tin' }} />
        <Tab.Screen name="account" component={AccountStackNavigator} options={{ title: 'Tài khoản' }} />
  
      </Tab.Navigator>
    )
  
  }



  export default BottomTabsNavigator;