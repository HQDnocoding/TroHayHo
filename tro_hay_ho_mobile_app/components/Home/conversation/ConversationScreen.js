import { View, Text, StyleSheet, ScrollView, FlatList, RefreshControl } from "react-native";
import React from "react";
import { Searchbar } from "react-native-paper";
import APIs, { endpointsDuc } from "../../../configs/APIs";
import { ActivityIndicator } from "react-native-paper";
import ConversationCard from "./ConversationCard";
import { tempUser } from "../../../utils/MyValues";
import { getMessages, getUserConversations } from "../../../utils/ChatFunction";
const ConversationScreen = () => {
    const [conversation, setConversation] = React.useState([])

    const [loading, setLoading] = React.useState(false);
    console.info("conversation screen")

    const renderItemConversation = ({ item }) => {
        return (
            <ConversationCard key={item.id} item={item} params={{}} routeName={'message'} />
        )
    }

    const flatListHearder = () => {
        return (

            <View >
                <Searchbar style={styles.searchBar}
                    placeholder={"Tìm kiếm"}
                />
            </View>

        )
    }
    React.useEffect(() => {
        const listenConversations= getUserConversations(tempUser.id,(conversation)=>{
            if(conversation)
            {
                console.info("conversation screen",conversation)
                setConversation(conversation)
            }
        })
        return ()=>{
            listenConversations()
        }


    }, [])
    return (

        <View >

            <FlatList
                data={conversation}
                renderItem={renderItemConversation}
                ListHeaderComponent={flatListHearder}
                ListFooterComponent={() => loading ? <ActivityIndicator /> : null}
            />

        </View>

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
    }
})
export default ConversationScreen;

