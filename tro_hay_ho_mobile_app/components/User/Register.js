import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button, Divider, HelperText, IconButton, RadioButton, TextInput } from "react-native-paper";
import LoginStyles from "../../styles/dat/LoginStyles";
import { Role } from "../../general/General";
import APIs, { authAPIs, endpoints } from "../../configs/APIs";
import PickedImages from "../PostCreating/PickedImages";
import { launchImageLibrary } from "react-native-image-picker";
import { FlatList } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetBackdrop, BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { formatPhoneNumber } from "../../utils/Formatter";

const Register = ({ navigation }) => {

    const [user, setUser] = useState({});

    const [specifiedAddress, setSpecifiedAddress] = useState(null);

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [addressName, setAddressName] = useState({ province: '', ward: '', district: '' })


    const [address, setAddress] = useState({
        'province': null, 'district': null,
        'ward': null, 'specified_address': null
    })

    const [phone, setPhone] = useState(null)
    const users = {
        "first_name": {
            "title": "Tên",
            "field": "first_name",
            "icon": "text",
            "secureTextEntry": false
        },
        "last_name": {
            "title": "Họ và tên lót",
            "field": "last_name",
            "icon": "text",
            "secureTextEntry": false
        },
        "username": {
            "title": "Tên đăng nhập",
            "field": "username",
            "icon": "text",
            "secureTextEntry": false
        }, "password": {
            "title": "Mật khẩu",
            "field": "password",
            "icon": "eye",
            "secureTextEntry": true
        }, "confirm": {
            "title": "Xác nhận mật khẩu",
            "field": "confirm",
            "icon": "eye",
            "secureTextEntry": true
        }
    }

    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(false);
    const [secureTE, setSecureTE] = useState(true);
    const [checked, setChecked] = useState(Role.NGUOI_THUE_TRO);

    const change = (value, field) => {
        setUser({ ...user, [field]: value });
    }

    const openImageLibrary = async ({ limit }) => {
        console.log("Chọn ảnh...");
        try {
            const res = await launchImageLibrary(
                {
                    mediaType: "photo", // Chỉ chọn ảnh
                    selectionLimit: limit, // Cho phép chọn nhiều ảnh
                }
            );

            if (res.didCancel) {
                picked(false)
                console.log("Người dùng hủy chọn ảnh");
            } else if (res.errorCode) {
                picked(false)
                Alert.alert("Lỗi", res.errorMessage);
            } else {
                setImg(res.assets[0]);
                console.log(res);
            }
            setPicked(true);
        } catch (ex) {
            console.log(ex);
        }

    };


    const removeImage = () => {
        console.log("ok")
        setImg(null);
        setPicked(false);
    };


    const [picked, setPicked] = useState(false);
    const [img, setImg] = useState(null);
    const [images, setImages] = useState([]);

    const check = () => {
        if (!user.first_name || user.first_name.trim() === "") {
            setErrContent("Vui lòng điền tên");
            setErr(true);
            return false;
        }
        if (!user.last_name || user.last_name.trim() === "") {
            setErrContent("Vui lòng điền họ");
            setErr(true);

            return false;
        }

        if (img === null) {
            setErrContent("Vui lòng chọn avatar");
            setErr(true);

            return false;
        }

        if (!user.username || user.username.includes(" ") || user.username.length < 8) {
            setErrContent("Tên đăng nhập phải có ít nhất 8 ký tự và không chứa khoảng trắng.");
            setErr(true);

            return false;
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)\S{8,}$/;
        if (!passwordRegex.test(user.password)) {
            setErrContent("Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa và số, không chứa khoảng trắng.");
            setErr(true);

            return false;
        }

        if (user.password !== user.confirm) {
            setErrContent("Mật khẩu xác nhận không khớp.");
            setErr(true);
            return false;
        }
        if (!img || !img.uri) {
            setErrContent("Vui lòng chọn ảnh đại diện.");
            setErr(true);

            return;
        }
    }


    const registerChuTro = async () => {
        try {
            console.log(1)
            const valid = check();

            if (otp.length < 6) {
                setErrContent("Vui lòng nhập đầy đủ mã OTP");
                setErr(true);
                return;
            }

            if (valid === false) return;


            const phoneRegex = /^(0[0-9]{9})$/;
            if (!phoneRegex.test(phone)) {
                setErrContent("Số điện thoại không hợp lệ.");
                setErr(true);
                return;
            }

            if (!address.province || !address.district || !address.ward || !specifiedAddress) {
                setErrContent("Vui lòng nhập đầy đủ thông tin địa chỉ.");
                setErr(true);
                return;
            }

            if (images.length < 3) {
                setErrContent("Bạn phải tải lên ít nhất 3 hình ảnh.");
                setErr(true);
                return;
            }

            let form = new FormData();

            for (let key in user) {
                if (key !== 'confirm') {
                    form.append(key, user[key]);
                }
            }

            form.append("avatar", {
                name: img.fileName,
                type: img.type,
                uri: img.uri
            });

            console.log("avatar", img.uri)
            form.append("phone", phone);
            form.append("groups", checked);
            form.append("otp", otp);


            const addressJson = JSON.stringify({
                province: address.province,
                district: address.district,
                ward: address.ward,
                specified_address: specifiedAddress
            });

            form.append("address", addressJson);

            console.log("Form Data:", form);

            setLoading(true);
            try {
                let res = await APIs.post(endpoints['register-chu-tro'], form, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Accept': '*/*'
                    }
                });
                console.info(res.data);
                if (res.status == 201) {
                    images.forEach(img => {
                        const form_image = new FormData()
                        form_image.append("image_tro", {
                            name: img.fileName,
                            type: img.type,
                            uri: img.uri
                        });
                        console.log(res.data.id);

                        form_image.append("chu_tro", res.data.id);
                        console.log(form_image)
                        APIs.post(endpoints['image-tro'], form_image, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            }
                        });

                    });

                }
                if (res.status == 201) { navigation.navigate('login'); }
            } catch (error) {
               
                console.error(error);
            } finally {
                setLoading(false);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);

        }
    };


    const register = async () => {
        try {

            const valid = check();
            if (valid === false) return;

            let form = new FormData();

            for (let key in user) {
                if (key !== 'confirm') {
                    form.append(key, user[key]);
                }
            }

            form.append("avatar", {
                name: img.fileName,
                type: img.type,
                uri: img.uri
            });
            console.log(checked)
            form.append("groups", checked);

            console.log("Form Data:", form);

            setLoading(true);
            try {
                let res = await APIs.post(endpoints['register'], form, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                console.info(res.data);
                if (res.status == 201) {
                    navigation.navigate('login');
                }
            } catch (error) {

                console.error(error);
            } finally {
                setLoading(false);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };


    const sheetRef = useRef(null);
    const sheetRef2 = useRef(null);
    const sheetRef3 = useRef(null);
    const snapPoints = useMemo(() => ["50%", "75%", "80%"], []);
    const snapPoints2 = useMemo(() => ["50%", "75%", "80%"], []);
    const snapPoints3 = useMemo(() => ["50%", "75%", "80%"], []);


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
            setAddressName({ province: item.name });
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
        setSheetVisible2(true);
        handleSnapPress2(0);
    };

    const renderDistricts = useCallback(({ item }) => (
        <TouchableOpacity onPress={() => {
            handleSelectDistrict(item.code);
            setAddressName(prev => ({ ...prev, district: item.name }));
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
        setSheetVisible3(true);
        handleSnapPress3(0);
    };


    const renderWards = useCallback(({ item }) => (
        <TouchableOpacity onPress={() => {
            setAddress((prev) => ({ ...prev, ward: item.code }));
            setAddressName((prev) => ({ ...prev, ward: item.name }))
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
                disappearsOnIndex={0}
                appearsOnIndex={1}
            />
        ),
        []
    );

    const [isSheetVisible1, setSheetVisible1] = useState(false);
    const [isSheetVisible2, setSheetVisible2] = useState(false);
    const [isSheetVisible3, setSheetVisible3] = useState(false);
    const handleOpenSheet = () => {
        setSheetVisible1(true); // Hiển thị BottomSheet
        requestAnimationFrame(() => {
            handleSnapPress(0);

        });
    };

    const [errContent, setErrContent] = useState('');

    const [otp, setOtp] = useState(null);

    const sendOtp = async () => {
        const form = new FormData();
        form.append("phone_number", formatPhoneNumber(phone));
        await APIs.post(endpoints['send-otp'], form, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
    }

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={[]}
                nestedScrollEnabled={true}
                keyExtractor={(item) => item.id.toString()}
                ListHeaderComponent={
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={{ fontSize: 20, fontWeight: 800, padding: 15 }}>Đăng ký</Text>
                        <HelperText type="error" visible={err}>{errContent}
                        </HelperText>
                        <TextInput mode="outlined" key={users['username'].key}
                            outlineColor="#CAC4D0"
                            labelTextColor="#CAC4D0"
                            activeOutlineColor="#FFBA00"
                            style={LoginStyles.textInput} label={users['username'].title}
                            value={user['username']} onChangeText={t => change(t, 'username')} />

                        <TextInput mode="outlined" key={users['first_name'].key}
                            outlineColor="#CAC4D0"
                            labelTextColor="#CAC4D0"
                            activeOutlineColor="#FFBA00"
                            style={LoginStyles.textInput} label={users['first_name'].title}
                            value={user['first_name']} onChangeText={t => change(t, 'first_name')} />

                        <TextInput mode="outlined" key={users['last_name'].key}
                            outlineColor="#CAC4D0"
                            labelTextColor="#CAC4D0"
                            activeOutlineColor="#FFBA00"
                            style={LoginStyles.textInput} label={users['last_name'].title}
                            value={user['last_name']} onChangeText={t => change(t, 'last_name')} />
                        <TextInput mode="outlined" key={users['password'].key}
                            secureTextEntry={true}
                            outlineColor="#CAC4D0"
                            labelTextColor="#CAC4D0"
                            activeOutlineColor="#FFBA00"
                            style={LoginStyles.textInput} label={users['password'].title}
                            value={user['password']} onChangeText={t => change(t, 'password')} />

                        <TextInput mode="outlined" key={users['confirm'].key}
                            secureTextEntry={secureTE}
                            outlineColor="#CAC4D0"
                            right={<TextInput.Icon icon={users['password'].icon} onPress={() => setSecureTE(!secureTE)} />}
                            labelTextColor="#CAC4D0"
                            activeOutlineColor="#FFBA00"
                            style={LoginStyles.textInput} label={users['confirm'].title}
                            value={user['confirm']} onChangeText={t => change(t, 'confirm')} />



                        <Text style={{ paddingStart: 20 }}>Bạn sử dụng ứng dụng với vai trò ?:</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', padding: 10, marginStart: 14 }}>


                            <View style={{ flexDirection: 'column', width: 100 }} >
                                <RadioButton
                                    color="#FFC11A"
                                    value={Role.NGUOI_THUE_TRO}
                                    status={checked === Role.NGUOI_THUE_TRO ? 'checked' : 'unchecked'}
                                    onPress={() => setChecked(Role.NGUOI_THUE_TRO)}
                                />
                                <Text>Người thuê trọ</Text>
                            </View>

                            <View style={{ flexDirection: 'column', width: 100 }} >
                                <RadioButton
                                    color="#FFC11A"
                                    value={Role.CHU_TRO}
                                    status={checked === Role.CHU_TRO ? 'checked' : 'unchecked'}
                                    onPress={() => { setChecked(Role.CHU_TRO) }}
                                />
                                <Text>Chủ trọ</Text>
                            </View>

                        </View>


                        <View style={{ flexDirection: 'row', width: 100, marginStart: 30, alignItems: 'center', marginTop: 10 }}>
                            <Text>Chọn avatar</Text>
                            {picked === false ?
                                <TouchableOpacity onPress={() => openImageLibrary({ limit: 1 })}>
                                    <Image source={require('../../assets/noavatar.png')} style={{ width: 120, height: 120, borderRadius: 100, marginHorizontal: 20 }} />
                                </TouchableOpacity>
                                : <View style={{
                                    marginHorizontal: 4, position: 'relative',
                                    backgroundColor: '#F5F5F5', borderRadius: 100, padding: 10, height: 120,
                                    width: 120, alignItems: 'center', justifyContent: 'center',
                                    elevation: 1
                                }}>
                                    <Image source={{ uri: img?.uri }} style={styles.image} />
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
                                        onPress={removeImage}
                                    />
                                </View>
                            }
                        </View>
                        {checked === Role.CHU_TRO ? <>
                            <TouchableOpacity onPress={() => { handleOpenSheet() }}>

                                <View>
                                    <TextInput
                                        mode="outlined"
                                        outlineColor="#CAC4D0"
                                        labelTextColor="#CAC4D0"
                                        activeOutlineColor="#FFBA00"
                                        editable={false}
                                        style={{
                                            backgroundColor: "white",
                                            borderColor: "#FFBA00",
                                            margin: 15,
                                        }}
                                        label="Địa chỉ"
                                        value={`${addressName.ward ? addressName.ward + ', ' : ''}${addressName.district ? addressName.district + ', ' : ''}${addressName.province}`}
                                    />
                                </View>
                            </TouchableOpacity>
                            <TextInput mode="outlined"
                                outlineColor="#CAC4D0"
                                labelTextColor="#CAC4D0"
                                activeOutlineColor="#FFBA00"
                                style={LoginStyles.textInput} label="Số điện thoại"
                                value={phone} onChangeText={t => setPhone(t)} />
                            <Button onPress={() => { sendOtp(); }} >Gởi mã OTP</Button>
                            <TextInput mode="outlined"
                                outlineColor="#CAC4D0"
                                keyboardType="number-pad"
                                labelTextColor="#CAC4D0"
                                
                                activeOutlineColor="#FFBA00"
                                style={LoginStyles.textInput} label="Nhập mã OTP"
                                value={otp} onChangeText={t => setOtp(t)} />
                            <TextInput mode="outlined"
                                outlineColor="#CAC4D0"
                                labelTextColor="#CAC4D0"
                                activeOutlineColor="#FFBA00"
                                style={LoginStyles.textInput} label="Địa chỉ cụ thể (Số nhà,Tên đường)"
                                value={specifiedAddress} onChangeText={t => setSpecifiedAddress(t)} />
                            <PickedImages imageList={images} setImageList={setImages} />

                        </> : <></>}


                        <Button style={{ margin: 15, borderRadius: 5, backgroundColor: '#FFBA00' }}
                            loading={loading} mode="contained"
                            onPress={() => {
                                setErr(false);
                                if (checked === Role.CHU_TRO) registerChuTro();
                                else register();

                            }}>ĐĂNG KÝ</Button>

                    </View>} />
            {isSheetVisible1 &&
                <BottomSheet
                    ref={sheetRef}
                    snapPoints={snapPoints}
                    enableDynamicSizing={false}
                    enablePanDownToClose={true}
                    backdropComponent={renderBackdrop}
                >
                    <Text>Tỉnh/Thành phố</Text>

                    <BottomSheetFlatList
                        data={provinces}
                        renderItem={renderProvinces}
                        keyExtractor={(item) => item.code.toString()}
                        contentContainerStyle={{ backgroundColor: 'white' }}
                    />
                </BottomSheet>}
            {isSheetVisible2 &&
                <BottomSheet
                    ref={sheetRef2}
                    enablePanDownToClose={true}
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

                </BottomSheet>}
            {isSheetVisible3 &&
                <BottomSheet
                    ref={sheetRef3}
                    enablePanDownToClose={true}
                    snapPoints={snapPoints3}
                    enableDynamicSizing={false}
                    backdropComponent={renderBackdrop}>
                    <Text>Xã/Phường</Text>
                    <BottomSheetFlatList
                        data={wards}
                        renderItem={renderWards}
                        keyExtractor={(item) => item.code.toString()}
                        contentContainerStyle={{ backgroundColor: 'white' }}
                    />
                </BottomSheet>}

        </View>


    )

}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10,
        flexDirection: 'row'
    },

    image: {
        elevation: 1,
        width: 120,
        height: 120,
        margin: 2,
        borderRadius: 100,
        resizeMode: 'cover'
    },
});



export default Register;