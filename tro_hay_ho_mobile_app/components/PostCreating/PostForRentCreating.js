import { StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { ActivityIndicator, Divider, RadioButton, TextInput } from "react-native-paper";
import Modal from "react-native-modal";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetBackdrop, BottomSheetFlatList } from "@gorhom/bottom-sheet";
import APIs, { endpoints } from "../../configs/APIs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { set } from "firebase/database";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";



const PostForRentCreating = () => {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [location, setLocation] = useState({ province: '', district: '', ward: '' });
    const [wards, setWards] = useState([]);
    const sheetRef = useRef(null);
    const sheetRef2 = useRef(null);
    const sheetRef3 = useRef(null);
    const snapPoints = useMemo(() => ["1%", "50%", "50%"], []);
    const snapPoints2 = useMemo(() => ["1%", "50%", "50%"], []);
    const snapPoints3 = useMemo(() => ["1%", "50%", "50%"], []);
    const [markerPosition, setMarkerPosition] = useState([{
        latitude: 37.39094933041195,
        longitude: -122.02503913145092,
    }]);

    const [infoText, setInfoText] = useState("");

    const onMarkerDragEnd = (e) => {
        const { latitude, longitude } = e.nativeEvent.coordinate;
        setMarkerPosition({ latitude, longitude });
        setInfoText(`Pin dropped at: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
    };

    const [isSheetVisible, setIsSheetVisible] = useState(false);
    const handleSheetChange = useCallback((index) => {
        console.log("handleSheetChange", index);
    }, []);

    const saveProvincesId = async ({ id }) => {
        // setCurrentPId(id);
        AsyncStorage.setItem("provinceId", id);
    }

    const saveDistrictId = async ({ id }) => {
        AsyncStorage.setItem("districtId", id);
    }

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
            const pId = await AsyncStorage.getItem("provinceId");
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


        saveProvincesId({ id: id });

        loadDistricts({ id: id });
        handleSnapPress2(2);
    }


    const handlePressDistricts = ({ id }) => {
        saveDistrictId({ id: id });
        loadWards({ dId: id });
        handleSnapPress3(2);
    }


    const renderProvinces = useCallback(({ item }) => (
        <TouchableOpacity onPress={() => {
            console.log(item.code);
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
        } else setValid(true);
    }, [location.district, location.province, location.ward]);
    return (
        <View style={styles.container}>
            <View >
                <View style={{ backgroundColor: '#D9D9D9', paddingVertical: 10, paddingStart: 30 }}>
                    <Text style={styles.label}>Tiêu đề, mô tả bài đăng</Text>
                </View>
                <View style={styles.flexRow}>
                    <TextInput style={styles.input} mode="outlined"
                        label={"Tên bài đăng"}
                        outlineColor="#CAC4D0"
                        placeholderTextColor="#CAC4D0"
                        activeOutlineColor="#FFBA00" />
                </View>
                <View style={styles.flexRow}>
                    <TextInput style={styles.input} mode="outlined"
                        outlineColor="#CAC4D0"
                        label={"Diện tích"}
                        placeholderTextColor="#CAC4D0"
                        activeOutlineColor="#FFBA00" />
                </View>
                <View style={{ backgroundColor: '#D9D9D9', paddingVertical: 10, paddingStart: 30 }}>
                    <Text style={styles.label}>Thông tin diện tích, giá cả</Text>
                </View>
                <View style={styles.flexRow}>
                    <TextInput style={styles.input} mode="outlined"
                        outlineColor="#CAC4D0"
                        label={"Số người ở tối đa"}
                        placeholderTextColor="#CAC4D0"
                        activeOutlineColor="#FFBA00" keyboardType="numeric" inputMode="numeric" />
                </View>
                <View style={styles.flexRow}>
                    <TextInput style={styles.input} mode="outlined"
                        outlineColor="#CAC4D0"
                        label={"Mô tả"}
                        placeholderTextColor="#CAC4D0"
                        activeOutlineColor="#FFBA00"></TextInput>
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
                            activeOutlineColor="#FFBA00" ></TextInput>

                    </View>
                </TouchableWithoutFeedback>

            </View>
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
            <MapView
                provider={PROVIDER_GOOGLE}
                style={{
                    margin: 10, height: 300,
                }}
                initialRegion={{
                    latitude: 37.39094933041195,
                    longitude: -122.02503913145092,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            >
                {markerPosition.map((marker, index) => (
                    <Marker
                        key={index}
                        coordinate={{ longitude: marker.longitude, latitude: marker.latitude}}
                        draggable
                        onDragEnd={onMarkerDragEnd}
                        title="Draggable Marker"
                        description={infoText}
                    />
                ))}

            </MapView>
            {infoText !== "" && (
                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>{infoText}</Text>
                </View>
            )}
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
        paddingBottom: 10,
        paddingHorizontal: 4,
        paddingTop: 7,
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
    }
})

export default PostForRentCreating;