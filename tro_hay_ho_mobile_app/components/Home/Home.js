import { View, Text, ScrollView, StyleSheet, ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import { Card, Title, Paragraph, Provider, Portal } from 'react-native-paper';
import PostForRent from "./duc/post/PostForRent";
import PostWant from "./duc/post/PostWant";
import WantPlace from "./duc/explore/WantPlace";
import Banner from "./duc/explore/Banner";
import React, { useContext } from "react";
import AddressDialog from "./duc/explore/AddressDialog";
import APIs, { endpoints, endpointsDuc } from "../../configs/APIs";
import { shuffleArray } from '../../utils/Formatter';
import { MyUserContext } from '../../configs/UserContexts';
import { getInfoPostFavoriteOfUser } from '../../utils/MyFunctions';
import PostCard from './duc/post/PostCard';


const Home = () => {
    let currentUser
    const [visibleModelAddress, setVisibleModelAddress] = React.useState(false)

    const [postWant, setPostWant] = React.useState([])
    const [postForRent, setPostForRent] = React.useState([])
    const [loading, setLoading] = React.useState(false);
    const [pageWant, setPageWant] = React.useState(1);
    const [pageForRent, setPageForRent] = React.useState(1);
    const [allPosts, setAllPosts] = React.useState([]);
    const [postFav, setPostFav] = React.useState([]);


    const loadCurrentUser = () => {
        currentUser = useContext(MyUserContext)

    }
    loadCurrentUser()
    const loadPostWant = async () => {

        if (pageWant > 0) {
            setLoading(true)
            try {
                let url = `${endpointsDuc.getListPostWantShow}?page=${pageWant}`
                let res = await APIs.get(url)

                const newPosts = res.data.results.map(post => ({ ...post, type: 'PostWant' }));
                // setAllPosts(prevPosts => [...prevPosts, ...newPosts]);
                setAllPosts(prev => {
                    const existingIds = new Set(prev.map(post => post.id))
                    const filteredPosts = newPosts.filter(post => !existingIds.has(post.id))
                    return [...prev, ...filteredPosts]
                })
                if (res.data.next === null) {
                    setPageWant(0)
                }
            } catch (error) {
                if (error) {
                    // Xử lý lỗi 404: Dừng việc tăng giá trị pageWant
                    setPageWant(0);
               
                    console.warn("Error loading posts want:", error, " == at page: ", pageWant);
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
                let url = `${endpointsDuc.getListPostForRentShow}?page=${pageForRent}`
                let res = await APIs.get(url)
                const newPosts = res.data.results.map(post => ({ ...post, type: 'PostForRent' }));
                // xu ly trung lap du lieu
                setAllPosts(prev => {
                    const existingIds = new Set(prev.map(post => post.id))
                    const filteredPosts = newPosts.filter(post => !existingIds.has(post.id))
                    return [...prev, ...filteredPosts]
                })
                if (res.data.next === null) {
                    setPageForRent(0)
                }
            } catch (error) {
                if (error) {
                    // Xử lý lỗi 404: Dừng việc tăng giá trị pageForRent
                    setPageForRent(0);
                
                    console.warn("Error loading posts for rent:", error, " == at page: ", pageForRent);
                }
            } finally {
                setLoading(false)

            }
        }
    }
    const loadInfoFavoriteOfCurrentUser = async () => {
        if (currentUser !== null) {
            try {
                let data = await getInfoPostFavoriteOfUser(currentUser.id)
                setPostFav(data)
            } catch (error) {
                console.warn("Error loading info favorite of current user:", error);
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
        if (currentUser !== null) {
            loadInfoFavoriteOfCurrentUser()
        }
        loadPostForRent()
    }, [pageForRent])

    React.useEffect(() => {
        if (currentUser !== null) {
            loadInfoFavoriteOfCurrentUser()
        }
        loadPostWant()
    }, [pageWant])


    const renderItemPost = ({ item }) => {
        return (
            <PostCard key={item.id} item={item} dataPostFav={postFav} currentUser={currentUser} />

        )

    }
    const flatListHeader = () => {
        return (
            <>
                {/* <Banner/>
                <WantPlace openDialog={showModel}/> */}

            </>
        )
    }



    return (
        <View style={styles.container}>

            
                <FlatList
                    refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
                    data={allPosts}
                    renderItem={renderItemPost}
                    keyExtractor={item => `${item.type}-${item.id}-${Date.now()}`}
                    onEndReached={loadMore}
                    ListFooterComponent={() => loading ? <ActivityIndicator /> : null}
                />
                <AddressDialog visible={visibleModelAddress} onClose={hideModel} />

           


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