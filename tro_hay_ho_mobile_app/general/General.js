import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export const Tab=createBottomTabNavigator();
export const Stack = createNativeStackNavigator();

export const Role=Object.freeze({
    CHU_TRO:'chu_tro',
    NGUOI_THUE_TRO:'nguoi_thue_tro'
})