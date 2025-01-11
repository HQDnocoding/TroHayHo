import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {Card, Title, Paragraph} from 'react-native-paper';
import PostForRent from "./duc/post/PostForRent";
import PostWant from "./duc/post/PostWant";
import WantPlace from "./duc/explore/WantPlace";
import Banner from "./duc/explore/Banner";
import React from "react";
import AddressDialog from "./duc/explore/AddressDialog";


const Home = () => {
     const[visibleModelAddress,setVisibleModelAddress] = React.useState(false)
    const showModel=()=>{setVisibleModelAddress(true)}
    const hideModel=()=>{setVisibleModelAddress(false)}

    const posts = [
        {
            id: 1,

        },
        {
            id: 2,

        },
    ];

    return (
        <View style={styles.container}>

            <ScrollView >
           <Banner/>
            <WantPlace openDialog={showModel}/>

            {posts.map(post => (
                <PostForRent key={post.id}/>
            ))}
            {posts.map(post => (
                <PostWant key={post.id}/>
            ))}
        </ScrollView>
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