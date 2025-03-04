import { View, Text, Image, StyleSheet, TouchableOpacity,TouchableNativeFeedback } from 'react-native';
import { Card, Avatar } from 'react-native-paper';
import { Icon } from 'react-native-paper';
import { formatTimeAgo } from '../../../../utils/TimeFormat';
import { formatPrice } from '../../../../utils/Formatter';
import { sampleAvatar } from '../../../../utils/MyValues';
import PostForRentDetail from '../../../PostDetail/PostForRentDetail';
import { useNavigation } from '@react-navigation/native';

const PostForRent = ({ item, routeName, params }) => {
    console.info(item.post_image.length)
    const nav = useNavigation()
    const infoUser=item.user
    return (

            <View>
             
                <TouchableOpacity activeOpacity={1} onPress={() => nav.navigate(routeName, params)}>
                    <View>
                        {/* Location */}
                        <View style={styles.locationContainer}>
                            <Text style={styles.location} numberOfLines={2}>{
                                item.address.specified_address + ', ' +
                                item.address.ward.full_name + ', ' +
                                item.address.district.full_name + ', ' +
                                item.address.province.full_name
                            }</Text>
                        </View>

                        {/* title */}
                        <Text style={styles.description} numberOfLines={5}>
                            {item.title}
                        </Text>

                        {/* Price */}
                        <Text style={styles.price}>{formatPrice(item.price) + ' đ/ tháng'}</Text>
                    </View>

                </TouchableOpacity>

                {item.post_image.length >= 1 && (
                    <View style={styles.imagesContainer}>
                        <Image
                            source={{ uri: item.post_image[0].image }}

                            style={styles.mainImage}
                        />
                        {item.post_image.length === 2 && (
                            <View style={styles.smallImagesContainer}>
                                <Image
                                    source={{ uri: item.post_image[1].image }}

                                    style={styles.smallImageV2}
                                />

                            </View>
                        )}
                        {item.post_image.length >= 3 && (
                            <View style={styles.smallImagesContainer}>
                                <Image
                                    source={{ uri: item.post_image[1].image }}

                                    style={styles.smallImage}
                                />
                                <Image
                                    source={{ uri: item.post_image[2].image }}

                                    style={styles.smallImage}
                                />
                            </View>
                        )}
                    </View>
                )}

          
            </View>




    );
};

const styles = StyleSheet.create({
    card: {
        margin: 10,
        padding: 10,
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    userInfo: {
        marginLeft: 10,
    },
    userName: {
        width: '200',
        fontWeight: 'bold',
        fontSize: 16,
    },
    timestamp: {
        color: '#666',
        fontSize: 12,
    },
    locationContainer: {
        backgroundColor: '#ffe09c',
        padding: 8,
        borderRadius: 5,
        marginBottom: 10,
    },
    location: {
        color: '#000000',
    },
    description: {
        marginBottom: 10,
        lineHeight: 20,
    },
    price: {
        color: '#FF0000',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    imagesContainer: {
        flexDirection: 'row',
        height: 200,
        marginBottom: 10,
    },
    mainImage: {
        flex: 2,
        marginRight: 5,
        borderRadius: 8,
    },
    smallImagesContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    smallImage: {
        height: '48%',
        borderRadius: 8,
    },
    smallImageV2: {
        height: '100%',
        borderRadius: 8,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 10,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionText: {
        marginLeft: 5,
        color: '#666',
    },
});

export default PostForRent;