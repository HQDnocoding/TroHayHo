import { useState } from "react";
import PostImage from "./PostImages";


const PostForRentDetail = ({rout}) => {
    const postId=rout.params?.postId;
    const [post,setPost]=useState(null);
    const [comment,setComment]=useState(null);


    // const loadPost =async()=>{
    //     let res=await
    // }

    return (


        <View>
            <PostImage />
            <View>
                <Text></Text>
            </View>
        </View>
    )
};


export default PostForRentDetail;