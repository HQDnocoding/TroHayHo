import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';

const FollowingHome = () => {
  // Data mẫu cho các phòng trọ đang theo dõi
  const followedPosts = [
    {
      id: 1,
      title: 'Phòng trọ Quận Gò Vấp',
      price: '2.200.000đ',
      address: '789 Phan Văn Trị, Gò Vấp, TP.HCM',
      status: 'Còn trống',
      followedDate: '20/01/2025'
    },
    {
      id: 2,
      title: 'Phòng trọ Quận Tân Bình',
      price: '2.500.000đ',
      address: '321 Cộng Hòa, Tân Bình, TP.HCM',
      status: 'Đã cho thuê',
      followedDate: '18/01/2025'
    },
    // Thêm data mẫu khác...
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Phòng trọ đang theo dõi</Text>
      </View>

      {followedPosts.map(post => (
        <Card key={post.id} style={styles.card}>
          <Card.Content>
            <Title>{post.title}</Title>
            <Text style={styles.price}>{post.price}</Text>
            <Text style={styles.address}>{post.address}</Text>
            <Text style={styles.status}>Trạng thái: {post.status}</Text>
            <Text style={styles.followDate}>Theo dõi từ: {post.followedDate}</Text>
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
  status: {
    marginTop: 5,
    fontSize: 14,
  },
  followDate: {
    color: '#666',
    fontSize: 12,
    marginTop: 5,
  },
  button: {
    marginTop: 10,
  }
});

export default FollowingHome;