import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Avatar } from 'react-native-paper';
import { Icon } from 'react-native-paper';
import { formatTimeAgo } from '../../../../utils/TimeFormat';
import { formatPrice, shuffleArray } from '../../../../utils/Formatter';
import { sampleAvatar } from '../../../../utils/MyValues';
import { useNavigation } from '@react-navigation/native';

const PostWant = ({ item, routeName, params }) => {

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


                        <Text style={styles.price} numberOfLines={1}>
                            Từ {formatPrice(item.price_range_min)} đ/ tháng </Text>
                        <Text style={styles.price} numberOfLines={1}>
                            Đến {formatPrice(item.price_range_max)} đ/ tháng
                        </Text>
                    </View>

                </TouchableOpacity>


            
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
        color: '#3eaf00',
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

export default PostWant;