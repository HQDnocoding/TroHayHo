import React, { useContext, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TouchableNativeFeedback } from 'react-native';
import { Entypo } from '@expo/vector-icons'; // Đảm bảo bạn đã cài đặt expo/vector-icons
import { sampleImage, CHU_TRO, NGUOI_THUE_TRO } from '../../utils/MyValues'
import { formatTimeAgo } from '../../utils/TimeFormat';
import { formatPrice } from '../../utils/Formatter';
import { MyUserContext } from '../../configs/UserContexts';
import APIs, { endpointsDuc } from '../../configs/APIs';

const PostManagementCard = ({ item, params, routeName }) => {

    console.log("post manager card",item)
    const currentUser=useContext(MyUserContext)
    const [post,setPost]=useState(null)
    const loadPost=async()=>{
        if(currentUser!==null){
            const res= await APIs.get(endpointsDuc.getPostParent(item.id))
            if(res.data){
                setPost(res.data)
            }
        }
    }
    React.useEffect(()=>{
        if(item.id!==null &&currentUser!==null){
            loadPost()
        }
    },[])
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
                    <TouchableOpacity style={styles.icon}>
                        <View>
                            <Entypo name="dots-three-vertical" size={18} color="#666" />

                        </View>
                    </TouchableOpacity>
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