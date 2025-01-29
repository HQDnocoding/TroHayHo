import { useEffect, useState } from "react"
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { FlatList } from "react-native-gesture-handler"
import { launchImageLibrary } from "react-native-image-picker";
import { Button, IconButton } from "react-native-paper";



const PickedImages = ({ imageList, setImageList }) => {
    const openImageLibrary = async () => {
        console.log("Chọn ảnh...");
        const res = await launchImageLibrary(
            {
                mediaType: "photo", 
                selectionLimit: 0,
            }
        );

        if (res.didCancel) {
            console.log("Người dùng hủy chọn ảnh");
        } else if (res.errorCode) {
            Alert.alert("Lỗi", res.errorMessage);
        } else {
            const newImages = res.assets.map((asset) => asset);
            console.log(res);
            setImageList((prevImageList) => [...prevImageList, ...newImages]);
        }
    };

    const removeImage = (uri) => {
        setImageList((prevImageList) => prevImageList.filter((image) => image.uri !== uri.uri));
    };

    const renderImages = ({ item }) => (
        <View style={{
            marginHorizontal: 4, position: 'relative',
            backgroundColor: '#F5F5F5', borderRadius: 20, padding: 10, height: 120,
            width: 120, alignItems: 'center', justifyContent: 'center',
            borderStyle: 'dashed', borderWidth: 1.5, borderColor: '#FFBA00'
        }}>
            <Image source={{ uri: item.uri }} style={styles.image} />
            <IconButton
                style={{
                    position: 'absolute',
                    top: -16,
                    right: -10,
                    borderRadius: 12,
                    padding: 5,
                }}
                icon={"sticker-remove"}
                iconColor="black"
                onPress={() => removeImage(item)}
            />
        </View>
    );

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
        marginTop: 10,
        flexDirection: 'row'
    },

    image: {
        width: 90,
        height: 90,
        margin: 2,
        borderRadius: 10,

    },
});