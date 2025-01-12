

import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {Entypo} from '@expo/vector-icons'; // Đảm bảo bạn đã cài đặt expo/vector-icons

const MessageCard = ({data}) => {
    return (
        <View style={styles.card}>
            <View style={styles.imageContainer}>
                <Image
                    source={{uri: "https://img.freepik.com/free-vector/night-landscape-with-lake-mountains-trees-coast-vector-cartoon-illustration-nature-scene-with-coniferous-forest-river-shore-rocks-moon-stars-dark-sky_107791-8253.jpg"}}
                    style={styles.image}
                    resizeMode="cover"
                />
            </View>

            <View style={styles.contentContainer}>
                <View style={styles.header}>
                    <TouchableOpacity>
                    <Text style={styles.title} numberOfLines={2}>Nguyễn Văn B</Text>
                        <Text>Hello , đã có chuyện gì xảy ra vây</Text>

                    </TouchableOpacity>
                    <Text style={styles.dateTime}>17:25 01-12-2024</Text>

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

export default MessageCard;