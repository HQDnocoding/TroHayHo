import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Divider, TextInput } from "react-native-paper";
import APIs, { endpoints } from "../../configs/APIs";
import BottomSheet, { BottomSheetBackdrop, BottomSheetFlatList } from "@gorhom/bottom-sheet";

const ExtendRegister = ({
    address,
    setAddress,
    districts,
    provinces,
    wards,
    setDistricts,
    setProvinces,
    setWards,
    phone,
    setPhone,
}) => {
    const sheetRef = useRef(null);
    const sheetRef2 = useRef(null);
    const sheetRef3 = useRef(null);
    const snapPoints = useMemo(() => ["99%", "99%", "99%"], []);
    const snapPoints2 = useMemo(() => ["99%", "99%", "99%"], []);
    const snapPoints3 = useMemo(() => ["99%", "99%", "99%"], []);


    const handleSnapPress = useCallback((index) => {

        sheetRef.current?.snapToIndex(index);
    }, []);

    const handleSnapPress2 = useCallback((index) => {

        sheetRef2.current?.snapToIndex(index);
    }, []);


    const handleSnapPress3 = useCallback((index) => {

        sheetRef3.current?.snapToIndex(index);
    }, []);
    // Hàm load tỉnh/thành phố
    const loadProvinces = async () => {
        try {
            const res = await APIs.get(endpoints["provinces"]);

            setProvinces(res.data);
        } catch (e) {
            console.error(e);
        }
    };

    // Hàm load quận/huyện
    const loadDistricts = async ({ id }) => {
        try {
            const res = await APIs.get(endpoints["provinces-districts"](`${id}`));

            setDistricts(res.data);
        } catch (e) {
            console.error(e);
        }
    };

    // Hàm load phường/xã
    const loadWards = async ({ pId, dId }) => {
        try {
            const res = await APIs.get(endpoints["provinces-districts-wards"](pId, dId));

            setWards(res.data);
        } catch (ex) {
            console.error(ex);
        }
    };

    useEffect(() => {
        loadProvinces();

    }, []);

    const renderProvinces = useCallback(({ item }) => (
        <TouchableOpacity onPress={() => {
            handleSelectProvince(item.code);
        }}>
            <View style={{ flexDirection: 'row' }}>

                <Text style={{ fontSize: 15, paddingVertical: 10, paddingStart: 20 }}>{item.name}</Text>

                <Divider />
            </View>
        </TouchableOpacity>
    ), []);

    // Xử lý khi chọn tỉnh
    const handleSelectProvince = (provinceId) => {
        // Reset lại huyện và xã khi chọn tỉnh mới
        setAddress({ province: provinceId, district: null, ward: null });
        loadDistricts({ id: provinceId });
        handleSnapPress2(2);
    };

    const renderDistricts = useCallback(({ item }) => (
        <TouchableOpacity onPress={() => {
            handleSelectDistrict(item.code);
        }}>
            <View style={{ flexDirection: 'row' }}>

                <Text style={{ fontSize: 15, paddingVertical: 10, paddingStart: 20 }}>{item.name}</Text>

                <Divider />
            </View>
        </TouchableOpacity>
    ), [districts]);

    // Xử lý khi chọn huyện
    const handleSelectDistrict = (districtId) => {
        setAddress((prev) => ({ ...prev, district: districtId, ward: null }));
        loadWards({ pId: address.province, dId: districtId });
        handleSnapPress3(2);
    };


    const renderWards = useCallback(({ item }) => (
        <TouchableOpacity onPress={() => {
            setAddress((prev) => ({ ...prev, ward: item.code }));
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
                disappearsOnIndex={0}
                appearsOnIndex={1}
            />
        ),
        []
    );
    return (
        <View >

            <TouchableOpacity onPress={() => { sheetRef.current?.expand() }}>
                <View>
                    <TextInput
                        mode="outlined"
                        outlineColor="#CAC4D0"
                        placeholderTextColor="#CAC4D0"
                        activeOutlineColor="#FFBA00"
                        editable={false}
                        style={{
                            backgroundColor: "white",
                            borderColor: "#FFBA00",
                            margin: 15,
                        }}
                        placeholder="Địa chỉ"
                        value={`${address.ward ? address.ward + ', ' : ''}${address.district ? address.district + ', ' : ''}${address.province}`} F
                    />
                </View>
            </TouchableOpacity>



            <BottomSheet
                ref={sheetRef}
                snapPoints={snapPoints}
                enableDynamicSizing={false}
                enablePanDownToClose={true}
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
                enablePanDownToClose={true}
                snapPoints={snapPoints2}
                enableDynamicSizing={false}
                backdropComponent={null}>
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
                enablePanDownToClose={true}
                snapPoints={snapPoints3}
                enableDynamicSizing={false}
                onChange={() => { }}
                backdropComponent={null}>
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

export default ExtendRegister;
