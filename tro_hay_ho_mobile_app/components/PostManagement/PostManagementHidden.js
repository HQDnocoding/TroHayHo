
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {Card, Title, Paragraph} from 'react-native-paper';
import React from "react";
import PostManagementCard from "./PostManagementCard";



const PostManagementHidden=()=>{
return(
    <View>
        <ScrollView>
            <PostManagementCard/>
            <PostManagementCard/>
            <PostManagementCard/>
        </ScrollView>
    </View>
)
}


export default PostManagementHidden;