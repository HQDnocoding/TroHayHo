import React, { useContext, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TouchableNativeFeedback } from 'react-native';
import { ActivityIndicator, Menu } from 'react-native-paper';
import { Entypo } from '@expo/vector-icons';
import { sampleImage, CHU_TRO, NGUOI_THUE_TRO, data_patch_is_show } from '../../../utils/MyValues'
import { formatTimeAgo } from '../../../utils/TimeFormat';
import { formatPrice } from '../../../utils/Formatter';
import { MyUserContext } from '../../../configs/UserContexts';
import APIs, { endpointsDuc } from '../../../configs/APIs';

const PostWant = ({ item }) => {

    const [post, setPost] = useState(null)



    const loadPost = async () => {
        // const res = await APIs.get(endpointsDuc.getPostParent(item.id))
        // if (res.data) {
        //     setPost(res.data)
        // }
    }
    React.useEffect(() => {
        // if (item.id !== null && currentUser !== null) {
        //     loadPost()
        // }
    }, [])
    return (

        <View style={styles.card} >
            <View style={styles.contentContainer}>
                <View style={styles.header}>
                    <TouchableNativeFeedback >
                        <View>
                            <Text style={styles.title} numberOfLines={2}>tieu de</Text>

                        </View>
                    </TouchableNativeFeedback>
                    <Text style={styles.priceGreen}>gia</Text>
                    <Text style={styles.dateTime}>gio</Text>
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

export default PostWant;