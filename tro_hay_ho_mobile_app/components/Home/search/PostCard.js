import { Text, View, StyleSheet, Image } from "react-native"
import PostForRent from "./PostForRent"
import PostWant from "./PostWant"
import { myYellow, sampleAvatar, sampleImage } from "../../../utils/MyValues"
import { formatTimeAgo } from "../../../utils/TimeFormat"
import APIs, { endpointsDuc } from "../../../configs/APIs"
import React, { useState } from "react"

const PostCard = ({ item }) => {
    const [post, setPost] = useState(null)



    const loadPost = async () => {
        const res = await APIs.get(endpointsDuc.getPostParent(item.id))
        if (res.data) {
            setPost(res.data)
        }
    }
    React.useEffect(() => {
        if (item.id !== null) {
            loadPost()
        }
    }, [])
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: post&&post.user&&post.user.avatar  ? post.user.avatar : sampleAvatar }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                </View>
                <View style={{ marginStart: 10 }}>
                    <Text style={{ fontWeight: 700 }}>{post&&post.user?post.user.last_name:""} {post&&post.user?post.user.first_name:""}</Text>
                    <Text style={{ fontSize: 12 }}>{post?formatTimeAgo(post.created_date):""}</Text>

                </View>
            </View>
            <View style={styles.address}>
                <Text numberOfLines={2}>{post?post.address.ward.full_name:""},{post?post.address.district.full_name:""},{post?post.address.province.full_name:""}</Text>
            </View>
            {post&&<>
                {post.type && post.type.toLowerCase() === 'postforrent' ? <>
                <PostForRent item={post} />

            </> : <>
                <PostWant item={post} />

            </>}
            </>}
           
        </View>
    )
}
const styles = StyleSheet.create({

    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        marginHorizontal: 8,
        marginTop: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    imageContainer: {
        width: 40,
        height: 40,
        borderRadius: 100,
        overflow: 'hidden',
    },
    image: {
        width: '40',
        height: '40',
        objectFit: 'cover'
    }, header: {
        alignItems: 'center',
        flexDirection: 'row',
    }, address: { 
        marginVertical: 5, 
        padding: 10, 
        backgroundColor: "rgb(255, 220, 159)",
        borderRadius:10,
        
    }
})
export default PostCard