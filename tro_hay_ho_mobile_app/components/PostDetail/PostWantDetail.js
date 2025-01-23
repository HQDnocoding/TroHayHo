    import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
    import CommentScreen from "./CommentPostWant"
    import { useEffect, useState } from "react";
    import APIs, { endpoints } from "../../configs/APIs";
    import { ActivityIndicator, Button, Divider, Icon } from "react-native-paper";
    import moment from "moment";
    import { formatPrice } from "../../utils/Formatter";
    import MapView, { Circle, Marker, PROVIDER_GOOGLE } from "react-native-maps";



    const PostWantDetail = ({ route }) => {

        const postId = route.params.postId;

        const [post, setPost] = useState(null)
        console.log("lll",route.params.coordinates)
        const [latitude, longitude] = route.params?.coordinates.split(", ").map(Number);
        const [centerCoordinates, setCenterCoordinates] = useState({
            latitude: latitude,
            longitude: longitude,
        });

        const loadPost = async () => {
            try {

                let res = await APIs.get(endpoints['post-want-detail'](postId));
                if (res && res.data) {
                    setPost(res.data)
                } else {
                    console.log("No data")
                }

            } catch (ex) {
                console.log(ex);
            }
        }

        useEffect(() => {
            loadPost();
        }, [postId]);

        return (
            <ScrollView style={{ width: 400 }}>
                {post === null ? < ActivityIndicator /> :
                    <View style={styles.container}>
                        <View style={styles.userContainer}>
                            <Image style={styles.avatar} source={{ uri: post.user.avatar }} />
                            <View style={styles.inforContainer}>
                                <View style={styles.nameFollowingBtn}>
                                    <Text style={styles.userName}>{post.user.last_name} {post.user.first_name}</Text>
                                    <Button style={styles.followingBtn} onPress={() => { }}>
                                        <Text style={{ color: 'blue' }}>Theo dõi</Text>
                                    </Button>
                                </View>
                                <Text style={{ fontWeight: 200, fontSize: 10, paddingLeft: 5 }}>Cập nhật {moment(post.updated_date).fromNow()} </Text>
                            </View>
                        </View>
                        <View>
                            <View>
                                <Text style={styles.title}>{post.title}</Text>
                                <Text style={styles.desctiption}>{post.description}</Text>
                            </View>
                            <Divider style={{ marginVertical: 15 }} />
                            <View>
                                <Text style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>Giá cả</Text>
                                <Text style={styles.desctiption}>Khoảng giá chấp nhận:{`\n`}{formatPrice(post.price_range_min)} - {formatPrice(post.price_range_max)} VNĐ</Text>
                                <Text style={styles.desctiption}>Giá mong muốn {formatPrice(post.price)} VNĐ</Text>

                            </View>
                            <Divider style={{ marginVertical: 15 }} />
                            <View>
                                <Text style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>Địa điểm cần tìm</Text>

                                <View style={{
                                    paddingVertical: 5,
                                    flexDirection: 'row',
                                    flexWrap: 'wrap',
                                    alignItems: 'center',
                                }}>
                                    <Icon source={'map-marker'} size={23} />
                                    <Text style={styles.desctiption}>
                                        {post.address.specified_address}
                                    </Text>
                                </View>

                                <View style={{ marginVertical: 10 }}>
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
                                             provider={PROVIDER_GOOGLE}
                                                style={{
                                                    height: 300,
                                                    borderRadius: 10
                                                }}
                                                initialRegion={{
                                                    ...centerCoordinates,
                                                    latitudeDelta: 0.0001,
                                                    longitudeDelta: 0.01,
                                                }}
                                            >
                                                <Marker coordinate={centerCoordinates} title="Địa điểm" />
                                                <Circle
                                                    center={centerCoordinates}
                                                    radius={500}
                                                    strokeColor="rgba(0, 0, 255, 0.5)"
                                                    fillColor="rgba(0, 0, 255, 0.2)"
                                                />
                                            </MapView>
                                        </View>
                                    }
                                </View>

                            </View>

                        </View>

                        <CommentScreen postId={postId} routName={'pw-comment'}/>
                    </View>
                }


            </ScrollView>
        )
    }


    const styles = StyleSheet.create({
        container: {
            padding: 10,
            display: 'flex'
        },
        userContainer: {
            flexDirection: "row",
        },
        inforContainer: {
            display: 'flex',
            flexDirection: "column",
            paddingLeft: 10
        },
        nameFollowingBtn: {
            flexDirection: 'row',
            justifyContent: 'space-around'
        },
        avatar: {
            marginTop: 5,
            width: 54,
            height: 54,
            borderRadius: 100,

        },
        followingBtn: {
            paddingLeft: 10,
        },
        userName: {
            paddingLeft: 5,
            paddingTop: 9,
            fontWeight: 700,
            fontSize: 15,
        },
        title: {
            fontSize: 20,
            fontWeight: 800,
            marginVertical: 5,
        },
        desctiption: {
            fontWeight: 300,
            fontSize: 15,
            paddingVertical: 5
        }

    });


    export default PostWantDetail;