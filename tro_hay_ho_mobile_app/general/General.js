import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export const Tab=createBottomTabNavigator();
export const Stack = createNativeStackNavigator();

export const Role=Object.freeze({
    CHU_TRO:'Chủ trọ',
    NGUOI_THUE_TRO:'Người thuê trọ'
})