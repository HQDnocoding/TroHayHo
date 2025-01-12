import React from "react";
import {ScrollView, Text, View} from "react-native";
import StylesNotificationScreen from "../../../styles/duc/StylesNotificationScreen";
import NotificationCard from "./NotificationCard";

const NotificationScreen = ()=>{
    return (
        <ScrollView>

            <NotificationCard/>
            <NotificationCard/>
            <NotificationCard/>
            <NotificationCard/>
            <NotificationCard/>
            <NotificationCard/>
            <NotificationCard/>
        </ScrollView>

    )
}
export default NotificationScreen