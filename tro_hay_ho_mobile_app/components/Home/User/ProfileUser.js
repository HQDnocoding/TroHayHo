import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, FlatList, RefreshControl, TouchableNativeFeedback,TouchableOpacity } from 'react-native';
import { FontAwesome, Entypo } from '@expo/vector-icons';
import { Button } from 'react-native-paper';
import { role_id_chu_tro, sampleAvatar } from '../../../utils/MyValues';
import { ActivityIndicator } from "react-native-paper";
import { formatDate } from '../../../utils/TimeFormat';
import APIs, { endpointsDuc } from '../../../configs/APIs';
import PostForRent from '../duc/post/PostForRent';
import PostWant from '../duc/post/PostWant';
import { checkExistConversation, getUserConversations } from '../../../utils/ChatFunction';
import { MyUserContext } from '../../../configs/UserContexts';
import { useNavigation } from '@react-navigation/native';

const ProfileUser = ({ navigation, route }) => {
    const currentUser = useContext(MyUserContext)
    const params = route.params || {}
    const { infoUser } = params
    const [post, setPost] = React.useState([])
    const [loading, setLoading] = React.useState(false);
    const [page, setPage] = React.useState(1);


    const loadPost = async () => {
        if (page > 0) {
            setLoading(true)
            if (infoUser !== null) {

                try {

                    let url;
                    let res;
                    let updatePostResults
                    if (infoUser.role === role_id_chu_tro)//chu tro
                    {

                        url = `${endpointsDuc['getListPostForRentByUserId'](infoUser.id)}?page=${page}`
                        res = await APIs.get(url)
                        const postResults = res.data.results
                        updatePostResults = postResults.map((item) => {
                            return {
                                isPostWant: false,
                                ...item
                            }
                        })
                    } else {

                        //nguoi thue
                        url = `${endpointsDuc['getListPostWantByUserId'](infoUser.id)}?page=${page}`

                        res = await APIs.get(url)
                        const postResults = res.data.results
                        updatePostResults = postResults.map((item) => {
                            return {
                                isPostWant: true,
                                ...item
                            }
                        })
                    }

                    if (page > 1) {
                        setPost(prev => [...prev, ...updatePostResults])
                    } else {
                        setPost(updatePostResults)

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
    }
    const loadMore = () => {
        if (page > 0) {
            setPage(page + 1)
        }

    }
    const refresh = () => {
        setPage(1)

    }
    const handleConversation = async () => {

        if (currentUser !== null) {
        console.log("profile user",infoUser.id)

            const conversation = await checkExistConversation(currentUser.id, infoUser.id)
            // neu da ton tai cuoc tro chuyen thi di chuyen den man hinh tro chuyen
            if (conversation !== null) {
                console.log("profile usera",conversation)
                const item=conversation
                const partner=infoUser
                navigation.navigate("message", { item, currentUser, partner })
            } else {
                //tao moi cuoc tro chuyen va dan den 
            }


        } else {
            //hien thong bao dang nhap
            alert("Vui lòng đăng nhập để thực hiện hành động này")
        }
    }
    const renderItemPost = ({ item }) => {
        if (item.isPostWant === false) {
            return <PostForRent key={item.id} item={item} routeName={'post_for_rent'} params={{ postId: item.id, coordinates: item.address.coordinates }} />;
        } else if (item.isPostWant === true) {
            return <PostWant key={item.id} item={item} routeName={'post_want'} params={{ postId: item.id, coordinates: item.address.coordinates }} />;
        }

    }
    React.useEffect(() => {

        loadPost()
    }, [page])
    const headerFlatlist = () => {
        return (
            <View >
                <View style={styles.header}>
                    <Image
                        source={{ uri: infoUser.avatar ? infoUser.avatar : sampleAvatar }}
                        style={styles.avatar}
                    />

                </View>

                <View style={styles.details}>
                    <Text style={styles.name}>{infoUser.last_name} {infoUser.first_name}</Text>
                    <Text style={styles.id}>Được theo dõi : 23 | Đang theo dõi : 12</Text>
                    <View style={styles.detail}>
                        <FontAwesome name={'paw'} color="#808080" size={15} />
                        <Text style={styles.detailText}>Đã tham gia : {formatDate(infoUser.date_joined)}</Text>
                    </View>
                    <View style={styles.detail}>
                        <FontAwesome name='question-circle' color="#808080" size={15} />
                        <Text style={styles.detailText}>Chưa xác thực</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                   
                    <TouchableOpacity style={[styles.buttonFM]} >
                    <View style={[styles.buttonPositive]} labelStyle={styles.textPositive}>
                        <FontAwesome name={'bell'} color="#000000" size={20} />
                        <Text>
                            Theo dõi
                        </Text>
                    </View>
                        </TouchableOpacity>
   
    <TouchableOpacity style={[styles.buttonFM]} onPress={handleConversation}>
                        <View style={[styles.buttonPositive]} labelStyle={styles.textPositive}>
                            <FontAwesome name={'send'} color="#000000" size={15} />
                            <Text>
                                Nhắn tin
                            </Text>
                        </View>
                    </TouchableOpacity>
                   
                    <View style={styles.buttonThem}>
                        <Entypo name={'menu'} color="#000000" size={20} />

                    </View>
                </View>
            </View>
        )

    }
    return (
        <View style={styles.container}>
            <FlatList
                refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
                data={post}
                renderItem={renderItemPost}
                onEndReached={loadMore}
                ListHeaderComponent={headerFlatlist}
                ListFooterComponent={() => loading ? <ActivityIndicator /> : null}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: ' #f5f5f5',
    },
    header: {
        alignItems: 'flex-start',
        backgroundColor: 'rgb(255, 255, 255)',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        height: 150,
    },
    avatar: {
        marginStart: 20,
        marginTop: 100,
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 8,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    id: {
        fontSize: 14,
        color: '#808080',
    },
    details: {
        marginTop: 20,
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    detail: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailText: {
        fontSize: 14,
        color: '#808080',
        marginLeft: 8,
    },
    shapeButton:{
        borderRadius: 8,
    },
    buttonFM:{
        
        flex: 5,
        borderRadius: 8,
        margin: 4,
        height: 40,
    },
    buttonPositive: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: '#FFBA00',
        flex:1,
        borderRadius: 8,

    },
    buttonThem: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 4,
        width: 40,
        backgroundColor: '#FFBA00',
        borderRadius: 8,
    },
    buttonNegative: {
        borderWidth: 1,
        borderColor: '#bdbdbd'
    },
    textPositive: {
        fontSize: 14,
        color: '#000000',
    },
});

export default ProfileUser;