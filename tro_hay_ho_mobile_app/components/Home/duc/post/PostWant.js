import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Avatar } from 'react-native-paper';
import { Icon } from 'react-native-paper';

const PostWant = () => {
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Avatar.Image
          size={40}
          source={{uri:"https://img.freepik.com/free-vector/night-landscape-with-lake-mountains-trees-coast-vector-cartoon-illustration-nature-scene-with-coniferous-forest-river-shore-rocks-moon-stars-dark-sky_107791-8253.jpg"}}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>Trần Thái Uy</Text>
          <Text style={styles.timestamp}>12:34 01-03-2024</Text>
        </View>
      </View>

      {/* Location */}
      <View style={styles.locationContainer}>
        <Text style={styles.location}>số 12 , xã A,huyện B , tỉnh C</Text>
      </View>

      {/* Description */}
      <Text style={styles.description}>
        em muoons thue nha cuc chang da, nha dep thi cang tot heheh
      </Text>






      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}>
          <Icon source="comment-outline" size={20} />
          <Text style={styles.actionText}>23 Bình luận</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Icon source="heart-outline" size={20} />
          <Text style={styles.actionText}>Lưu</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Icon source="share-variant-outline" size={20} />
          <Text style={styles.actionText}>Chia sẻ</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userInfo: {
    marginLeft: 10,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  timestamp: {
    color: '#666',
    fontSize: 12,
  },
  locationContainer: {
    backgroundColor: '#ffe09c',
    padding: 8,
    borderRadius: 5,
    marginBottom: 10,
  },
  location: {
    color: '#000000',
  },
  description: {
    marginBottom: 10,
    lineHeight: 20,
  },
  price: {
    color: '#FF0000',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  imagesContainer: {
    flexDirection: 'row',
    height: 200,
    marginBottom: 10,
  },
  mainImage: {
    flex: 2,
    marginRight: 5,
    borderRadius: 8,
  },
  smallImagesContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  smallImage: {
    height: '48%',
    borderRadius: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 5,
    color: '#666',
  },
});

export default PostWant;