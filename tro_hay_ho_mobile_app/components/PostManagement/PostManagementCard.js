import React, { useContext, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TouchableNativeFeedback } from 'react-native';
import { ActivityIndicator, Menu } from 'react-native-paper';
import { Entypo } from '@expo/vector-icons'; // Đảm bảo bạn đã cài đặt expo/vector-icons
import { sampleImage, CHU_TRO, NGUOI_THUE_TRO, data_patch_is_show } from '../../utils/MyValues'
import { formatTimeAgo } from '../../utils/TimeFormat';
import { formatPrice } from '../../utils/Formatter';
import { MyUserContext } from '../../configs/UserContexts';
import APIs, { endpointsDuc } from '../../configs/APIs';

const PostManagementCard = ({ item, params, routeName, onUpdateList, type }) => {

    const currentUser = useContext(MyUserContext)
    const [post, setPost] = useState(null)
    const [menuVisible, setMenuVisible] = useState(false);
    const [loading, setLoading] = useState(false)
    const handleDelete = async () => {
        if (currentUser !== null) {
            setLoading(true)
            try {
                const response = await APIs.delete(endpointsDuc.deleteSoftPost(currentUser.id, item.id))
                if (response.data.active !== null) {
                    console.log("xoa", response.data)
                    if (onUpdateList) onUpdateList()
                }
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }


        }

        setMenuVisible(false);
    };

    const handleHide = async () => {
        if (currentUser !== null) {
            setLoading(true)
            try {
                const response = await APIs.patch(endpointsDuc.updateShowPost(currentUser.id, item.id), data_patch_is_show(false))
                if (response.data.is_show !== null) {
                    console.log("ẩn ", response.data)
                    if (onUpdateList) onUpdateList()
                }
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }


        }

        setMenuVisible(false);
    }
    const handleShow = async () => {
        if (currentUser !== null) {
            setLoading(true)
            try {
                const response = await APIs.patch(endpointsDuc.updateShowPost(currentUser.id, item.id), data_patch_is_show(true))
                if (response.data.is_show !== null) {
                    console.log("hiện", response.data)
                    if (onUpdateList) onUpdateList()
                }
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }


        }

        setMenuVisible(false);
    }
    const loadPost = async () => {
        if (currentUser !== null) {
            const res = await APIs.get(endpointsDuc.getPostParent(item.id))
            if (res.data) {
                setPost(res.data)
            }
        }
    }
    React.useEffect(() => {
        if (item.id !== null && currentUser !== null) {
            loadPost()
        }
    }, [])
    return (

        <View style={styles.card} >
            {item.isPostWant === true ? (
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: item.user.avatar ? item.user.avatar : sampleImage }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                </View>
            ) : (
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: item.post_image ? item.post_image[0].image : sampleImage }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                </View>

            )}


            <View style={styles.contentContainer}>
                <View style={styles.header}>
                    <TouchableNativeFeedback >
                        <View>
                            <Text style={styles.title} numberOfLines={2}>{item.title}</Text>

                        </View>
                    </TouchableNativeFeedback>

                    {item.isPostWant === true ? (
                        <Text style={styles.priceGreen}>{formatPrice(item.price_range_min)} đ -{formatPrice(item.price_range_max)} đ</Text>
                    ) : (
                        <Text style={styles.priceRed}>{formatPrice(item.price)} đ</Text>

                    )}

                    <Text style={styles.dateTime}>{formatTimeAgo(item.created_date)}</Text>

                </View>
                <View style={{ flex: 1 }}>
                    {loading === false ? <>
                        <Menu
                            contentStyle={styles.icon}
                            visible={menuVisible}
                            onDismiss={() => setMenuVisible(false)}
                            anchor={
                                <TouchableOpacity
                                    style={styles.icon}
                                    onPress={() => setMenuVisible(true)}
                                >
                                    <Entypo name="dots-three-vertical" size={18} color="#666" />
                                </TouchableOpacity>
                            }
                        >
                            <Menu.Item
                                onPress={handleDelete}
                                title="Xóa bài"
                                leadingIcon="delete"
                            />
                            {type === "hide" ?

                                <Menu.Item
                                    onPress={handleShow}
                                    title="Hiện bài"
                                    leadingIcon="eye"
                                />
                                :
                                <Menu.Item
                                    onPress={handleHide}
                                    title="Ẩn bài"
                                    leadingIcon="eye-off"
                                />
                            }


                        </Menu>
                    </> :
                        <>
                            <ActivityIndicator animating={loading} />
                        </>}

                </View>

            </View>

        </View>


    );
};

const styles = StyleSheet.create({

    card: {
        height: 90,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginHorizontal: 8,
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        flexDirection: 'row',
    },
    imageContainer: {
        width: 90,
        height: 90,
        borderTopLeftRadius: 8,
        borderBottomStartRadius: 8,
        overflow: 'hidden',
    },
    image: {
        width: '90',
        height: '90',
        objectFit: 'cover'
    },
    contentContainer: {
        paddingHorizontal: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
    },
    header: {
        flex: 8,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    title: {

        fontSize: 13,
        fontWeight: '500',
        color: '#333',
    },
    icon: {
        backgroundColor: '#fff',

    },
    priceRed: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#FF0000',
    },
    priceGreen: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#38ab1e',
    },
    dateTime: {
        fontSize: 10,
        color: '#666',
    },
});

export default PostManagementCard;