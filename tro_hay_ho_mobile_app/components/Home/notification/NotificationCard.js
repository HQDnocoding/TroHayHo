
import React, { useContext, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { formatTimeAgo } from '../../../utils/TimeFormat';
import { data_patch_is_read, sampleAvatar } from '../../../utils/MyValues';
import { useNavigation } from '@react-navigation/native';
import APIs, { endpointsDuc } from '../../../configs/APIs';
import { MyUserContext } from '../../../configs/UserContexts';


const NotificationCard = ({ item }) => {
    const nav = useNavigation()
    const currentUser = useContext(MyUserContext)
    const [post, setPost] = useState(null)
    const [detailNoti, setDetailNoti] = useState({is_read:false})
    const [isRead, setIsRead] = useState(false)
    const loadPost = async () => {
        if (currentUser !== null) {
            const res = await APIs.get(endpointsDuc.getPostParent(item.id))
            if (res.data) {
                setPost(res.data)
                
            }
        }
    }
    const loadDetail = async () => {
        if (currentUser !== null) {
            const res = await APIs.get(endpointsDuc.getDetailNotification(item.id))
            if (res.data.id!==null) {
                setDetailNoti(res.data)
                setIsRead(res.data.is_read)
            }
        }
    }
    const handleClickNoti = async () => {
        if (post !== null && detailNoti !== null) {
            let routeName;
            let params = {
                postId: post.id,
                coordinates: post.address.coordinates
            }
            if (post.type === "PostWant") {
                routeName = "post_want"
            } else if (post.type === 'PostForRent') {
                routeName = "post_for_rent"
            }
            if (detailNoti.is_read===true) {
                //da doc
                nav.navigate(routeName, params)

            } else if(detailNoti.is_read===false) {
                //chua doc
                let res = await APIs.patch(endpointsDuc.updateDetailNotification(currentUser.id, post.id), data_patch_is_read(true))
                if (res.data.is_read !== null) {
                    nav.navigate(routeName, params)
                    setIsRead(res.data.is_read)
                }
            }



        }

    }
    React.useEffect(() => {
        if (item.id !== null && currentUser !== null) {
            loadPost()
            loadDetail()
        }
    }, [])
    console.info('noti a', post)
    console.info('noti b', detailNoti)

    return (
        <View style={isRead === true ? styles.card : styles.cardRead}>
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: item.notification.sender.avatar ? item.notification.sender.avatar : sampleAvatar }}
                    style={styles.image}
                    resizeMode="cover"
                />
            </View>

            <View style={styles.contentContainer}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleClickNoti}>
                        <Text style={styles.title} numberOfLines={2}>{item.notification.title}</Text>
                        <Text style={styles.content} numberOfLines={2}>{item.notification.content}</Text>
                    </TouchableOpacity>
                    <Text style={styles.dateTime}>{formatTimeAgo(item.created_date)}</Text>

                </View>

                <TouchableOpacity style={styles.icon}>
                    <Entypo name="dots-three-vertical" size={18} color="#666" />
                </TouchableOpacity>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    card: {
        height: 90,
        backgroundColor: '#fff',
        borderStyle: "solid",
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',

        flexDirection: 'row',
        alignItems: 'center',
    },
    cardRead: {
        height: 90,
        backgroundColor: 'rgb(255, 235, 188)',
        borderStyle: "solid",
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',

        flexDirection: 'row',
        alignItems: 'center',
    },
    imageContainer: {

        margin: 10,
        width: '50',
        height: '50',

        borderRadius: 100,
        overflow: 'hidden',
    },
    image: {
        width: '50',
        height: '50',
        objectFit: 'cover'
    },
    contentContainer: {
        flex: 8,

        paddingHorizontal: 5,
        width: '75%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        flex: 11,
    },
    title: {

        fontSize: 13,
        fontWeight: '700',
        color: '#333',
    },
    content: {

        fontSize: 13,
        fontWeight: '500',
        color: '#333',
    },
    icon: {
        flex: 1,
    },
    price: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#FF0000',
    },
    dateTime: {
        fontSize: 10,
        color: '#666',
    },
});

export default NotificationCard;