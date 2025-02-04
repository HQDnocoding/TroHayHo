import { Stack } from "../../../general/General";
import { View, Text, StyleSheet, ScrollView, FlatList, RefreshControl, Image } from "react-native";
import { HeaderBackButton } from "@react-navigation/elements";
import React from "react";
import MessageScreen from "./MessageScreen";
import { sampleImage,sampleAvatar } from "../../../utils/MyValues";
import { getFullName } from "../../../utils/MyFunctions";
const MessageStackNavigator = ({navigation,route}) => {
    const params = route.params || {};
    const { item, currentUser,partner } = params;
    const partnerUser=partner
    return (

        <Stack.Navigator
            screenOptions={{
                headerShown: true,

                headerLeft: () => {
                    const partnerInfo = item ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFBA00' }}>
                            <HeaderBackButton onPress={() => navigation.goBack()} />
                            <View style={styles.containImage}>
                                <Image
                                    style={styles.mainImage}
                                    source={{ uri: partnerUser?.avatar || sampleAvatar }}
                                />
                            </View>
                            <Text style={{ color: '#fff', marginLeft: 10 }}>
                                {getFullName(partnerUser?.last_name,partnerUser?.first_name)}
                            </Text>
                        </View>
                    ) : (
                        <HeaderBackButton onPress={() => navigation.goBack()} />
                    );

                    return partnerInfo;
                },
                headerStyle: {
                    backgroundColor: '#FFBA00',
                },
                headerTintColor: '#fff',

            }}

        >
            <Stack.Screen
                name={'oneMessage'}
                component={MessageScreen}
                options={{
                    title: null,
                }}
                initialParams={{item,currentUser,partnerUser}}
            />


        </Stack.Navigator>


    );
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff'
    },
    searchBar: {
        marginHorizontal: 20,
        marginTop: 20,
        backgroundColor: '#bdbdbd',
        marginBottom: 10,
    },
    mainImage: {
        width: 40,
        objectFit: 'cover',
        height: 40,

        marginRight: 5,
        borderRadius: 100,
    },
    containImage: {


    }
})
export default MessageStackNavigator;

