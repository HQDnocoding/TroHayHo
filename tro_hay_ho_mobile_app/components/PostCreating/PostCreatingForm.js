import { useContext } from "react";
import PostForRentCreating from "./PostForRentCreating";
import PostWantCreating from "./PostWantCreating";
import { MyUserContext } from "../../configs/UserContexts";
import { Role } from "../../general/General";
import { View } from "react-native";



const PostCreatingForm = () => {
    const user = useContext(MyUserContext);
    console.log(user)
    return (
        <View style={{flex:1}}>
            {user.groups.includes(Role.CHU_TRO) ?
                <PostForRentCreating /> :
                <PostWantCreating />
            }
        </View>
    )
}


export default PostCreatingForm;