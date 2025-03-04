import React from "react";
import { FlatList, RefreshControl, ScrollView, Text, View } from "react-native";
import StylesNotificationScreen from "../../../styles/duc/StylesNotificationScreen";
import NotificationCard from "./NotificationCard";
import APIs, { authAPIs, endpointsDuc } from "../../../configs/APIs";
import { MyUserContext } from "../../../configs/UserContexts";

import { ActivityIndicator } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NotificationScreen = () => {
    const currentUser = React.useContext(MyUserContext)
    const [notification, setNotification] = React.useState([])
    const [loading, setLoading] = React.useState(false);
    const [page, setPage] = React.useState(1);

    const loadNotification = async () => {
        if (page > 0) {

            setLoading(true)
            if (currentUser !== null)
                try {
                    let url = `${endpointsDuc['getListNotification'](currentUser.id)}?page=${page}`
                    const token = await AsyncStorage.getItem("access_token");
                    let res = await authAPIs(token).get(url)

                    if (page > 1) {
                        setNotification(prev => [...prev, ...res.data.results])
                    } else {
                        setNotification(res.data.results)

                    }
                    if (res.data.next === null) {
                        setPage(0)
                    }
                } catch (error) {
                    if (error.response?.status === 404) {
                        setPage(0);
                    } else {
                        console.error("Error loading notification:", error, " == at page: ", pageForRent);
                    }
                } finally {
                    setLoading(false)

                }
        }
    }
    const loadMore = () => {
        console.log("load more", page)
        if (page > 0) {
            setPage(page + 1)
        }

    }

    const refresh = () => {
        setPage(1)

    }
    React.useEffect(() => {

        loadNotification()
    }, [page])
    const renderItemNotification = ({ item }) => {
        return (
            <NotificationCard key={item.id} item={item} />
        )
    }
    return (
        <View >

            <FlatList
                refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
                data={notification}
                renderItem={renderItemNotification}

                onEndReached={loadMore}
                ListFooterComponent={() => loading ? <ActivityIndicator /> : null}
            />

        </View>


    )
}
export default NotificationScreen