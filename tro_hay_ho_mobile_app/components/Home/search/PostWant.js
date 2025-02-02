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

const PostWant = ({ item }) => {
    const nav = useNavigation()
    const handleToRote=()=>{
        if(item!==null){
            let routeName='post_want' 
            let params={
                postId: item.id,
                 coordinates: item.address.coordinates }
            nav.navigate(routeName,params)
        }
    }

    return (

        <View style={styles.card} >
            <View style={styles.contentContainer}>
                <View style={styles.header}>
                    <TouchableNativeFeedback onPress={handleToRote}>
                        <View>
                            <Text style={styles.title} numberOfLines={2}>{item ? item.title : ""}</Text>
                            <Text style={styles.priceGreen}>Giá mong muốn {item ? item.price : ""} đ/tháng</Text>
                            <Text style={styles.priceMinMax}>Có thể xem xét từ:{item ? item.price_range_min : ''}-{item ? item.price_range_max : ''} đ/tháng</Text>

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
        fontSize: 15,
        fontWeight: 'bold',
        color: '#FF0000',
    },
    priceGreen: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#38ab1e',
    },
    priceMinMax: {
        fontSize: 14,
        color: 'black',
    },
});

export default PostWant;