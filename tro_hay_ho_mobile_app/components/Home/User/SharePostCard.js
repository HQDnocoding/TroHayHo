import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { myYellow, POST_FOR_RENT, POST_WANT, sampleAvatar } from "../../../utils/MyValues"
import { createPostMessage, createConversationId, checkExistConversation, createConversation } from "../../../utils/ChatFunction"
const SharePostCard = ({ followed, follower, post }) => {
    const handleSendPost = async () => {

        const conversationId = createConversationId(followed.id, follower.id)
        console.log("a ",followed.id," ",follower.id)

        const check=await checkExistConversation(followed.id, follower.id)
        if ( check=== null) {
            await createConversation(followed.id, follower.id)
        }
        console.log("check ",check)

        if (post.type.toLowerCase() === POST_WANT) {
            const a = await createPostMessage(conversationId, follower.id, post.id, POST_WANT)
        } else if ((post.type.toLowerCase() === POST_FOR_RENT)) {
            const a = await createPostMessage(conversationId, follower.id, post.id, POST_FOR_RENT)
        }
        console.log("followed", followed.id, " post:", post.id)

    }
    return (

        <View style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={{ uri: followed && followed.avatar ? followed.avatar : sampleAvatar }}
                    style={styles.avatar}
                />
                <View>
                    <Text>{followed && followed ? followed.last_name : ""} {followed && followed ? followed.first_name : ""}</Text>
                </View>
            </View>
            <TouchableOpacity onPress={handleSendPost}>
                <View style={styles.btnSend}  >
                    <Text>Gửi</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}
export default SharePostCard
const styles = StyleSheet.create(
    {
        container: {
            backgroundColor: 'rgb(255, 255, 255)',
            height: 150,
            padding: 10,
            alignItems: 'center',
            borderRadius: 10,

        },
        avatar: {
            width: 50,
            height: 50,
            objectFit: 'cover',
            borderRadius: 100,

        }, header: {
            backgroundColor: 'rgb(235, 235, 235)',

            borderWidth: 1,
            borderColor: 'gray',
            borderRadius: 10,
            padding: 10,
            justifyContent:
                'center',
            alignItems: 'center',

        }, btnSend: {
            marginTop: 10,
            backgroundColor: myYellow,
            width: 50,
            alignItems: 'center',
            borderRadius: 10,
            padding: 5,
        }
    }
)