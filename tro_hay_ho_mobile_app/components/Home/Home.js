import {View, Text, ScrollView, StyleSheet, ActivityIndicator,FlatList} from 'react-native';
import {Card, Title, Paragraph} from 'react-native-paper';
import PostForRent from "./duc/post/PostForRent";
import PostWant from "./duc/post/PostWant";
import WantPlace from "./duc/explore/WantPlace";
import Banner from "./duc/explore/Banner";
import React from "react";
import AddressDialog from "./duc/explore/AddressDialog";
import APIs, {endpoints} from "../../configs/APIs";
import { shuffleArray } from '../../utils/Formatter';


const Home = () => {
    const [visibleModelAddress, setVisibleModelAddress] = React.useState(false)
    const [postWant,setPostWant]=React.useState(null)
    const [postForRent,setPostForRent]=React.useState(null)

    const loadPostWant=async ()=>{
        let res = await APIs.get(endpoints['getListPostWant'])
        // console.info(res.data)
        setPostWant(res.data)
    }
      const loadPostForRent=async ()=>{
        let res = await APIs.get(endpoints['getListPostForRent'])
        // console.info(res.data)
        setPostForRent(res.data)
    }
    const showModel = () => {
        setVisibleModelAddress(true)
    }
    const hideModel = () => {
        setVisibleModelAddress(false)
    }


    React.useEffect(()=>{
        loadPostWant()
    },[])
       React.useEffect(()=>{
        loadPostForRent()
    },[])
    const renderItemPost=({item})=>{
        if(item.max_number_of_people!=null){
            return (
                <PostForRent item={item} routeName={'post_for_rent'} params={{'postId':item.id}} />
            )
        }
        else{
            return (
                <PostWant item={item} routeName={''} params={{'postId':item.id}} />
            )
        }
       
    }
    const flatListHeader=()=>{
        return(
            <>
            <Banner/>
            <WantPlace openDialog={showModel}/>
            
            </>
        )
    }
    if(postForRent===null || postWant===null){
        return (
            <ActivityIndicator/>
        )
    }



    const allPost=shuffleArray([...postForRent,...postWant])

    console.info(allPost)
    return (
        <View style={styles.container}>

            <FlatList 
            data={allPost} 
            renderItem={renderItemPost}
            ListHeaderComponent={flatListHeader}
            keyExtractor={item=>item.id.toString()}
            />
            <AddressDialog visible={visibleModelAddress} onClose={hideModel}/>

        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        padding: 15,
        backgroundColor: '#fff',
        marginBottom: 10,
    },
    headerText: {
        color: 'red',
        fontSize: 18,
        fontWeight: 'bold',
    },
    card: {
        margin: 10,
        elevation: 4,
    },
    price: {
        color: '#FFBA00',
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 5,
    },
    address: {
        color: '#666',
        marginBottom: 5,
    },
});

export default Home;