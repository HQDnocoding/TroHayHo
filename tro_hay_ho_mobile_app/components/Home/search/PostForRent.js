import React, { useContext, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TouchableNativeFeedback } from 'react-native';
import { ActivityIndicator, Menu } from 'react-native-paper';
import { Entypo } from '@expo/vector-icons';
import { sampleImage, CHU_TRO, NGUOI_THUE_TRO, data_patch_is_show } from '../../../utils/MyValues'
import { formatTimeAgo } from '../../../utils/TimeFormat';
import { formatPrice } from '../../../utils/Formatter';
import { MyUserContext } from '../../../configs/UserContexts';
import APIs, { endpointsDuc } from '../../../configs/APIs';
import { useNavigation } from '@react-navigation/native';

const PostForRent = ({ item }) => {
    const nav = useNavigation()
    const handleToRote=()=>{
        if(item!==null){
            let routeName='post_for_rent' 
            let params={
                postId: item.id,
                 coordinates: item.address.coordinates }
            nav.navigate(routeName,params)
        }
    }

    return (

        <View style={styles.card} >
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: item && item.post_image && item.post_image[0] ? item.post_image[0].image : sampleImage }}
                    style={styles.image}
                    resizeMode="cover"
                />
            </View>
            <View style={styles.contentContainer}>
                <View style={styles.header}>
                    <TouchableNativeFeedback onPress={handleToRote}>
                        <View>
                            <Text style={styles.title} numberOfLines={2}>{item ? item.title : ""}</Text>
                            <Text style={styles.priceRed}>{item ? item.price : ""} đ/tháng</Text>
                            <Text style={styles.acreage}>Diện tích: {item ? item.acreage : ""} m2</Text>

                        </View>
                    </TouchableNativeFeedback>

                </View>
            </View>

        </View>


    );
};

const styles = StyleSheet.create({

    card: {
        height: 90,
        marginVertical: 10,

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

        fontSize: 15,
        fontWeight: '500',
        color: '#333',
    },
    icon: {
        backgroundColor: '#fff',

    },
    priceRed: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FF0000',
    },
    priceGreen: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#38ab1e',
    },
    acreage: {
        fontSize: 14,
        color: 'black',
    },
});

export default PostForRent;