import {View, Text, StyleSheet, ScrollView,FlatList,RefreshControl} from "react-native";
import React from "react";
import {Searchbar} from "react-native-paper";
import APIs, { endpointsDuc } from "../../../configs/APIs";
import { ActivityIndicator } from "react-native-paper";
import ConversationCard from "./ConversationCard";

const ConversationScreen = () => {
    const [conversation, setConversation] = React.useState([])

    const [loading, setLoading] = React.useState(false);
    const [page, setPage] = React.useState(1);

     const loadConversation=async ()=>{
             if (page > 0) {
                
                        setLoading(true)
            
                        try {
                            // chinh user id o day hoho
                            let userId=2
                            let url = `${endpointsDuc['getListConversationByUserId'](userId)}?page=${page}`
                            let res = await APIs.get(url)
            
                            if(page>1){
                                setConversation(prev=>[...prev,...res.data.results])
                            }else{
                                setConversation(res.data.results)
    
                            }
                            if (res.data.next === null) {
                                setPage(0)
                            }
                        } catch (error) {
                            if (error.response?.status === 404) {
                                setPage(0);
                            } else {
                                console.error("Error loading conversation:", error, " == at page: ", pageForRent);
                            }
                        } finally {
                            setLoading(false)
            
                        }
                    }
        }
        const loadMore = () => {
            if (page > 0) {
                setPage(page + 1)
            }
           
        }
        const refresh = () => {
            setPage(1)
    
        }
        const renderItemConversation=({item})=>{
            return(
                <ConversationCard key={item.id} item={item} params={{}} routeName={''}/>
            )
        }
    
       const flatListHearder=()=>{
        return (
       
        <View >
        <Searchbar style={styles.searchBar}
        placeholder={"Tìm kiếm"}
        />
        </View>
 
        )
       }
        React.useEffect(()=>{
                
                loadConversation()
            },[page])
  return (
    
       <View >
    
            <FlatList
                refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh}/>}
                data={conversation}
                renderItem={renderItemConversation}
                ListHeaderComponent={flatListHearder}
                onEndReached={loadMore}
                ListFooterComponent={() => loading ? <ActivityIndicator/> : null}
            />
    
        </View>
      
  );
}
const styles= StyleSheet.create({
    container:{
      backgroundColor:'#fff'
    },
    searchBar:{
        marginHorizontal:20,
        marginTop:20,
        backgroundColor:'#bdbdbd',
        marginBottom:10,
    }
})
export default ConversationScreen;

