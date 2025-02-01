import { useContext, useEffect } from "react";
import PostForRentCreating from "./PostForRentCreating";
import PostWantCreating from "./PostWantCreating";
import { MyUserContext } from "../../configs/UserContexts";
import { Role } from "../../general/General";
import { Text, View } from "react-native";



const PostCreatingForm = ({ navigation }) => {
    const user = useContext(MyUserContext);

    useEffect(() => {
        if (user === null) {
            navigation.navigate('login');
        }
    })

    console.log(user)
    return (
        <View style={{ flex: 1 }}>

            {user?.groups.includes(Role.CHU_TRO) ?
                <PostForRentCreating /> :
                <PostWantCreating />
            }
        </View>
    )
}


export default PostCreatingForm;