import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { ActivityIndicator, Button, Divider, RadioButton, Snackbar, TextInput } from "react-native-paper";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetBackdrop, BottomSheetFlatList, BottomSheetView } from "@gorhom/bottom-sheet";
import APIs, { authAPIs, endpoints } from "../../configs/APIs";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import PickedImages from "./PickedImages";
import { MyUserContext } from "../../configs/UserContexts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomNumericInput from "./CustomNumericInput";


const PostForRentCreating = () => {
    const navigation = useNavigation();
    const [imageList, setImageList] = useState([]);
    const convertToImageObjects = () => {
        const imageObjects = imageList.map((image) => ({
            uri: image.uri,
            name: image.fileName,
            type: image.type,
        }));
        console.log(imageObjects);
        return imageObjects;
    };
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [pId, setPId] = useState(null);
    const [dId, setDId] = useState(null);
    const [wId, setWId] = useState(null);
    const [location, setLocation] = useState({ province: '', district: '', ward: '' });
    const [wards, setWards] = useState([]);
    const sheetRef = useRef(null);
    const sheetRef2 = useRef(null);
    const sheetRef3 = useRef(null);
    const snapPoints = useMemo(() => ["1%", "50%", "50%"], []);
    const snapPoints2 = useMemo(() => ["1%", "50%", "50%"], []);
    const snapPoints3 = useMemo(() => ["1%", "50%", "50%"], []);
    const [snackBarText, setSnackBarText] = useState(null);
    const [price, setPrice] = useState(0);
    const [visible, setVisible] = useState(false);

    const onDismissSnackBar = () => setVisible(false);
    const user = useContext(MyUserContext);
    const createPost = async () => {

        console.log("click");

        if (user !== null) {
            console.log("click2")
            if (data.district == '' || data.province == ''
                || data.ward == '' || data.specified_address == ''
                || data.coordinates == '' || data.coordinates === null || data.coordinates === undefined) {
                setSnackBarText("Vui lòng điền địa chỉ đầy đủ");
                setVisible(!visible);
                console.log('error');

            }
            else if (data.specified_address === undefined) {
                setSnackBarText("Vui lòng điền địa chỉ chi tiết");
                setVisible(!visible);
            }
            else if (postValues.acreage == '' || postValues.title == '' ||
                postValues.description == '' || postValues.name_agent == ''
                || postValues.price == '' || postValues.max_number_of_people == ''
            ) {
                setSnackBarText("Vui lòng điền đầy đủ thông tin");
                setVisible(!visible);
            }
            else if (!/^\d+$/.test(postValues.acreage)) {
                setSnackBarText("Vui lòng điền đúng giá trị diện tích là số nguyên");
                setVisible(!visible);
            }
            else if (!/^\d+$/.test(postValues.max_number_of_people)) {
                setSnackBarText("Vui lòng điền đúng giá trị số người ở tối đa là số nguyên");
                setVisible(!visible);
            }
            else if (!/^\d+$/.test(postValues.acreage)) {
                setSnackBarText("Vui lòng điền đúng giá trị giá cho thuê là số");
                setVisible(!visible);
            }
            else if (imageList.length < 1 || imageList.length === 0) {
                setSnackBarText("Vui lòng thêm hình ảnh về nơi muốn cho thuê");
                setVisible(!visible);
            }
            else {
                try {
                    const payload = {
                        "specified_address": data.specified_address,
                        "province": data.province,
                        "district": data.district,
                        "ward": data.ward,
                        "coordinates": data.coordinates?.latitude && data.coordinates?.longitude
                            ? `${data.coordinates.latitude}, ${data.coordinates.longitude}`
                            : '',
                    };


                    const imageDict = convertToImageObjects();

                    const jsonData = {
                        "title": postValues.title,
                        "acreage": postValues.acreage,
                        "max_number_of_people": postValues.max_number_of_people,
                        "price": postValues.price,
                        "description": postValues.description,
                        "name_agent": postValues.name_agent,
                        "address": payload,
                        // "post_image": imageDict,
                        "phone_contact": user.phone || "0",
                    };

                    const formData = new FormData();

                    formData.append('title', jsonData.title);
                    formData.append('acreage', jsonData.acreage);
                    formData.append('max_number_of_people', jsonData.max_number_of_people);
                    formData.append('price', jsonData.price);
                    formData.append('description', jsonData.description);
                    formData.append('name_agent', jsonData.name_agent);
                    formData.append('phone_contact', jsonData.phone_contact);

                    // formData.append("address[specified_address]", payload.specified_address);
                    // formData.append("address[coordinates]",payload.coordinates);
                    // formData.append("address[province]", payload.province);
                    // formData.append("address[district]", payload.district);
                    // formData.append("address[ward]", payload.ward);


                    formData.append("address", payload)

                    // jsonData.post_image.forEach((image, index) => {
                    //     formData.append(`post_image`, {
                    //         uri: image.uri,
                    //         type: image.type,
                    //         name: image.fileName || `image_${Date.now()}_${index}.jpg`,
                    //     });
                    // });



                    const token = await AsyncStorage.getItem("access_token");

                    console.log("form", formData);
                    console.log("json", jsonData);
                    console.log("token", token);


                    const res = await authAPIs(token).post(endpoints['getListPostForRent'], jsonData,
                        {
                            headers: {
                                'Content-Type': 'application/json',

                            },
                        }
                    );

                    console.log(res.data);

                    imageDict.forEach(image => uploadImage(image, res.data.id));



                } catch (ex) {
                    console.error(ex);
                } finally {
                        setPrice(0);
                        setPostValues({ description: '', title: '' ,acreage:'',max_number_of_people:'',name_agent:'',price:''});
                        setLocation({ district: '', province: '', ward: '' });
                        setDistricts('');
                        setData({ coordinates: '', district: '', province: '', specified_address: '', ward: '' })
                        setProvinces('');
                        setWards('');
                        setImageList([]);
                }
            }
        }
    }

    const uploadImage = async (image, id) => {
        const formData = new FormData();
        formData.append('image', {
            uri: image.uri,
            type: image.type,
            name: image.name || `image_${Date.now()}.jpg`,
        });

        formData.append('post', id); // Giả sử post ID là 1, bạn cần thay đổi giá trị này
        console.log("pp", formData);
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

    const [data, setData] = useState({
        specified_address: '', coordinates: '',
        province: '', district: '', ward: ''
    });

    const [postValues, setPostValues] = useState({
        title: '', description: '', price: '', acreage: '',
        max_number_of_people: '', name_agent: '',
    });

    const handleSheetChange = useCallback((index) => {
        console.log("handleSheetChange", index);
    }, []);


    const loadProvinces = async () => {
        try {
            const res = await APIs.get(endpoints["provinces"]);
            const provinces = res.data;
            setProvinces(provinces);
        } catch (e) {
            console.error(e);
        }
    }

    const loadDistricts = async ({ id }) => {
        try {

            const res = await APIs.get(endpoints["provinces-districts"](`${id}`));
            setDistricts(res.data);
        } catch (e) {
            console.error(e);
        }
    }


    const loadWards = async ({ dId }) => {
        try {
            const res = await APIs.get(endpoints["provinces-districts-wards"](pId, dId));
            setWards(res.data);
        } catch (ex) {
            console.error(ex);
        }
    }

    useEffect(() => {
        loadProvinces();
    }, []);



    const handleSnapPress = useCallback((index) => {

        sheetRef.current?.snapToIndex(index);
    }, []);


    const handleSnapPress2 = useCallback((index) => {

        sheetRef2.current?.snapToIndex(index);
    }, []);


    const handleSnapPress3 = useCallback((index) => {

        sheetRef3.current?.snapToIndex(index);
    }, []);


    const handlePressProvince = ({ id }) => {


        setPId(id);

        loadDistricts({ id: id });
        handleSnapPress2(2);
    }


    const handlePressDistricts = ({ id }) => {

        setDId(id);
        loadWards({ dId: id });
        handleSnapPress3(2);
    }


    const renderProvinces = useCallback(({ item }) => (
        <TouchableOpacity onPress={() => {
            setLocation({ province: item.name });
            handlePressProvince({ id: item.code });
        }}>
            <View style={{ flexDirection: 'row' }}>

                <Text style={{ fontSize: 15, paddingVertical: 10, paddingStart: 20 }}>{item.name}</Text>

                <Divider />
            </View>
        </TouchableOpacity>
    ), []);


    const renderDistricts = useCallback(({ item }) => (
        <TouchableOpacity onPress={() => {
            setLocation((prev) => ({ ...prev, district: item.name }));
            handlePressDistricts({ id: item.code });
        }}>
            <View style={{ flexDirection: 'row' }}>

                <Text style={{ fontSize: 15, paddingVertical: 10, paddingStart: 20 }}>{item.name}</Text>

                <Divider />
            </View>
        </TouchableOpacity>
    ), [districts]);

    const renderWards = useCallback(({ item }) => (
        <TouchableOpacity onPress={() => {
            setLocation((prev) => ({ ...prev, ward: item.name }));
            sheetRef.current?.close();
            sheetRef2.current?.close();
            sheetRef3.current?.close();
            setWards([]);
            setDistricts([]);
            setWId(item.code);
        }}>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontSize: 15, paddingVertical: 10, paddingStart: 20 }}>{item.name}</Text>
                <Divider />
            </View>
        </TouchableOpacity>
    ), [wards]);

    const renderBackdrop = useCallback(
        (props) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={1}
                appearsOnIndex={2}
            />
        ),
        []
    );

    const [valid, setValid] = useState(false);

    useEffect(() => {
        if (location.district == '' || location.ward == '' || location.ward == '') {
            setValid(false);
        } else {
            setData({ province: pId, district: dId, ward: wId });
            setValid(true);
        };
    }, [pId, dId, wId]);


    useEffect(() => {
        console.log(postValues);
    }, [postValues])

    useFocusEffect(

        useCallback(() => {
            console.log("dosodos");
            const getData = async () => {
                const storedCoord = await AsyncStorage.getItem("coord");
                if (storedCoord) {
                    setData((prev) => ({ ...prev, coordinates: JSON.parse(storedCoord) }));
                }
            };
            getData();
        }, [])
    );

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                ListHeaderComponent={<View >
                    <View style={{ backgroundColor: '#D9D9D9', paddingVertical: 10, paddingStart: 30 }}>
                        <Text style={styles.label}>Tiêu đề, mô tả bài đăng</Text>
                    </View>
                    <View style={styles.flexRow}>
                        <TextInput style={styles.input} mode="outlined"
                            label={"Tên bài đăng"}
                            outlineColor="#CAC4D0"
                            onChange={(newText) => {
                                const textValue = newText.nativeEvent.text;
                                setPostValues((prev) => ({
                                    ...prev,
                                    title: textValue,
                                }));
                            }}
                            placeholderTextColor="#CAC4D0"
                            activeOutlineColor="#FFBA00" />
                    </View>

                    <View style={styles.flexRow}>
                        <TextInput style={styles.input} mode="outlined"
                            outlineColor="#CAC4D0"
                            label={"Mô tả"}
                            multiline={true}
                            onChange={(newText) => {
                                const textValue = newText.nativeEvent.text;
                                setPostValues((prev) => ({
                                    ...prev,
                                    description: textValue,
                                }));
                            }}
                            placeholderTextColor="#CAC4D0"
                            activeOutlineColor="#FFBA00"></TextInput>
                    </View>
                    <View style={styles.flexRow}>
                        <TextInput style={styles.input} mode="outlined"
                            outlineColor="#CAC4D0"
                            label={"Tên người đại diện bên cho thuê"}
                            multiline={true}
                            onChange={(newText) => {
                                const textValue = newText.nativeEvent.text;
                                setPostValues((prev) => ({
                                    ...prev,
                                    name_agent: textValue,
                                }));
                            }}
                            placeholderTextColor="#CAC4D0"
                            activeOutlineColor="#FFBA00"></TextInput>
                    </View>
                    <View style={{ backgroundColor: '#D9D9D9', paddingVertical: 10, paddingStart: 30 }}>
                        <Text style={styles.label}>Thông tin diện tích, giá cả</Text>
                    </View>
                    <View style={styles.flexRow}>
                        <TextInput style={styles.input} mode="outlined"
                            outlineColor="#CAC4D0"
                            label={"Số người ở tối đa"}

                            placeholderTextColor="#CAC4D0"
                            onChange={(newText) => {
                                const textValue = newText.nativeEvent.text;
                                setPostValues((prev) => ({
                                    ...prev,
                                    max_number_of_people: textValue,
                                }));
                            }}
                            activeOutlineColor="#FFBA00" keyboardType="numeric" inputMode="numeric" />
                    </View>
                    <View style={styles.flexRow}>
                        <TextInput style={styles.input} mode="outlined"
                            outlineColor="#CAC4D0"
                            label={"Diện tích"}
                            keyboardType="number-pad"
                            onChange={(newText) => {
                                const textValue = newText.nativeEvent.text;
                                setPostValues((prev) => ({
                                    ...prev,
                                    acreage: textValue,
                                }));
                            }}
                            placeholderTextColor="#CAC4D0"
                            activeOutlineColor="#FFBA00" />
                    </View>
                    <View style={styles.flexRow}>
                        <Text style={{ fontSize: 16, marginHorizontal: 20 }}>Giá cho thuê</Text>
                        <CustomNumericInput price={price} setPostValues={setPostValues} flag={false} />
                        <Text style={{ fontSize: 16, marginStart: 10 }}>VNĐ</Text>

                    </View>
                    <View style={{ backgroundColor: '#D9D9D9', paddingVertical: 10, paddingStart: 30 }}>
                        <Text style={styles.label}>Địa chỉ</Text>
                    </View>
                    <TouchableWithoutFeedback onPress={() => { handleSnapPress(2) }}>
                        <View style={styles.flexRow}>

                            <TextInput style={styles.input} mode="outlined" outlineColor="#CAC4D0" placeholderTextColor="#CAC4D0"
                                onPress={() => { }}
                                onFocus={() => { }}
                                editable={false}
                                value={`${location.ward ? location.ward + ', ' : ''}${location.district ? location.district + ', ' : ''}${location.province}`}
                                label={"Địa chỉ"}
                                right={<TextInput.Icon icon={'arrow-right-drop-circle-outline'} onPress={() => { handleSnapPress(1) }} />}
                                activeOutlineColor="#FFBA00" >
                            </TextInput>

                        </View>
                    </TouchableWithoutFeedback>
                    <View style={styles.flexRow}>
                        <TextInput style={styles.input} mode="outlined"
                            outlineColor="#CAC4D0"

                            label={"Số nhà, Tên đường"}
                            onChange={(newText) => {
                                // Lấy giá trị từ sự kiện trước khi sử dụng
                                const textValue = newText.nativeEvent.text; // Hoặc newText nếu bạn đang truyền giá trị thẳng
                                setData((prev) => ({
                                    ...prev,
                                    specified_address: textValue, // Cập nhật giá trị address
                                }));
                            }} placeholderTextColor="#CAC4D0"
                            activeOutlineColor="#FFBA00" />
                    </View>
                    <TouchableWithoutFeedback onPress={() => {
                        navigation.navigate('map')
                    }}>
                        <View style={styles.flexRow}>

                            <TextInput style={styles.input} mode="outlined" outlineColor="#CAC4D0" placeholderTextColor="#CAC4D0"
                                onPress={() => { }}
                                onFocus={() => { }}
                                editable={false}
                                value={`(${data.coordinates?.latitude}, ${data.coordinates?.longitude})`}
                                label={"Tọa độ"}
                                right={<TextInput.Icon icon={'arrow-right-drop-circle-outline'} />}
                                activeOutlineColor="#FFBA00" ></TextInput>

                        </View>
                    </TouchableWithoutFeedback>

                    <View style={{ backgroundColor: '#D9D9D9', paddingVertical: 10, paddingStart: 30 }}>
                        <Text style={styles.label}>Hình ảnh</Text>
                    </View>
                    <PickedImages imageList={imageList} setImageList={setImageList} />

                    <Button onPress={createPost} style={{ marginHorizontal: 'auto', marginVertical: 10, backgroundColor: "#ff7b00", width: 200, paddingVertical: 10, borderRadius: 10 }}><Text style={{ color: "white", fontSize: 20 }}>Đăng tin</Text></Button>
                    <Snackbar visible={visible}
                        onDismiss={onDismissSnackBar} >
                        {snackBarText}
                    </Snackbar>

                </View>}

            />

            <BottomSheet
                ref={sheetRef}
                snapPoints={snapPoints}
                enableDynamicSizing={false}
                onChange={handleSheetChange}
                backdropComponent={renderBackdrop}
            >
                <Text>Tỉnh/Thành phố</Text>

                <BottomSheetFlatList
                    data={provinces}
                    renderItem={renderProvinces}
                    keyExtractor={(item) => item.code.toString()}
                    contentContainerStyle={{ backgroundColor: 'white' }}
                />
            </BottomSheet>
            <BottomSheet
                ref={sheetRef2}
                snapPoints={snapPoints2}
                enableDynamicSizing={false}
                backdropComponent={renderBackdrop}>
                <Text>Quận/Huyện</Text>
                <BottomSheetFlatList
                    data={districts}
                    indicatorStyle="default"
                    renderItem={renderDistricts}
                    keyExtractor={(item) => item.code.toString()}
                    contentContainerStyle={{ backgroundColor: 'white' }}
                />

            </BottomSheet>
            <BottomSheet
                ref={sheetRef3}
                snapPoints={snapPoints3}
                enableDynamicSizing={false}
                onChange={() => { }}
                backdropComponent={renderBackdrop}>
                <Text>Xã/Phường</Text>
                <BottomSheetFlatList
                    data={wards}
                    renderItem={renderWards}
                    keyExtractor={(item) => item.code.toString()}
                    contentContainerStyle={{ backgroundColor: 'white' }}
                />
            </BottomSheet>


        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    infoBox: {
        position: "absolute",
        bottom: 30,
        left: 20,
        right: 20,
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    infoText: {
        fontSize: 16,
        fontWeight: "500",
        color: "#333",
    },
    flexRow: {
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
        paddingVertical: 3
    },
    label: {
        fontWeight: 600,
        fontSize: 17,
    },
    input: {
        marginHorizontal: 10,
        flex: 5,
    },
    modal: {
        justifyContent: 'flex-end', // Đặt modal ở phía dưới màn hình
        margin: 0,  // Loại bỏ margin mặc định
        height: '50%',  // Chiếm nửa màn hình
    },
    mapStyle: {
        ...StyleSheet.absoluteFillObject
    },
})

export default PostForRentCreating;