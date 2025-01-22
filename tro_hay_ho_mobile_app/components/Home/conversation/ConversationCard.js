

import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons'; // Đảm bảo bạn đã cài đặt expo/vector-icons
import { sampleAvatar } from '../../../utils/MyValues';
import { formatTimeAgo } from '../../../utils/TimeFormat';
import { useNavigation } from "@react-navigation/native";
import APIs, { endpoints, endpointsDuc } from '../../../configs/APIs';
const ConversationCard = ({ item,currentUser ,params, routeName }) => {
    const nav = useNavigation()
    const [partner, setPartner] = React.useState({})
    let partnerId;
    //phan loai dau la nguoi muon nhan
    if (item["participants"]["user_1"] === currentUser.id) {
        partnerId = item["participants"]["user_2"]
    } else {
        partnerId = item["participants"]["user_1"]
    }
    const loadPartner = async () => {

        const res = await APIs.get(endpointsDuc['getBasicUserInfoByUserId'](partnerId))

        setPartner(res.data)
    }
    React.useEffect(() => {
        //lay thong tin partner
        loadPartner()
    }, [])
    return (

        <View style={styles.card}>

            <Image
                source={{ uri: partner.avatar ? partner.avatar : sampleAvatar }}
                style={styles.image}
                resizeMode="cover"
            />


            <View style={styles.contentContainer}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => nav.navigate(routeName, { item, currentUser ,partner})}>
                        <Text style={styles.title} numberOfLines={1}>{partner.last_name} {partner.first_name}</Text>
                        {item.last_message ? (
                            <Text numberOfLines={1}>{item.last_message.text}</Text>
                        ) : (
                            <Text>Chưa có tin nhắn</Text>
                        )}


                    </TouchableOpacity>
                    <Text style={styles.dateTime}>{formatTimeAgo(item.updated_at)}</Text>

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
    imageContainer: {
        margin: 10,
        width: 50,
        height: 50,
        borderRadius: 100,
        overflow: 'hidden',
    },
    image: {
        width: '50',
        height: '50',
        objectFit: 'cover',
        borderRadius: 50,
        margin: 10,


    },
    contentContainer: {
        paddingHorizontal: 5,
        flex:1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    header: {
        flex:1,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    title: {

        fontSize: 15,

        fontWeight: '700',
        color: '#333',
    },
    icon: {
        margin:10,
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