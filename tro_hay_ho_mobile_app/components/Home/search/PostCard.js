import { Text, View, StyleSheet, Image } from "react-native"
import PostForRent from "./PostForRent"
import PostWant from "./PostWant"
import { sampleAvatar, sampleImage } from "../../../utils/MyValues"

const PostCard = ({ item }) => {
    return (
        <View style={styles.card}>
            <View style={styles.header}>
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: sampleImage }}
                    style={styles.image}
                    resizeMode="cover"
                />
            </View>
            <View style={{marginStart:10}}>
            <Text style={{fontWeight:700}}>TranVanA</Text>
            <Text style={{fontSize:12}}>Gio</Text>

            </View>
            </View>
           
            {item.type === 'PostWant' ? <>
                <PostWant />

            </> : <>
                <PostForRent />

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
    },header:{
        alignItems:'center',
        flexDirection:'row',
    }
})
export default PostCard