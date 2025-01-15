import {View, Text, ScrollView, StyleSheet, ActivityIndicator, FlatList, RefreshControl} from 'react-native';
import {Card, Title, Paragraph} from 'react-native-paper';
import PostForRent from "./duc/post/PostForRent";
import PostWant from "./duc/post/PostWant";
import WantPlace from "./duc/explore/WantPlace";
import Banner from "./duc/explore/Banner";
import React from "react";
import AddressDialog from "./duc/explore/AddressDialog";
import APIs, {endpoints} from "../../configs/APIs";
import {shuffleArray} from '../../utils/Formatter';


const Home = () => {
    const [visibleModelAddress, setVisibleModelAddress] = React.useState(false)
    const [postWant, setPostWant] = React.useState([])
    const [postForRent, setPostForRent] = React.useState([])
    const [loading, setLoading] = React.useState(false);
    const [pageWant, setPageWant] = React.useState(1);
    const [pageForRent, setPageForRent] = React.useState(1);
    const [allPosts, setAllPosts] = React.useState([]);


    const loadPostWant = async () => {

        if (pageWant > 0) {
            setLoading(true)
            try {
                let url = `${endpoints['getListPostWant']}?page=${pageWant}`
                let res = await APIs.get(url)

                // if(pageWant > 1){
                //     setPostWant(prevPosts => [...prevPosts, ...res.data.results])


                // } else {
                //     setPostWant(res.data.results)

                // }
                const newPosts = res.data.results.map(post => ({...post, type: 'PostWant'}));
                setAllPosts(prevPosts => [...prevPosts, ...newPosts]);

                if (res.data.next === null) {
                    setPageWant(0)
                }
            } catch (error) {
                if (error.response?.status === 404) {
                    // Xử lý lỗi 404: Dừng việc tăng giá trị pageWant
                    setPageWant(0);
                } else {
                    console.error("Error loading posts want:", error, " == at page: ", pageWant);
                }

            } finally {
                setLoading(false)

            }
        }

    }
    const loadPostForRent = async () => {


        if (pageForRent > 0) {
            setLoading(true)

            try {
                let url = `${endpoints['getListPostForRent']}?page=${pageForRent}`
                let res = await APIs.get(url)

                // if(pageForRent === 1){
                //     setPostForRent(res.data.results)

                // } else {
                //     setPostForRent(prevPosts => [...prevPosts, ...res.data.results])

                // }
                const newPosts = res.data.results.map(post => ({...post, type: 'PostForRent'}));
                setAllPosts(prevPosts => [...prevPosts, ...newPosts]);

                if (res.data.next === null) {
                    setPageForRent(0)
                }
            } catch (error) {
                if (error.response?.status === 404) {
                    // Xử lý lỗi 404: Dừng việc tăng giá trị pageForRent
                    setPageForRent(0);
                } else {
                    console.error("Error loading posts for rent:", error, " == at page: ", pageForRent);
                }
            } finally {
                setLoading(false)

            }
        }
    }
    const showModel = () => {
        setVisibleModelAddress(true)
    }
    const hideModel = () => {
        setVisibleModelAddress(false)
    }

    const loadMore = () => {
        if (pageWant > 0) {
            setPageWant(pageWant + 1)
        }
        if (pageForRent > 0) {
            setPageForRent(pageForRent + 1)
        }
    }

    const refresh = () => {
        setAllPosts([])
        setPageForRent(1)
        setPageWant(1)

    }
    React.useEffect(() => {

        loadPostForRent()
    }, [pageForRent])

    React.useEffect(() => {
        loadPostWant()
    }, [pageWant])

    const renderItemPost = ({item}) => {
        if (item.type === 'PostForRent') {
            return <PostForRent item={item} routeName={'post_for_rent'} params={{postId:item.id}}/>;
        } else if (item.type === 'PostWant') {
            return <PostWant item={item} routeName={'post_want'} params={{postId:item.id}}/>;
        }

    }
    const flatListHeader = () => {
        return (
            <>
                <Banner/>
                <WantPlace openDialog={showModel}/>

            </>
        )
    }

    // if (postForRent === null && postWant === null) {
    //     return (
    //         <ActivityIndicator/>
    //     )
    // }


    return (
        <View style={styles.container}>

            <FlatList
                refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh}/>}
                data={allPosts}
                renderItem={renderItemPost}
                ListHeaderComponent={flatListHeader}
                keyExtractor={item => item.id.toString()}
                onEndReached={loadMore}
                ListFooterComponent={() => loading ? <ActivityIndicator/> : null}
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