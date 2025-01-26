import { View, Text, Image, StyleSheet, TouchableOpacity, TouchableNativeFeedback } from 'react-native';
import { Card, Avatar } from 'react-native-paper';
import { Icon } from 'react-native-paper';
import { formatTimeAgo } from '../../../../utils/TimeFormat';
import { formatPrice } from '../../../../utils/Formatter';
import { data_patch_active, myYellow, sampleAvatar } from '../../../../utils/MyValues';
import PostForRentDetail from '../../../PostDetail/PostForRentDetail';
import { useNavigation } from '@react-navigation/native';
import PostWant from './PostWant';
import PostForRent from './PostForRent';
import React from 'react';
import APIs, { endpointsDuc } from '../../../../configs/APIs';

const PostCard = ({ item, routeName, params, dataPostFav, currentUser }) => {
    const nav = useNavigation()
    const [isSave, setIsSave] = React.useState(false)
    const infoUser = item.user
    const checkPostIsFavoriteUser = (postId) => {
        if (currentUser !== null) {
            let check = dataPostFav.some(fav => fav.post.id === postId)
            if (check) return true
            else return false
        }
        return false

    }
    const handleClickSaveBtn = async () => {
        if (currentUser !== null) {
            let url = `${endpointsDuc.updateMeFavoritePost(currentUser.id, item.id)}`
            let res = await APIs.patch(url, data_patch_active(!isSave))
            if (res.data.active !== null) {
                setIsSave(res.data.active)
                console.info(isSave)

            } else {
                console.info("loi post card", res.data)

            }
        } else {
            alert("Vui lòng đăng nhập")

        }
    }
    const handleClickCommentBtn = () => {
        let params = {
            postId: item.id,
            coordinates: item.address.coordinates
        }
        if (item.type === 'PostWant') {
            let routeName = 'post_want'
            nav.navigate(routeName, params)

        } else if (item.type === 'PostForRent') {
            let routeName = 'post_for_rent'
            nav.navigate(routeName, params)
        }
    }
    React.useEffect(() => {
        if (currentUser !== null) {
            if (checkPostIsFavoriteUser(item.id) === true) {
                setIsSave(true)
            } else {
                setIsSave(false)
            }
        }
    }, [])
    return (

        <Card style={styles.card}>
            <View>
                <View style={styles.header}>
                    <Avatar.Image
                        size={40}
                        source={{ uri: item.user.avatar ? item.user.avatar : sampleAvatar }}
                    />
                    <View style={styles.userInfo}>
                        <TouchableOpacity onPress={() => nav.navigate('profile_user', { infoUser })}>
                            <View>
                                <Text style={styles.userName}
                                    numberOfLines={1}>{item.user.first_name + " " + item.user.last_name}</Text>
                            </View>
                        </TouchableOpacity>


                        <Text style={styles.timestamp} numberOfLines={1}>{formatTimeAgo(item.created_date)}</Text>
                    </View>
                </View>

                {item.type === 'PostWant' ?
                    <>
                        <PostWant item={item} routeName={'post_want'} params={{ postId: item.id, coordinates: item.address.coordinates }} />
                    </>
                    : item.type === 'PostForRent' ?
                        <>
                            <PostForRent item={item} routeName={'post_for_rent'} params={{ postId: item.id, coordinates: item.address.coordinates }} />
                        </> :
                        <>

                        </>}

                {/* Actions */}
                <View style={styles.actions}>
                    <TouchableOpacity style={styles.actionButton} onPress={handleClickCommentBtn}>
                        <Icon source="comment-outline" size={20} />
                        <Text style={styles.actionText}>Bình luận</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton} onPress={handleClickSaveBtn}>
                        {isSave === true ? (
                            <>
                                <Icon source="heart" size={20} color={myYellow} />
                                <Text style={styles.actionText}>Đã lưu</Text>
                            </>
                        ) : (
                            <>
                                <Icon source="heart-outline" size={20} color='black' />
                                <Text style={styles.actionText}>Lưu</Text>
                            </>
                        )}


                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                        <Icon source="share-variant-outline" size={20} />
                        <Text style={styles.actionText}>Chia sẻ</Text>
                    </TouchableOpacity>
                </View>
            </View>


        </Card>


    );
};

const styles = StyleSheet.create({
    card: {
        margin: 10,
        padding: 10,
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    userInfo: {
        marginLeft: 10,
    },
    userName: {
        width: '200',
        fontWeight: 'bold',
        fontSize: 16,
    },
    timestamp: {
        color: '#666',
        fontSize: 12,
    },
    locationContainer: {
        backgroundColor: '#ffe09c',
        padding: 8,
        borderRadius: 5,
        marginBottom: 10,
    },
    location: {
        color: '#000000',
    },
    description: {
        marginBottom: 10,
        lineHeight: 20,
    },
    price: {
        color: '#FF0000',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    imagesContainer: {
        flexDirection: 'row',
        height: 200,
        marginBottom: 10,
    },
    mainImage: {
        flex: 2,
        marginRight: 5,
        borderRadius: 8,
    },
    smallImagesContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    smallImage: {
        height: '48%',
        borderRadius: 8,
    },
    smallImageV2: {
        height: '100%',
        borderRadius: 8,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 10,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionText: {
        marginLeft: 5,
        color: '#666',
    },
});

export default PostCard;