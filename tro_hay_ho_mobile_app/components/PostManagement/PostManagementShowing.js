import {View, Text, ScrollView, StyleSheet,FlatList,RefreshControl} from 'react-native';
import {Card, Title, Paragraph} from 'react-native-paper';
import React from "react";
import PostManagementCard from "./PostManagementCard";
import APIs, { endpointsDuc } from "../../configs/APIs"
import { ActivityIndicator } from "react-native-paper";


const PostManagementShowing=()=>{
      const [post, setPost] = React.useState([])
    
        const [loading, setLoading] = React.useState(false);
        const [page, setPage] = React.useState(1);
    // chinh user id o day hoho
    let userId=3
      const loadPost=async ()=>{
                 if (page > 0) {
                    
                            setLoading(true)
                
                            try {
                                
                                let url = `${endpointsDuc['getListPostWantByUserId'](userId)}?page=${page}`
                               
                                let res = await APIs.get(url)
                                console.info(res.data.results)
                                if(page>1){
                                    setPost(prev=>[...prev,...res.data.results])
                                }else{
                                    setPost(res.data.results)
        
                                }
                                if (res.data.next === null) {
                                    setPage(0)
                                }
                            } catch (error) {
                                if (error.response?.status === 404) {
                                    setPage(0);
                                } else {
                                    console.error("Error loading post:", error, " == at page: ", pageForRent);
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
            const renderItemPost=({item})=>{
                return(
                    <PostManagementCard key={item.id} item={item} params={{}} routeName={''}/>
                )
            }
       
                React.useEffect(()=>{
                        
                        loadPost()
                    },[page])

return(
     <View >
       
               <FlatList
                   refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh}/>}
                   data={post}
                   renderItem={renderItemPost}
                   onEndReached={loadMore}
                   ListFooterComponent={() => loading ? <ActivityIndicator/> : null}
               />
       
           </View>
)
}

const styles= StyleSheet.create({
    container:{
      backgroundColor:'#fff'
    },
    
})
export default PostManagementShowing;