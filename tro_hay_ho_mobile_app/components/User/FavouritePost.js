import { useContext, useEffect, useState } from "react"
import APIs, { authAPIs, endpoints, endpointsDuc } from "../../configs/APIs";
import { ActivityIndicator, FlatList, Image, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Divider, Icon } from "react-native-paper";
import { MyUserContext } from "../../configs/UserContexts";



const FavouritePost = () => {

    const [favPosts, setFavPosts] = useState([]);
    const [postInfor, setPostInfor] = useState([])
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);


    const loadFavPosts = async () => {
        if (page > 0) {
            setLoading(true);
            try {
                const token = await AsyncStorage.getItem("access_token");
                const res = await authAPIs(token).get(`${endpoints['favourite-posts']}?page=${page}`);
                if (page > 1)
                    setFavPosts(current => [...current, ...res.data.results])
                else
                    setFavPosts(res.data.results);

                if (res.data.next === null)
                    setPage(0);

            } catch (ex) {
                console.error(ex)
            } finally {

                setLoading(false);
            }
        }

    };



    const refresh = () => {
        setPage(1);
        loadFavPosts();
    };

    const loadMore = () => {
        if (page > 0 && !loading) {
            setPage(page + 1);
        }
    };
    const [isSave, setIsSave] = useState(false)

    const currentUser = useContext(MyUserContext);


    useEffect(() => {
        loadFavPosts();

        console.log("fp", favPosts);
    }, [page]);

    const render = ({ item }) => {
        if (item.post.post_image.length === 0) {
            return (<View style={{ flexDirection: 'row', marginBottom: 10, paddingStart: 10 }}>
                <Image source={require('../../assets/45_donald_trump.png')} style={{ width: 100, height: 100 }} />
                <View style={{ marginLeft: 20 }}>
                    <View >
                        <Text style={{ fontSize: 20, fontWeight: 800 }}>{item.post.title}</Text>

                        <TouchableOpacity>
                            <Icon size={27} source="heart-outline"/>
                        </TouchableOpacity>

                    </View>
                    <Text style={{ color: 'red', fontSize: 10 }}>{item.post.price} VNĐ</Text>
                    <Text style={{ fontSize: 10, marginTop: 10 }}>{item.post.description}</Text>
                </View>
            </View>
            )
        } else {
            return (<View>
                <View style={{ flexDirection: 'row', marginBottom: 10, paddingStart: 10 }}>
                    <Image source={{ uri: item.post.post_image[0].image }}
                        style={{ width: 100, height: 100 }} />
                    <View style={{ marginLeft: 20 }}>
                        <View >
                            <Text style={{ fontSize: 20, fontWeight: 800 }}>{item.post.title}</Text>

                            <TouchableOpacity>
                                <Icon size={27} source="cards-heart-outline" />
                            </TouchableOpacity>

                        </View>
                        <Text style={{ color: 'red', fontSize: 10 }}>{item.post.price} VNĐ</Text>
                        <Text style={{ fontSize: 10, marginTop: 10 }}>{item.post.description}</Text>
                    </View>

                </View>
            </View>

            )
        }
    }



    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={favPosts}
                renderItem={render}
                keyExtractor={(item) => item.id.toString()}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={loading && <ActivityIndicator />}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
            />
        </View>
    )

};

export default FavouritePost;