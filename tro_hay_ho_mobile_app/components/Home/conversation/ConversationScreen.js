import { View, Text, StyleSheet, ScrollView, FlatList, RefreshControl } from "react-native";
import React, { useContext } from "react";
import { Searchbar } from "react-native-paper";
import APIs, { endpointsDuc } from "../../../configs/APIs";
import { ActivityIndicator } from "react-native-paper";
import ConversationCard from "./ConversationCard";
import { getMessages, getUserConversations } from "../../../utils/ChatFunction";
import { MyUserContext } from "../../../configs/UserContexts";
const ConversationScreen = () => {
    const currentUser = useContext(MyUserContext)

    const [conversation, setConversation] = React.useState([])
    const [re, setRe] = React.useState(true);
    const [loading, setLoading] = React.useState(false);
    console.info("conversation screen", currentUser)

    const renderItemConversation = ({ item }) => {
        return (
            <ConversationCard key={item.id} item={item} currentUser={currentUser} params={{}} routeName={'message'} />
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
    const refresh = () => {
        setRe(true)
    }
    const loadConversations = () => {
        setLoading(true)
        const listenConversations = getUserConversations(currentUser.id, (conversation) => {
            if (conversation) {
                setConversation(conversation)
            }
            setRe(false)
            setLoading(false)
        })
        return () => {
            listenConversations()
        }
    }
    React.useEffect(() => {
        if(re===true)
            loadConversations()
    },[re])
 
    return (

        <View >

            <FlatList
                refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh}/>}
                data={conversation}
                renderItem={renderItemConversation}
                ListHeaderComponent={flatListHearder}
               
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

