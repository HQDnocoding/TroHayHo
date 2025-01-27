import { useEffect, useState } from "react"
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { FlatList } from "react-native-gesture-handler"
import { launchImageLibrary } from "react-native-image-picker";
import { Button, IconButton } from "react-native-paper";



const PickedImages = () => {
    const [imageList, setImageList] = useState([]); // imageList là mảng
    const openImageLibrary = async () => {
        console.log("Chọn ảnh...");
        const res = await launchImageLibrary(
            {
                mediaType: "photo", // Chỉ chọn ảnh
                selectionLimit: 0, // Cho phép chọn nhiều ảnh
            }
        );

        if (res.didCancel) {
            console.log("Người dùng hủy chọn ảnh");
        } else if (res.errorCode) {
            Alert.alert("Lỗi", res.errorMessage);
        } else {
            // Thêm các ảnh mới vào mảng
            const newImages = res.assets.map((asset) => asset.uri);
            setImageList((prevImageList) => [...prevImageList, ...newImages]);
        }
    };


    const renderImages = ({ item }) => (
        <View style={{
            marginHorizontal: 4, position: 'relative',
            backgroundColor: '#F5F5F5', borderRadius: 20, padding: 10, height: 120,
            width: 120, alignItems: 'center', justifyContent: 'center',
            borderStyle: 'dashed', borderWidth: 1.5, borderColor: '#FFBA00'
        }}>
            <Image source={{ uri: item }} style={styles.image} />
            <IconButton style={{
                position: 'absolute',
                top: -16, // Khoảng cách từ trên cùng
                right: -10, // Khoảng cách từ bên phải
                borderRadius: 12, // Bo tròn nút
                padding: 5,
            }} icon={"sticker-remove"} iconColor="black"   onPress={() => { }} />
        </View>
    )
    const width = Dimensions.get("window");

    const [full, setFull] = useState(false);

    useEffect(() => {
        if (imageList.length > 0) {
            setFull(true);
        } else {
            setFull(false);
        }
    }, [imageList]);



    return (
        <View style={styles.container}>
            {!full ?
                <TouchableOpacity onPress={openImageLibrary}>
                    <View style={{

                        backgroundColor: '#F5F5F5', borderRadius: 20, padding: 20, height: 120, alignItems: 'center', justifyContent: 'center'
                        , width: width.width - 20, borderStyle: 'dashed', borderWidth: 1.5, borderColor: '#FFBA00'
                    }}>
                        <Image style={styles.image} source={require("../../assets/camera_icon.png")} />
                        <Text style={{}}>Thêm hình</Text>
                    </View>
                </TouchableOpacity>
                :
                <TouchableOpacity onPress={openImageLibrary}>
                    <View style={{
                        marginHorizontal: 4,
                        backgroundColor: '#F5F5F5', borderRadius: 20, padding: 20, height: 120,
                        width: 120, alignItems: 'center', justifyContent: 'center',
                        borderStyle: 'dashed', borderWidth: 1.5, borderColor: '#FFBA00'
                    }}>
                        <Image style={styles.image} source={require("../../assets/camera_icon.png")} />
                    </View>
                </TouchableOpacity>
            }


            <FlatList horizontal={true}
                keyExtractor={(item, index) => index.toString()}
                data={imageList}
                
                renderItem={renderImages}
                contentContainerStyle={styles.list}
            />
        </View>
    )
}

export default PickedImages;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop:10,
        flexDirection: 'row'
    },

    image: {
        width: 90,
        height: 90,
        margin: 2,
        borderRadius: 10,

    },
});