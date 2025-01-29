import React, { useState } from 'react';
import { View, Button, Image, Alert, ScrollView } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import APIs, { endpoints } from '../../configs/APIs';

const ImagePickerComponent = () => {
    const [images, setImages] = useState([]); // Lưu danh sách ảnh đã chọn

    const selectImage = () => {
        const options = {
            mediaType: 'photo',
            quality: 1,
        };

        launchImageLibrary(options, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorMessage) {
                console.log('ImagePicker Error:', response.errorMessage);
            } else if (response.assets && response.assets.length > 0) {
                const selectedImage = response.assets[0];
                setImages(prevImages => [...prevImages, selectedImage]); // Thêm ảnh vào danh sách
            }
        });
    };

    const uploadImage = async (image) => {
        const formData = new FormData();
        formData.append('image', {
            uri: image.uri,
            type: image.type,
            name: image.fileName || `image_${Date.now()}.jpg`,
        });

        formData.append('post', 1); // Giả sử post ID là 1, bạn cần thay đổi giá trị này
        console.log("pp",formData);
        try {
            const response = await APIs.post(endpoints['image'], formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log(response)
            if (response.ok) {
                Alert.alert('Upload thành công', 'Ảnh đã được tải lên');
            } else {
                Alert.alert('Lỗi', result.message || 'Có lỗi xảy ra');
            }
        } catch (error) {
            console.error('Upload error:', error);
        }
    };

    

    return (
        <View style={{ padding: 10 }}>
            <Button title="Chọn ảnh" onPress={selectImage} />
            
            <ScrollView horizontal style={{ marginTop: 10 }}>
                {images.map((image, index) => (
                    <Image 
                        key={index} 
                        source={{ uri: image.uri }} 
                        style={{ width: 100, height: 100, marginRight: 10 }} 
                    />
                ))}
            </ScrollView>

            <Button title="Tải ảnh lên" onPress={() => images.forEach(uploadImage)} />
        </View>
    );
};

export default ImagePickerComponent;
