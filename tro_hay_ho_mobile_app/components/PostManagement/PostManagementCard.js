import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {Entypo} from '@expo/vector-icons'; // Đảm bảo bạn đã cài đặt expo/vector-icons
import {sampleImage,CHU_TRO,NGUOI_THUE_TRO} from '../../utils/MyValues'
import { formatTimeAgo } from '../../utils/TimeFormat';
import { formatPrice} from '../../utils/Formatter';

const PostManagementCard = ({item,params,routeName}) => {
    
    return (
        <TouchableOpacity style={styles.card}>
            <View style={styles.imageContainer}>
                <Image
                    source={{uri:item.user.avatar?item.user.avatar: sampleImage}}
                    style={styles.image}
                    resizeMode="cover"
                />
            </View>

            <View style={styles.contentContainer}>
                <View style={styles.header}>
                    <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                    {item.user.role.role_name ===NGUOI_THUE_TRO?(
      <Text style={styles.priceGreen}>{formatPrice(item.price_range_min)} đ -{formatPrice(item.price_range_max)} đ</Text>
                    ):(
                        <Text style={styles.priceRed}>{formatPrice(item.price)} đ</Text>

                    )}
              
                    <Text style={styles.dateTime}>{formatTimeAgo(item.created_date)}</Text>

                </View>

                <TouchableOpacity style={styles.icon}>
                    <Entypo name="dots-three-vertical" size={18} color="#666"/>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
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
      paddingHorizontal:5,
      width:'70%',
      flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    header: {
      flexDirection:'column',
      justifyContent:'space-between'
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