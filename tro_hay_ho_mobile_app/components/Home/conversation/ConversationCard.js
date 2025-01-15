

import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {Entypo} from '@expo/vector-icons'; // Đảm bảo bạn đã cài đặt expo/vector-icons
import { sampleAvatar } from '../../../utils/MyValues';
import { formatTimeAgo } from '../../../utils/TimeFormat';
const ConversationCard = ({item,params,routeName}) => {
    let partner;
    let currentUser={
        'id':2,
        'role':2,
        'username':'duc'
    }
    //phan loai dau la nguoi muon nhan
    if(item.user1.username===currentUser.username){
        partner=item.user2
    }else{
        partner=item.user1
    }
    return (

        <View style={styles.card}>
            <View style={styles.imageContainer}>
                <Image
                    source={{uri: partner.avatar ?partner.avatar :sampleAvatar}}
                    style={styles.image}
                    resizeMode="cover"
                />
            </View>

            <View style={styles.contentContainer}>
                <View style={styles.header}>
                    <TouchableOpacity>
                    <Text style={styles.title} numberOfLines={1}>{partner.last_name} {partner.first_name}</Text>
                        {item.latest_message ?(
                            <Text numberOfLines={1}>{item.latest_message.content}</Text>
                        ):(
                            <Text>Chưa có tin nhắn</Text>
                        )}
                        

                    </TouchableOpacity>
                    <Text style={styles.dateTime}>{formatTimeAgo(item.updated_date)}</Text>

                </View>

                <TouchableOpacity style={styles.icon}>
                    <Entypo name="dots-three-vertical" size={18} color="#666"/>
                </TouchableOpacity>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    card: {
        height: 90,
        backgroundColor: '#fff',
        borderStyle:"solid",
        borderBottomWidth:1,
        borderBottomColor:'#e0e0e0',

        flexDirection: 'row',
        alignItems:'center',
    },
    imageContainer: {
        margin:10,
        width: 50,
        height: 50,
        borderRadius:100,
        overflow: 'hidden',
    },
    image: {
        width: '90',
        height: '90',
        objectFit: 'cover'
    },
    contentContainer: {
      paddingHorizontal:5,
      width:'75%',
      flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    header: {
      flexDirection:'column',
      justifyContent:'space-between'
    },
    title: {

        fontSize: 15,

        fontWeight: '700',
        color: '#333',
    },
    icon: {
    },
    price: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#FF0000',
    },
    dateTime: {
        fontSize: 11,
        color: '#666',
    },
});

export default ConversationCard;