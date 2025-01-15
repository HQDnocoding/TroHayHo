import { View } from "react-native";
import CommentScreen from "./CommentPostWant"



const PostWantDetail=({route})=>{

    const postId=route.params.postId;
    console.log(postId)
    return(
        <View style={{width:400}}>
            <CommentScreen postId={postId}/>
        </View>
    )
}


export default PostWantDetail;