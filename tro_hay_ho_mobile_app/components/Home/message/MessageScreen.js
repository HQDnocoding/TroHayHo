import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import React from "react";
import { db } from "../../../configs/FirebaseConfig"
import { onValue, ref, set, push, off, update,get } from "firebase/database"
import { ChatMessage, ChatInput, ChatImage } from './ChatComponents';
import { createConversation, createTextMessage, createUser,getMessages,getUserConversations } from "../../../utils/ChatFunction"
import { Button } from "react-native-paper";
import { tempUser, tempUser2 } from "../../../utils/MyValues";

const MessageScreen = ({ navigation, route }) => {
  const params = route.params || {};
  const { item, currentUser, partnerUser } = params;

  const [message, setMessage] = React.useState([])
  console.info("message screen")
  
  React.useEffect(() => {

    const messagesRef = ref(db, 'messages')
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {

        const messagesList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));

        setMessage(messagesList)
      }
    })
   const con= getUserConversations(2,(conversations)=>{
    console.log(conversations)
   })

    // const converRef = ref(db, 'conversations')
    // onValue(converRef, (snapshot) => {
    //   const data = snapshot.val()
    //   if (data) {

    //     const converList = Object.keys(data).map(key => ({
    //       id: key,
    //       ...data[key]
    //     }));
    //     console.info(snapshot.val())

    //   }
    // })
    return () => {
      off(messagesRef);
      con()
    };
  }, [])
  const pushData = async (messageText) => {
    // const user1 = await createUser(tempUser)
    // const user2 = await createUser(tempUser2)
    const data = await createConversation(2, 5)
    // const mesage = await createTextMessage("2_4", 4, "o la la")

    // const newMessageRef = push(ref(db, "messages"));

    // set(newMessageRef, {
    //   text: messageText,
    //   userId: "currentUser",
    //   userName: "Anonymous",
    //   timestamp: Date.now(),
    //   type: "text" // Để phân biệt message thường và image
    // });
  }
  const pushConversation = (messageText) => {
    const listId = [5, 6, 7]
    const converRef = ref(db, "conversations/-OH5aUcyZnwGyEFN9Laj/b");
    update(converRef, {

      [`cc`]: 5
    })

  }

  const renderItem = ({ item }) => {
    return (
      <ChatMessage />
    )
  }
  return (

    <View style={{ flex: 1 }}>
      <FlatList data={message} renderItem={renderItem} />
      <ChatInput onSend={pushData} />
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

