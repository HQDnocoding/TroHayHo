import { useEffect, useState } from "react";
import PostImage from "./PostImages";
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import APIs, { endpoints } from "../../configs/APIs";
import { ActivityIndicator, Avatar, Button, Card, Divider, Icon, IconButton } from "react-native-paper";
import moment from "moment";
import 'moment/locale/vi';
import MapView, { Circle, Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import CommentScreen from "./CommentPostWant";

moment.locale('vi');


const PostForRentDetail = ({ route }) => {
    const id = route.params.postId;
    const [post, setPost] = useState(null);


    console.log("lll", route.params.coordinates)
    const [latitude, longitude] = route.params?.coordinates.split(", ").map(Number);
    const [centerCoordinates, setCenterCoordinates] = useState({
        latitude: latitude,
        longitude: longitude,
    });

    const loadPost = async () => {
        try {
            let res = await APIs.get(endpoints["post-for-rent-detail"](id));
            if (res && res.data) {
                setPost(res.data);
            } else {
                console.error("API did not return data");
            }
        } catch (error) {
            console.error("Error loading post:", error);
        }
    };

    useEffect(() => {
        loadPost();
    }, [id]);


    return (
        <View style={styles.mainContainer}>
            <ScrollView contentContainerStyle={styles.scrollContainer} >
                {post === null ? <ActivityIndicator /> :
                    <>
                        <PostImage imgs={post.post_image} />
                        <View style={styles.containerTitle}>
                            <Text style={styles.title}>{post.title}</Text>
                            <View style={styles.containerHeader}>
                                <Text style={styles.price}>{post.price}/tháng</Text>
                                <Text style={styles.text}>• {post.acreage}m²</Text>
                                <Text style={styles.text}>• Tối đa {post.max_number_of_people} người</Text>
                            </View>

                            <View style={{ marginTop: 20 }}>
                                <View style={styles.containerHeader}>
                                    <Icon style={styles.addressIcon} source={'map-marker'} size={23} />
                                    <Text style={styles.address}>
                                        {post.address.specified_address}
                                    </Text>
                                </View>
                                <View style={styles.containerHeader}>
                                    <Icon style={styles.addressIcon} source={'clock-time-four-outline'} size={23} />
                                    <Text style={styles.address}>
                                        Cập nhật {moment(post.updated_date).fromNow()}
                                    </Text>
                                </View>
                            </View>
                            <Divider />
                            <View>
                                <Text style={{ fontWeight: 500, paddingVertical: 10 }}>Mô tả chi tiết</Text>
                                <View style={styles.containPhone}>
                                    <View style={styles.containerHeader}>
                                        <Text style={styles.text}>SĐT liên lạc:</Text>
                                        <TouchableOpacity style={styles.text}>
                                            <Text style={{ color: 'blue' }}>{post.user.phone}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <TouchableOpacity style={{ marginRight: 10, }}>
                                        <Text style={{ color: 'blue' }}>Gọi ngay</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ paddingVertical: 50, paddingHorizontal: 5 }}>
                                    <Text style={{ fontSize: 15, }}>{post.description}</Text>
                                </View>
                            </View>
                            <Divider />
                            <View style={{ marginVertical: 20 }}>
                                <Text style={{ fontWeight: 500, paddingVertical: 10 }}>Bản đồ</Text>
                                {centerCoordinates.latitude === null ? <ActivityIndicator /> :
                                    <View style={{
                                        borderColor: '#D2D0D7',
                                        padding: 10,
                                        marginRight: 15,
                                        borderWidth: 1,
                                        borderRadius: 10
                                    }}>
                                        <MapView
                                        provider={PROVIDER_DEFAULT}
                                            style={{
                                                height: 300,
                                                borderRadius: 10
                                            }}
                                            onPress={e => { console.log(e.nativeEvent.coordinate) }}
                                            initialRegion={{
                                                ...centerCoordinates,
                                                latitudeDelta: 0.0001,
                                                longitudeDelta: 0.01,
                                            }}
                                        >
                                            <Marker draggable coordinate={centerCoordinates} title="Địa điểm" />
                                            <Circle
                                                center={centerCoordinates}
                                                radius={600}
                                                strokeColor="rgba(0, 0, 255, 0.5)"
                                                fillColor="rgba(0, 0, 255, 0.2)"
                                                
                                            />
                                        </MapView>
                                    </View>
                                }
                            </View>
                            <Divider />
                            <View>
                                <Text style={{ fontWeight: 500, paddingVertical: 10 }}>Thông tin người dùng</Text>
                                <View style={{ padding: 10, backgroundColor: '#F8F4F4', borderRadius: 20, borderWidth: 1, borderColor: '#D2D0D7' }} >
                                    <View style={{ flexDirection: 'row' }}>
                                        <Image style={{ height: 60, width: 60, marginHorizontal: 5 }} source={require('../../assets/google-logo.png')} resizeMode="contain" />
                                        <Text style={{ fontSize: 15, marginTop: 10 }}>{post.user.last_name} {post.user.first_name}</Text>
                                        <Button onPress={() => { }} style={{ marginLeft: 70, justifyContent: 'center' }} textColor="#FFBA00">Theo dõi</Button>
                                    </View>
                                    <Text style={{ margin: 10 }}>Đã tham gia {moment(post.user.date_joined).fromNow()}</Text>
                                </View>
                            </View>
                        </View>
                        <CommentScreen postId={id} routName={'pfr-comment'} />
                    </>
                }
            </ScrollView>

            <View style={styles.footBarContainer}>
                <IconButton icon={'chat-outline'} size={30} onPress={() => { }} />
                <TouchableOpacity style={{ borderRadius: 10, borderWidth: 1, borderColor: 'black', paddingHorizontal: 20, paddingVertical: 10 }} onPress={() => { }}>
                    <Text style={styles.text}>Bình luận</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                    flexDirection: 'row', alignItems: 'center',
                    backgroundColor: '#0BD138', padding: 3, borderRadius: 10, marginLeft: 'auto',
                }}>
                    <Icon color="white" source={'phone-in-talk-outline'} size={20} style={{ padding: 10, color: 'white' }} />
                    <Text style={{ padding: 10, color: 'white', fontSize: 18 }}>{post?.user.phone}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        position: 'relative', // Đảm bảo footer luôn ở cuối màn hình
    },
    scrollContainer: {
        paddingBottom: 80, // Khoảng cách để không bị che khuất bởi footer
    },
    containerTitle: {
        display: 'flex',
        padding: 10,
    },
    containerHeader: {
        paddingVertical: 5,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    containPhone: {
        marginHorizontal: 10,
        paddingVertical: 5,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#FFF8E6',
        borderRadius: 10,
        padding: 10
    },
    title: {
        marginBottom: 20,
        fontWeight: 500,
        fontSize: 19,
    },
    price: {
        color: 'red',
        fontWeight: 500,
        fontSize: 16,
        marginRight: 10,
    },
    text: {
        fontWeight: 500,
        fontSize: 16,
        marginRight: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    address: {
        fontSize: 14,
        marginHorizontal: 10
    },
    addressIcon: { marginRight: 10, },
    container: {
        borderColor: '#D2D0D7',
        padding: 10,
        borderWidth: 1,
        borderRadius: 10
    },
    map: {
        height: 300,
        borderRadius: 10
    },
    footBarContainer: {
        flexDirection: 'row',
        padding: 5,
        position: 'static',
        bottom: 0,
        width: '100%',
        height: 60,
        backgroundColor: '#fff',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#D2D0D7',
    },
})

export default PostForRentDetail;
