import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';

const Home = () => {
  // Data mẫu - sau này có thể fetch từ API
  const posts = [
    {
      id: 1,
      title: 'Phòng trọ Quận 1',
      price: '3.500.000đ',
      address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
      description: 'Phòng trọ rộng rãi, đầy đủ tiện nghi...'
    },
    {
      id: 2,
      title: 'Phòng trọ Quận Bình Thạnh',
      price: '2.800.000đ',
      address: '456 Xô Viết Nghệ Tĩnh, Bình Thạnh, TP.HCM',
      description: 'Phòng mới xây, an ninh tốt...'
    },
    // Thêm data mẫu khác...
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Các phòng trọ mới nhất</Text>
      </View>

      {posts.map(post => (
        <Card key={post.id} style={styles.card}>
          <Card.Content>
            <Title>{post.title}</Title>
            <Text style={styles.price}>{post.price}</Text>
            <Text style={styles.address}>{post.address}</Text>
            <Paragraph>{post.description}</Paragraph>
          </Card.Content>
        </Card>
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