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


const PostWantCreating = () => {
    const navigation = useNavigation();

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
    const [visible, setVisible] = useState(false);

    const [price, setPrice] = useState(0);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(0);


    const onDismissSnackBar = () => setVisible(false);
    const user = useContext(MyUserContext);
    const createPost = async () => {

        console.log(postValues.price);

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
            else if (postValues.title == '' ||
                postValues.description == '' || minPrice == ''
                || price == '' || maxPrice == ''
            ) {
                setSnackBarText("Vui lòng điền đầy đủ thông tin");
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

                    const jsonData = {
                        "title": postValues.title,
                        "price": price,
                        "price_range_max": maxPrice,
                        "price_range_min": minPrice,
                        "description": postValues.description,
                        "address": payload,
                        "phone_contact": user.phone || "0",
                    };

                    const formData = new FormData();

                    formData.append('title', jsonData.title);
                    formData.append('price', price);
                    formData.append('price_range_min', minPrice);
                    formData.append('price_range_max', maxPrice);
                    formData.append('description', jsonData.description);
                    formData.append('phone_contact', jsonData.phone_contact);
                    formData.append("address", payload)

                    const token = await AsyncStorage.getItem("access_token");

                    console.log("form", formData);
                    console.log("token", token);


                    const res = await authAPIs(token).post(endpoints['getListPostWant'], jsonData,
                        {
                            headers: {
                                'Content-Type': 'application/json;',
                            },
                        }
                    );
                    console.log(res);

                    if (res.status == 201) {
                        const notiForm = new FormData();
                        notiForm.append('title', `Tài khoản tên ${user.last_name} ${user.first_name} vừa tạo bài tìm trọ!`);
                        notiForm.append('content', `Bài đăng tựa đề ${postValues.title} vừa được đăng, hãy tương tác ngay!`)
                        notiForm.append('post', res.data.id)
                        try {
                            authAPIs(token).post(endpoints['notifications'], notiForm,
                                {
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                }
                            )
                        } catch (ex) {
                            console.log(ex);
                        }
                    }


                } catch (ex) {
                    console.error(ex);
                } finally {
                    setPrice(0);
                    setMaxPrice(0);
                    setMaxPrice(0);
                    setPostValues({ description: '', title: '' });
                    setLocation({ district: '', province: '', ward: '' });
                    setDistricts('');
                    setData({ coordinates: '', district: '', province: '', specified_address: '', ward: '' })
                    setProvinces('');
                    setWards('');
                }
            }
        }
    }


    const [data, setData] = useState({
        specified_address: '', coordinates: '',
        province: '', district: '', ward: ''
    });

    const [postValues, setPostValues] = useState({
        title: '', description: ''
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
            const res = await APIs.get(endpoints["provinces-districts"](id));
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
                            value={postValues.title}
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
                            value={postValues.description}
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

                    <View style={{ backgroundColor: '#D9D9D9', paddingVertical: 10, paddingStart: 30 }}>
                        <Text style={styles.label}>Giá cả</Text>
                    </View>

                    <View style={styles.flexRow}>
                        <Text style={{ fontSize: 16, marginHorizontal: 20, flex: 1 }}>Giá tối thiểu</Text>
                        <CustomNumericInput price={maxPrice} setPostValues={setMinPrice} flag={true} />
                        <Text style={{ fontSize: 16, marginStart: 10 }}>VNĐ</Text>

                    </View>
                    <View style={styles.flexRow}>
                        <Text style={{ fontSize: 16, marginHorizontal: 20, flex: 1 }}>Giá tối đa</Text>
                        <CustomNumericInput price={minPrice} setPostValues={setMaxPrice} flag={true} />
                        <Text style={{ fontSize: 16, marginStart: 10 }}>VNĐ</Text>

                    </View>
                    <View style={styles.flexRow}>
                        <Text style={{ fontSize: 16, marginHorizontal: 20, flex: 1 }}>Giá mong muốn</Text>
                        <CustomNumericInput price={price} setPostValues={setPrice} flag={true} />
                        <Text style={{ fontSize: 16, marginStart: 10 }}>VNĐ</Text>

                    </View>
                    <View style={{ backgroundColor: '#D9D9D9', paddingVertical: 10, paddingStart: 30 }}>
                        <Text style={styles.label}>Địa chỉ</Text>
                    </View>
                    <TouchableWithoutFeedback onPress={() => { loadProvinces(), handleSnapPress(2) }}>
                        <View style={styles.flexRow}>

                            <TextInput style={styles.input} mode="outlined" outlineColor="#CAC4D0" placeholderTextColor="#CAC4D0"
                                onPress={() => { }}
                                onFocus={() => { }}
                                editable={false}
                                value={`${location.ward ? location.ward + ', ' : ''}${location.district ? location.district + ', ' : ''}${location.province}`}
                                label={"Địa chỉ"}
                                right={<TextInput.Icon icon={'arrow-right-drop-circle-outline'} onPress={() => {
                                    loadProvinces();
                                    handleSnapPress(1)
                                }} />}
                                activeOutlineColor="#FFBA00" >
                            </TextInput>

                        </View>
                    </TouchableWithoutFeedback>
                    <View style={styles.flexRow}>
                        <TextInput style={styles.input} mode="outlined"
                            outlineColor="#CAC4D0"
                            value={data.specified_address}
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
    );
};

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

export default PostWantCreating;