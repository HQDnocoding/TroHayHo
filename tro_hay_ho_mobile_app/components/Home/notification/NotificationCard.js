
import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {Entypo} from '@expo/vector-icons'; 
import { formatTimeAgo } from '../../../utils/TimeFormat';
import {sampleAvatar} from '../../../utils/MyValues';


const NotificationCard = ({item, routeName, params}) => {
    return (
        <View style={styles.card}>
            <View style={styles.imageContainer}>
                <Image
                    source={{uri: item.sender.avatar ?item.sender.avatar:sampleAvatar}}
                    style={styles.image}
                    resizeMode="cover"
                />
            </View>

            <View style={styles.contentContainer}>
                <View style={styles.header}>
                    <TouchableOpacity>
                    <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                    <Text style={styles.content} numberOfLines={2}>{item.content}</Text>
                    </TouchableOpacity>
                    <Text style={styles.dateTime}>{formatTimeAgo(item.created_date)}</Text>

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
        width: '50',
        height: '50',
        borderColor:'black',
        borderWidth:1,
        borderRadius:100,
        overflow: 'hidden',
    },
    image: {
        width: '50',
        height: '50',
        objectFit: 'cover'
    },
    contentContainer: {
        flex:8,

      paddingHorizontal:5,
      width:'75%',
      flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    header: {
      flexDirection:'column',
      justifyContent:'space-between',
      flex:11,
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
        flex:1,
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