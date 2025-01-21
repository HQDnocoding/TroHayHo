import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import React from "react";
import { db } from "../../../configs/FirebaseConfig"
import { onValue, ref, set, push, off, update, get } from "firebase/database"
import { ChatMessage, ChatInput, ChatImage } from './ChatComponents';
import { createConversation, createTextMessage, createUser, getMessages, getUserConversations } from "../../../utils/ChatFunction"
import { Button } from "react-native-paper";
import { tempUser, tempUser2 } from "../../../utils/MyValues";

const MessageScreen = ({ navigation, route }) => {
  const params = route.params || {};
  const { item, currentUser, partnerUser } = params;
  const [message, setMessage] = React.useState([])
  const flatListRef = React.useRef(null);

  const SendMessage = (textMessage) => {
    createTextMessage(item.id, currentUser.id, textMessage)
  }
  const ScrollFlatList=()=>{
    if(flatListRef.current){
      flatListRef.current.scrollToEnd({animated:true})
    }
  }
  React.useEffect(()=>{
    ScrollFlatList()
  },[message])
  React.useEffect(() => {
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
  return (

    <View style={{ flex: 1 }}>
      <FlatList
        ref={flatListRef}
        data={message}
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
  }
})
export default MessageScreen;

