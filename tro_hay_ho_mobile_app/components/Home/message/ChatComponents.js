// ChatMessage.js
import React from 'react';
import { View, Text, StyleSheet, Image, TextInput ,TouchableNativeFeedback,TouchableOpacity} from 'react-native';
import { sampleAvatar, sampleImage } from '../../../utils/MyValues';
const ChatMessage = ({ message, isOutgoing }) => {
  return (
    <View style={[styles.messageContainer, styles.outgoing]}>
      <Text style={[styles.messageText, styles.outgoingText]}>
        Cac ban khoe ko cha co viec gi thi laij noi nhang len
      </Text>


      <Text style={styles.timestamp}>12:13</Text>
    </View>
  );
};
const ChatImage = ({ message, isOutgoing }) => {
  return (
    <View style={[styles.messageContainer, styles.outgoing]}>
     

      <Image
        source={{ uri: sampleImage }}
        style={styles.messageImage}
      />

      <Text style={styles.timestamp}>12:13</Text>
    </View>
  );
};

// ChatInput.js
const ChatInput = ({ onSend }) => {
  const [message,setMessage]=React.useState("")
  const handleSend=()=>{
    if(message){
      onSend(message)
      setMessage("")
    }
  }
  return (
    <View style={styles.inputContainer}>

      <View style={styles.inputCus}>
        <Text style={styles.toolIcon}>📷</Text>
        <View style={styles.inputWrapper}>

          <TextInput
            style={styles.input}
            placeholder="Nhắn tin..."
            multiline
            value={message}
            onChangeText={(text) => setMessage(text)}
          />
          <TouchableOpacity onPress={handleSend}>
          <Text style={styles.sendButton}>▶</Text>

          </TouchableOpacity>
        </View>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 4,
    padding: 8,
    borderRadius: 16,
  },
  incoming: {
    backgroundColor: '#e5e5e5',
    alignSelf: 'flex-start',
  },
  outgoing: {
    backgroundColor: '#ffc107',
    alignSelf: 'flex-end',
  },
  messageText: {
    fontSize: 16,
  },
  incomingText: {
    color: '#000',
  },
  outgoingText: {
    color: '#000',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginTop: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#ffc107',
  },
  backButton: {
    padding: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    padding: 8,
  },
  inputTools: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  toolIcon: {
    fontSize: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 12,
    marginHorizontal: 5,
    width:'90%',
  },
  inputCus: {
    flexDirection: 'row',


  },
  input: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
  },
  sendButton: {
    fontSize: 24,
    color: '#ffc107',
    marginLeft: 8,
  },
});

export { ChatMessage, ChatInput,ChatImage };