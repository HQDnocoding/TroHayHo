import { View, Text, Image, StyleSheet, TouchableOpacity, TouchableNativeFeedback, ActivityIndicator } from 'react-native';
import { Card, Avatar } from 'react-native-paper';
import { Icon } from 'react-native-paper';
import { formatTimeAgo } from '../../../../utils/TimeFormat';
import { formatPrice } from '../../../../utils/Formatter';
import { getFullName } from '../../../../utils/MyFunctions';
import { data_patch_active, myYellow, POST_FOR_RENT, POST_WANT, sampleAvatar } from '../../../../utils/MyValues';
import PostForRentDetail from '../../../PostDetail/PostForRentDetail';
import { useNavigation } from '@react-navigation/native';
import PostWant from './PostWant';
import PostForRent from './PostForRent';
import React, { useState } from 'react';
import APIs, { endpointsDuc } from '../../../../configs/APIs';
import { useRequestLoginDialog } from '../../../../utils/RequestLoginDialogContext';
import { useBottomSendToFollowedContext } from '../../../../utils/BottomSendToFollowedContext';

const PostCard = ({ item, routeName, params, dataPostFav, currentUser }) => {

    const nav = useNavigation()
    const { showDialog } = useRequestLoginDialog()
    const { openBottomSheet, assignPost } = useBottomSendToFollowedContext();
    const [post, setPost] = useState(null)
    const [isSave, setIsSave] = React.useState(false)
    const [infoUser, setInfoUser] = React.useState(null)
    const [isLoadingPost, setIsLoadingPost] = useState(true)
    const [isLoadingUser, setIsLoadingUser] = useState(true)


    


    const loadUser = async () => {
        try {
            setIsLoadingUser(true)
            const res = await APIs.get(endpointsDuc.getBasicUserInfoByUserId(item.user))
            if (res.data) {
                setInfoUser(res.data)
            }
        } catch (error) {
            console.warn("load user", error)
        } finally {
            setIsLoadingUser(false)
        }
    }

    const loadPost = async () => {
        try {
            setIsLoadingPost(true)
            const res = await APIs.get(endpointsDuc.getPostParent(item.id))
            if (res.data) {
                setPost(res.data)
            }
        } catch (error) {
            console.warn("load post", error)
        } finally {
            setIsLoadingPost(false)
        }
    }
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
            showDialog()

        }
    }
    const handleClickCommentBtn = () => {
        if (post) {
            let params = {
                postId: item.id,
                coordinates: item.address.coordinates
            }
            if (post?.type.toLowerCase() === POST_WANT) {
                let routeName = 'post_want'
                nav.navigate(routeName, params)

            } else if (post?.type.toLowerCase() === POST_FOR_RENT) {
                let routeName = 'post_for_rent'
                nav.navigate(routeName, params)
            }
        }

    }
    const handleOpenBottomSheet = () => {
        if (currentUser) {
            assignPost(post)
            openBottomSheet()

        } else {
            showDialog()
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
        loadPost()
        loadUser()
    }, [])
    return (

        <Card style={styles.card}>
            <View>
                {isLoadingUser ? (
                    <View style={styles.header}>
                        <View style={[styles.skeleton, styles.avatarSkeleton]} />
                        <View style={styles.userInfo}>
                            <View style={[styles.skeleton, styles.nameSkeleton]} />
                            <View style={[styles.skeleton, styles.timestampSkeleton]} />
                        </View>
                    </View>
                ) : infoUser && (
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => nav.navigate('profile_user', { infoUser })}>
                            <Avatar.Image
                                size={40}
                                source={{ uri: infoUser.avatar ? infoUser.avatar : sampleAvatar }}
                            />
                        </TouchableOpacity>
                        <View style={styles.userInfo}>
                            <TouchableOpacity onPress={() => nav.navigate('profile_user', { infoUser })}>
                                <Text style={styles.userName} numberOfLines={1}>
                                    {getFullName(infoUser.last_name, infoUser.first_name)}
                                </Text>
                            </TouchableOpacity>
                            <Text style={styles.timestamp} numberOfLines={1}>
                                {formatTimeAgo(item.created_date)}
                            </Text>
                        </View>
                    </View>
                )}

                {isLoadingPost ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={myYellow} />
                    </View>
                ) : post && <>
                    {post?.type.toLowerCase() === POST_WANT ?
                        <>
                            <PostWant item={post} routeName={'post_want'} params={{ postId: post.id, coordinates: post.address.coordinates }} />
                        </>
                        : post?.type.toLowerCase() === POST_FOR_RENT ?
                            <>
                                <PostForRent item={post} routeName={'post_for_rent'} params={{ postId: post.id, coordinates: post.address.coordinates }} />
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
                        <TouchableOpacity style={styles.actionButton} onPress={handleOpenBottomSheet}>
                            <Icon source="share-variant-outline" size={20} />
                            <Text style={styles.actionText}>Chia sẻ</Text>
                        </TouchableOpacity>
                    </View>

                </>}


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
    skeleton: {
        backgroundColor: '#E1E9EE',
        borderRadius: 4,
    },
    avatarSkeleton: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    nameSkeleton: {
        width: 150,
        height: 16,
        marginBottom: 5,
    },
    timestampSkeleton: {
        width: 100,
        height: 12,
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
});

export default PostCard;