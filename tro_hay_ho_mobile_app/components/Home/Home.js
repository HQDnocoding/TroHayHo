import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import PostForRent from "./duc/post/PostForRent";
import PostWant from "./duc/post/PostWant";

const Home = () => {
  // Data mẫu - sau này có thể fetch từ API
  const posts = [
    {
      id: 1,

    },
    {
      id: 2,

    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Các phòng trọ mới nhất</Text>
      </View>

      {posts.map(post => (
        <PostForRent key={post.id}/>
      ))}
      {posts.map(post => (
        <PostWant key={post.id}/>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  card: {
    margin: 10,
    elevation: 4,
  },
  price: {
    color: '#FFBA00',
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  address: {
    color: '#666',
    marginBottom: 5,
  },
});

export default Home;