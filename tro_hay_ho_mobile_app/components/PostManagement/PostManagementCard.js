
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons'; // Đảm bảo bạn đã cài đặt expo/vector-icons

const PostManagementCard = ({ data }) => {
  return (
    <TouchableOpacity style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
            source={{uri:"https://img.freepik.com/free-vector/night-landscape-with-lake-mountains-trees-coast-vector-cartoon-illustration-nature-scene-with-coniferous-forest-river-shore-rocks-moon-stars-dark-sky_107791-8253.jpg"}}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Nhà cho thuê 30m2</Text>
          <TouchableOpacity style={styles.icon}>
            <Entypo name="dots-three-vertical" size={18} color="#666" />
          </TouchableOpacity>
        </View>

        <Text style={styles.price}>12.000.000 Đ</Text>

        <Text style={styles.dateTime}>17:25 01-12-2024</Text>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  card: {
      height:90,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
      flexDirection: 'row',
  },
  imageContainer: {
    width: 90,
    height: 90,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '90',
    height: '90',
      objectFit:'cover'
  },
  contentContainer: {
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
    icon: {
    marginStart:50,
    flex: 1,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF0000',
    marginBottom: 8,
  },
  dateTime: {
    fontSize: 12,
    color: '#666',
  },
});

export default PostManagementCard;