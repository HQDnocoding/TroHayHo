import {View, Text, StyleSheet, ScrollView,FlatList,RefreshControl} from "react-native";
import React from "react";
import {Searchbar} from "react-native-paper";
import MessageCard from "./MessageCard";
import APIs, { endpointsDuc } from "../../../configs/APIs";
import { ActivityIndicator } from "react-native-paper";
const MessageScreen = () => {
  
  return (
    
       <View><Text>A va b dang noi chuyen</Text></View>
  );
}
const styles= StyleSheet.create({
    container:{
      backgroundColor:'#fff'
    },
    searchBar:{
        marginHorizontal:20,
        marginTop:20,
        backgroundColor:'#bdbdbd',
        marginBottom:10,
    }
})
export default MessageScreen;

