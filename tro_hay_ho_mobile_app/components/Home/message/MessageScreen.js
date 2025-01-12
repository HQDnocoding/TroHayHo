import {View, Text, StyleSheet, ScrollView} from "react-native";
import React from "react";
import {Searchbar} from "react-native-paper";
import MessageCard from "./MessageCard";

const MessageScreen = () => {
  return (
    <ScrollView style={styles.container}>
        <View >
        <Searchbar style={styles.searchBar}
        placeholder={"Tìm kiếm"}
        />
    </View>
        <MessageCard/>
        <MessageCard/>
        <MessageCard/>
        <MessageCard/>
        <MessageCard/>
        <MessageCard/>
        <MessageCard/>
        <MessageCard/>
    </ScrollView>
  );
}
const styles= StyleSheet.create({
    container:{
      backgroundColor:'#fff'
    },
    searchBar:{
        marginHorizontal:20,
        marginTop:20,
        backgroundColor:'#eeeeee'
    }
})
export default MessageScreen;

