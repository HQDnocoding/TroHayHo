import React, { useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Button, Icon } from 'react-native-paper';


const PostImage = ({ imgs }) => {
  // const PostImage = ({ }) => {

  const [currentIndex, setCurrentIndex] = useState(0);

  const { width } = Dimensions.get('window');
  // const imgs = [require('../../assets/test_post_imgs/tro1.png'), require('../../assets/test_post_imgs/tro2.png'), require('../../assets/test_post_imgs/tro3.png'), require('../../assets/test_post_imgs/tro4.png')]

  const handleScroll = (event) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(newIndex);
  };

  return (
    <View style={styles.container}>

      <FlatList
        data={imgs}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Image source={{ uri: item.image }} style={[styles.image, { width }]} />
        )}
      />

      <Text style={styles.counter}>
        {currentIndex + 1} / {Object.keys(imgs).length}
      </Text>
      <View style={styles.button} >
        <TouchableOpacity>
          <Icon size={27} source="cards-heart-outline" />
        </TouchableOpacity>

      </View>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // maxHeight: 200,
    backgroundColor: '#fff',
    position: 'relative'
  },
  image: {
    height: 200,
    resizeMode: 'contain'
  },
  counter: {
    marginTop: 1,
    fontSize: 16,
    fontWeight: 'bold',
    position: 'absolute',
    end: 0,
    top: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 7,
    opacity: 0.6
  },
  button: {
    position: 'absolute',
    padding: 1,
    end: 0,
    top: '10%',
    margin: 6
  }
});

export default PostImage;