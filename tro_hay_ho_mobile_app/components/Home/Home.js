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
    let currentUser = useContext(MyUserContext)


    const [loading, setLoading] = React.useState(false);
    const [page, setPage] = React.useState(1);
    const [allPosts, setAllPosts] = React.useState([]);
    const [postFav, setPostFav] = React.useState([]);


   
    const loadPost = async () => {

        if (page > 0) {
            setLoading(true)
            try {
                let url = `${endpointsDuc.getListPostParent}?page=${page}`
                let res = await APIs.get(url)

                const newPosts = res.data.results
                if(page===1){
                    setAllPosts(newPosts)
                }else{
                    setAllPosts(prev => {
                        const existingIds = new Set(prev.map(post => post.id))
                        const filteredPosts = newPosts.filter(post => !existingIds.has(post.id))
                        return [...prev, ...filteredPosts]
                    })
                }
                
                if (res.data.next === null) {
                    setPage(0)
                }
            } catch (error) {
                if (error) {
                    // Xử lý lỗi 404: Dừng việc tăng giá trị pageWant
                    setPage(0);
               
                    console.warn("Error loading posts :", error, " == at page: ", page);
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

    const loadMore = () => {
        if (page > 0) {
            setPage(page + 1)
        }
       
    }

    const refresh = () => {
        setPage(1)

    }


    React.useEffect(() => {
        if (currentUser !== null) {
            loadInfoFavoriteOfCurrentUser()
        }
        loadPost()
    }, [page])


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