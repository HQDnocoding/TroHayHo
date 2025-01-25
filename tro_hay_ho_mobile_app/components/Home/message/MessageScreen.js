import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import React from "react";
import { ChatMessage, ChatInput, ChatImage } from './ChatComponents';
import { createConversation, createTextMessage, createUser, getMessages, getUserConversations } from "../../../utils/ChatFunction"
import { Button } from "react-native-paper";


const MessageScreen = ({ navigation, route }) => {
  const params = route.params || {};
  const { item, currentUser, partnerUser } = params;
  const [message, setMessage] = React.useState([])
  const flatListRef = React.useRef(null);

  const SendMessage = (textMessage) => {
    createTextMessage(item.id, currentUser.id, textMessage)
  }
  const ScrollFlatList=()=>{
    const timeoutId = setTimeout(() => {
      if(flatListRef.current){
        flatListRef.current.scrollToEnd({animated:true})
      }
    }, 100); 

    return () => clearTimeout(timeoutId);
    
  }
  React.useEffect(()=>{
    ScrollFlatList()
  },[message])
  React.useEffect(() => {
    console.log("message",item)
    const listenMessage = getMessages(item.id, (message) => {
      setMessage(message)
      ScrollFlatList()
    })
    return () => {
      listenMessage()
    }

  }, [])

  const renderItem = ({ item }) => {
    let isOutgoing = true
    if (item.sender_id !== currentUser.id) {
      isOutgoing = false
    }
    return (
      <ChatMessage message={item} isOutgoing={isOutgoing} />
    )
  }
  const footFlatList=()=>{
    return (
      <View style={styles.footer}>

      </View>
    )
  }
  return (

    <View style={{ flex: 1, }}>
      <FlatList
      style={{paddingVertical:10,}}
        ref={flatListRef}
        data={message}
        ListFooterComponent={footFlatList}
        // khi ban phim an hoac hien thi se cuon ve cuoi
         onContentSizeChange={ScrollFlatList}
         onLayout={ScrollFlatList}
        renderItem={renderItem} />
      <ChatInput onSend={SendMessage} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff'
  },
  searchBar: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: '#bdbdbd',
    marginBottom: 10,
  },footer:{
    width:'100%',
    height:20,
  }
})
export default MessageScreen;

