// ChatMessage.js
import React from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableNativeFeedback, TouchableOpacity } from 'react-native';
import { POST_FOR_RENT, POST_WANT, sampleAvatar, sampleImage } from '../../../utils/MyValues';
import { formatTimeAgo } from '../../../utils/TimeFormat';
import APIs, { endpointsDuc } from '../../../configs/APIs';
import { useNavigation } from '@react-navigation/native';
const ChatMessage = ({ message, isOutgoing }) => {
  return (
    <View style={[styles.messageContainer, isOutgoing ? styles.endSide : styles.startSide]}>
      <Text style={[styles.messageText, isOutgoing ? styles.endSideText : styles.startSideText]}>
        {message.text}
      </Text>


      <Text style={[styles.messageText, isOutgoing ? styles.timestampOutgoing : styles.timestampIncoming]}>{formatTimeAgo(message.created_at)}</Text>
    </View>
  );
};
const ChatImage = ({ message, isOutgoing }) => {
  return (
    <View style={[styles.messageContainer, styles.endSide]}>


      <Image
        source={{ uri: sampleImage }}
        style={styles.messageImage}
      />

      <Text style={styles.timestamp}>{formatTimeAgo(message.created_at)}</Text>
    </View>
  );
};
const ChatPost = ({ message, isOutgoing }) => {
  const nav=useNavigation()
  const [post, setPost] = React.useState(null)
  const loadPost = async () => {
    try {
      const response = await APIs.get(endpointsDuc.getPostParent(message.post_id))
      if (response.data) {
        setPost(response.data)

      }
    } catch (error) {
      console.log("hien thi card message bi loi :", error)
    }
  }
  const handleToRoute = () => {
    if (post !== null) {
      let routeName 
      if (post.type.toLowerCase() == POST_WANT) {
        routeName= 'post_want'
        
      } else if (post.type.toLowerCase() == POST_FOR_RENT) {
        routeName = 'post_for_rent'
        
      }
      let params = {
        postId: post.id,
        coordinates: post.address.coordinates
      }
      nav.navigate(routeName, params)

    }
  }

  React.useEffect(() => {
    if (message.post_id) {
      loadPost()

    }
  }, [])
  return (
    <View style={[styles.messageContainer, isOutgoing ? styles.endSide : styles.startSide]}>
      <Text style={[styles.messageText, isOutgoing ? styles.endSideText : styles.startSideText]}>
        {message.text}
      </Text>
      {post && <>
        <TouchableOpacity onPress={handleToRoute}>
          {message.type_post === POST_FOR_RENT && <>
            <Image
              source={{ uri: post.post_image[0] && post.post_image[0].image ? post.post_image[0].image : sampleImage }}
              style={styles.messageImage}
            />
          </>}

          <Text style={[styles.messageText, isOutgoing ? styles.endSideText : styles.startSideText, styles.textTitle]} numberOfLines={1}>
            {post.title}
          </Text>
          <View style={{ flexDirection: 'row' }}>

            <Image
              source={{ uri: post.user.avatar ? post.user.avatar : sampleAvatar }}
              style={styles.messageAvatar}
            />
            <Text style={styles.textNameUser}>{post.user.last_name} {post.user.first_name}</Text>
          </View>
        </TouchableOpacity>



      </>}

      <Text style={[styles.messageText, isOutgoing ? styles.timestampOutgoing : styles.timestampIncoming]}>{formatTimeAgo(message.created_at)}</Text>

    </View>
  );
};
// ChatInput.js
const ChatInput = ({ onSend }) => {
  const [message, setMessage] = React.useState("")
  const handleSend = () => {
    if (message) {
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
  startSide: {
    marginStart: 10,
    backgroundColor: '#e5e5e5',
    alignSelf: 'flex-start',
  },
  endSide: {
    marginEnd: 10,
    backgroundColor: '#ffc107',
    alignSelf: 'flex-end',
  },
  messageText: {
    fontSize: 16,
  },
  startSideText: {
    color: '#000',
  },
  endSideText: {
    color: '#000',
  },
  timestampIncoming: {
    fontSize: 12,
    color: '#666',
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  timestampOutgoing: {
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
  textTitle: {
    maxWidth: 200,
    fontWeight: 700,
  },
  textNameUser: {
    marginStart: 10,
    maxWidth: 150,
    alignSelf: 'center'
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
  messageAvatar: {
    borderRadius: 100,
    height: 30,
    width: 30,
    objectFit: 'cover'
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
    width: '90%',
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

export { ChatMessage, ChatInput, ChatImage, ChatPost };