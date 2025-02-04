import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { myYellow, POST_FOR_RENT, POST_WANT, sampleAvatar } from "../../../utils/MyValues"
import { createPostMessage, createConversationId, checkExistConversation, createConversation } from "../../../utils/ChatFunction"
import { getFullName } from "../../../utils/MyFunctions"
import React, { useState } from "react"
import { set } from "firebase/database"
const SharePostCard = ({ followed, follower, post,sent }) => {
    
    const [isSent, setIsSent] = useState(false);
    const handleSendPost = async () => {
        try {
            const conversationId = createConversationId(followed.id, follower.id)

            const check = await checkExistConversation(followed.id, follower.id)
            if (check === null) {
                await createConversation(followed.id, follower.id)
            }

            let messageType = post.type.toLowerCase();
            if (messageType === POST_WANT || messageType === POST_FOR_RENT) {
                await createPostMessage(conversationId, follower.id, followed.id, post.id, messageType)

                setIsSent(true);
            }
        } catch (error) {
            console.error("Error sending post:", error);
        }

    }
    
    return (

        <View style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={{ uri: followed && followed.avatar ? followed.avatar : sampleAvatar }}
                    style={styles.avatar}
                />
                <View>
                    <Text>{followed && followed ? getFullName(followed.last_name, followed.first_name) : ""} </Text>
                </View>
            </View>
            <TouchableOpacity
                onPress={handleSendPost}
                disabled={isSent}
            >
                <View style={[
                    styles.btnSend,
                    isSent && styles.btnSent
                ]}>
                    <Text style={isSent ? styles.textSent : {}}>
                        {isSent ? "Đã gửi" : "Gửi"}
                    </Text>
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
        },
        header: {
            backgroundColor: 'rgb(235, 235, 235)',
            borderWidth: 1,
            borderColor: 'gray',
            borderRadius: 10,
            padding: 10,
            justifyContent: 'center',
            alignItems: 'center',
        },
        btnSend: {
            marginTop: 10,
            backgroundColor: myYellow,
            width: 50,
            alignItems: 'center',
            borderRadius: 10,
            padding: 5,
        },
        btnSent: {
            width: 70,

            backgroundColor: 'gray',
        },
        textSent: {
            color: 'white',
        }
    }
)