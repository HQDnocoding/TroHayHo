import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableWithoutFeedback, FlatList, RefreshControl, Keyboard, TouchableOpacity, Animated, ScrollView, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Feather, Ionicons } from '@expo/vector-icons';
import PostCard from './PostCard';
import { myYellow } from '../../../utils/MyValues';
import BottomViewAddress from './BottomView/BottomViewAddress';
import BottomViewPrice from './BottomView/BottomViewPrice';
import BottomViewAcreage from './BottomView/BottomViewAcreage';
import BottomViewType from './BottomView/BottomViewType';
import Provinces from './BottomView/Address/Provinces';
import Districts from './BottomView/Address/Districts';
import Wards from './BottomView/Address/Wards';
import { parseStringToFloat } from '../../../utils/MyFunctions';
import { endpointsDucFilter } from '../../../configs/UrlFilter';
import APIs from '../../../configs/APIs';
const CustomRadioButton = ({ selected, onSelect }) => {
    const [animation] = useState(new Animated.Value(selected === 'newest' ? 0 : 1));

    const handleSelection = (value) => {
        onSelect(value);
        Animated.spring(animation, {
            toValue: value === 'newest' ? 0 : 1,
            useNativeDriver: true,
            tension: 50,
            friction: 7
        }).start();
    };

    const translateX = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 100]
    });

    return (
        <View style={styles.radioContainer}>
            <Animated.View
                style={[
                    styles.selectIndicator,
                    { transform: [{ translateX }] }
                ]}
            />

            <TouchableOpacity
                style={styles.radioOption}
                onPress={() => handleSelection('newest')}
                activeOpacity={0.7}
            >
                <Text style={[
                    styles.radioText,
                    selected === 'newest' && styles.selectedRadioText
                ]}>
                    Mới nhất
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.radioOption}
                onPress={() => handleSelection('oldest')}
                activeOpacity={0.7}
            >
                <Text style={[
                    styles.radioText,
                    selected === 'oldest' && styles.selectedRadioText
                ]}>
                    Cũ nhất
                </Text>
            </TouchableOpacity>
        </View>
    );
};
const posts = [{
    type: "PostWant"
},
{
    type: "PostForRent"
},
{
    type: "PostWant"
},
{
    type: "PostForRent"
}]
const BottomSheetType = {
    ADDRESS: 'ADDRESS',
    ACREAGE: 'ACREAGE',
    PRICE: 'PRICE',
    TYPE: 'TYPE',
};
export const AddressEnum = {
    PROVINCE: 'PROVINCE',
    DISTRICT: 'DISTRICT',
    WARD: 'WARD',
};
export const TypeEnum = {
    ALL: "ALL",
    POSTWANT: "POSTWANT",
    POSTFORRENT: "POSTFORRENT"
};

export const noneProvince = { code: "-1", name: "chọn tỉnh/tp", full_name: "chọn tỉnh/tp" }
export const noneDistrict = { code: "-1", name: "chọn quận/huyện", full_name: "chọn quận/huyện" }
export const noneWard = { code: "-1", name: "chọn xã/phường", full_name: "chọn xã/phường" }
export const SearchScreen = () => {
    const [allPost, setAllPost] = useState([])
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [urlFilter, setUrlFilter] = useState("/post-parent/?is_newest=1")

    //chi de hien thi
    const [selectedAcreage, setSelectedAcreage] = useState('Diện tích');
    const [selectedAddress, setSelectedAddress] = useState('Toàn quốc');
    const [selectedPrice, setSelectedPrice] = useState('Giá');
    const [selectedType, setSelectedType] = useState('Loại bài đăng');
    //du lieu chinh
    //dia chi trung gian
    const [province, setProvince] = useState(noneProvince)
    const [district, setDistrict] = useState(noneDistrict)
    const [ward, setWard] = useState(noneWard)
    //dia chi sau khi da chon
    const [selectedProvince, setSelectedProvince] = useState(noneProvince)
    const [selectedDistrict, setSelectedDistrict] = useState(noneDistrict)
    const [selectedWard, setSelectedWard] = useState(noneWard)
    //dien tich
    const [minAcreage, setMinAcreage] = useState(0)
    const [maxAcreage, setMaxAcreage] = useState(0)
    //gia
    const [minPrice, setMinPrice] = useState(0)
    const [maxPrice, setMaxPrice] = useState(0)
    //loai bai dang
    const [type, setType] = useState(TypeEnum.ALL);

    const bottomAddressRef = useRef(null);
    const bottomPriceRef = useRef(null);
    const bottomTypeRef = useRef(null);
    const bottomAcreageRef = useRef(null);

    const bottomProvincesRef = useRef(null);
    const bottomDistrictsRef = useRef(null);
    const bottomWardsRef = useRef(null);

    const [sortBy, setSortBy] = useState('newest');
    const handleOpen = (type) => {
        switch (type) {
            case BottomSheetType.ADDRESS:
                bottomAddressRef.current?.open();
                //mot thang mo, 3 thang dong
                bottomAcreageRef.current?.close();
                bottomPriceRef.current?.close();
                bottomTypeRef.current?.close();

                bottomDistrictsRef.current?.close();
                bottomWardsRef.current?.close();
                bottomProvincesRef.current?.close();
                break;
            case BottomSheetType.ACREAGE:
                bottomAcreageRef.current?.open();

                bottomAddressRef.current?.close();
                bottomPriceRef.current?.close();
                bottomTypeRef.current?.close();

                bottomDistrictsRef.current?.close();
                bottomWardsRef.current?.close();
                bottomProvincesRef.current?.close();
                break;
            case BottomSheetType.PRICE:
                bottomPriceRef.current?.open();

                bottomAcreageRef.current?.close();
                bottomAddressRef.current?.close();
                bottomTypeRef.current?.close();

                bottomDistrictsRef.current?.close();
                bottomWardsRef.current?.close();
                bottomProvincesRef.current?.close();
                break;
            case BottomSheetType.TYPE:
                bottomTypeRef.current?.open();

                bottomAcreageRef.current?.close();
                bottomPriceRef.current?.close();
                bottomAddressRef.current?.close();

                bottomDistrictsRef.current?.close();
                bottomWardsRef.current?.close();
                bottomProvincesRef.current?.close();
                break;
            default:
                console.warn('Unknown bottom sheet type');
        }
    };
    const handleAddressOpen = (type) => {
        switch (type) {
            case AddressEnum.PROVINCE:
                bottomProvincesRef.current?.open();
                //mot thang mo, 3 thang dong
                bottomDistrictsRef.current?.close();
                bottomWardsRef.current?.close();

                break;
            case AddressEnum.DISTRICT:
                bottomDistrictsRef.current?.open();
                //mot thang mo, 3 thang dong
                bottomProvincesRef.current?.close();
                bottomWardsRef.current?.close();

                break;
            case AddressEnum.WARD:
                bottomWardsRef.current?.open();
                //mot thang mo, 3 thang dong
                bottomDistrictsRef.current?.close();
                bottomProvincesRef.current?.close();

                break;

            default:
                console.warn('Unknown bottom sheet address type');
        }
    };
    const handleClose = (type) => {
        switch (type) {
            case BottomSheetType.ADDRESS:
                bottomAddressRef.current?.close();
                break;
            case BottomSheetType.ACREAGE:
                bottomAcreageRef.current?.close();
                break;
            case BottomSheetType.PRICE:
                bottomPriceRef.current?.close();
                break;
            case BottomSheetType.TYPE:
                bottomTypeRef.current?.close();
                break;
            default:
                console.warn('Unknown bottom sheet type');
        }
    };
    const handleAddressClose = (type) => {
        switch (type) {
            case AddressEnum.PROVINCE:
                bottomProvincesRef.current?.close();
                break;
            case AddressEnum.DISTRICT:
                bottomDistrictsRef.current?.close();
                break;
            case AddressEnum.WARD:
                bottomWardsRef.current?.close();
                break;

            default:
                console.warn('Unknown bottom sheet address type');
        }
    };


    const handleAddressSelected = (address) => {
        setSelectedProvince(address.province)
        setSelectedDistrict(address.district)
        setSelectedWard(address.ward)

        handleClose(BottomSheetType.ADDRESS);
    };
    const handleAddressUnSelected = () => {
        setSelectedProvince(noneProvince)
        setSelectedDistrict(noneDistrict)
        setSelectedWard(noneWard)
        setProvince(noneProvince)
        setDistrict(noneDistrict)
        setWard(noneWard)

        handleClose(BottomSheetType.ADDRESS);
    };
    const handlePriceSelected = (price) => {
        setMinPrice(parseStringToFloat(price.min))
        setMaxPrice(parseStringToFloat(price.max))


        handleClose(BottomSheetType.PRICE);

    };
    const handleAcreageSelected = (acreage) => {
        setMinAcreage(parseStringToFloat(acreage.min))
        setMaxAcreage(parseStringToFloat(acreage.max))
        handleClose(BottomSheetType.ACREAGE);

    };
    const handleTypeSelected = (newType) => {
        setType(newType)
        handleClose(BottomSheetType.TYPE);

    };
    const handleProvinceSelected = (item) => {
        let selectProvince = item

        setProvince(selectProvince)
        setDistrict(noneDistrict)
        setWard(noneWard)
        handleAddressClose(AddressEnum.PROVINCE)

    }
    const handleDistrictSelected = (item) => {

        setDistrict(item)
        setWard(noneWard)

        handleAddressClose(AddressEnum.DISTRICT)

    }
    const handleWardSelected = (item) => {

        setWard(item)
        handleAddressClose(AddressEnum.WARD)

    }
    const handleSortChange = (value) => {
        setSortBy(value);
        // Optional: close bottom sheet after selection
        // closeBottomSheet();
    };
    const getUrlFilter = () => {
        let url = endpointsDucFilter
        if (selectedProvince.code !== "-1") {
            url.province_code(selectedProvince.code)
        } else {
            url.params.delete('province_code');
        }
        if (selectedDistrict.code !== "-1") {
            url.district_code(selectedDistrict.code)
        } else {
            url.params.delete('district_code');
        }
        if (selectedWard.code !== "-1") {
            url.ward_code(selectedWard.code)
        } else {
            url.params.delete('ward_code');
        }


        if (maxAcreage > 0) {
            url.max_acreage(maxAcreage);
        } else {
            url.params.delete('max_acreage');
        }
        if (minAcreage > 0) {
            url.min_acreage(minAcreage);
        } else {
            url.params.delete('min_acreage');
        }



        if (maxPrice > 0) {
            url.max_price(maxPrice)
        } else {
            url.params.delete('max_price');
        }
        if (minPrice !== 0) {
            url.min_price(minPrice)
        } else {
            url.params.delete('min_price');
        }

        if (type) {
            url.type(type.toLowerCase())
        }
        if (sortBy.toString() === "newest") {
            url.is_newest(1)
        } else if (sortBy.toString() === "oldest") {
            url.is_newest(0)
        } else {
            url.is_newest(1)

        }
        let finalUrl = url.build()
        return finalUrl
    }
    const loadAllPost = async () => {

        setLoading(true)
        try {
            if (page > 0) {
                let url = urlFilter

                url = `${url}&page=${page}`
                const res = await APIs.get(url)
                if (page === 1) {
                    setAllPost(res.data.results)
                } else {
                    setAllPost(pre => [...pre, ...res.data.results])
                }
                if (res.data.next === null) {
                    setPage(0)
                }
                // console.info('post ', res.data.results)

            }

        } catch (error) {
            console.warn("loi lay post", error," page ", page, " url ",urlFilter)
            setPage(0)
        } finally {
            setLoading(false)
        }

    }
    const loadMore=()=>{
        if(page>0)
        {

            setPage(page+1)
        }
    }
    const handleFilter = () => {
        console.info('save ', getUrlFilter())
        setAllPost([])
        setLoading(true)
        setUrlFilter(getUrlFilter())
        setPage(0); // Reset page ve lai 0 de efect chay lai
        setTimeout(() => setPage(1), 0);

    }
    const renderFilterButton = (label, value, onPress, icon) => (
        <TouchableOpacity
            style={styles.filterButton}
            onPress={onPress}
        >
            {icon && <Ionicons name={icon} size={18} color="#666" style={styles.icon} />}
            <Text style={styles.filterText}>{value}</Text>
            <Ionicons name="chevron-down" size={16} color="#666" />
        </TouchableOpacity>
    );
    const renderItemPost = ({ item }) => {
        return (
            <PostCard item={item} />
            // <View >
            //     <Text>{item.id}</Text>
            // </View>
        )
    }
    const flatListHeader = () => {
        return (
            <View style={styles.mainContent}>

                <View style={styles.rowLine}>
                    {renderFilterButton(
                        'Area',
                        selectedAddress,
                        // () => handleOpen(BottomSheetType.ADDRESS),
                        () => handleOpen(BottomSheetType.ADDRESS),
                        'location-outline'
                    )}
                </View>
                <View style={styles.rowLine}>
                    {renderFilterButton(
                        'Acreage',
                        selectedAcreage,
                        () => handleOpen(BottomSheetType.ACREAGE),
                        'speedometer-outline'
                    )}
                </View>
                <View style={styles.rowLine}>
                    {renderFilterButton(
                        'Price',
                        selectedPrice,
                        () => handleOpen(BottomSheetType.PRICE),
                        'funnel-outline'
                    )}

                    {renderFilterButton(
                        'Type',
                        selectedType,
                        () => handleOpen(BottomSheetType.TYPE),
                        "construct-outline"
                    )}
                </View>
                <Text style={styles.bottomSheetTitle}>Sắp xếp theo</Text>
                <CustomRadioButton
                    selected={sortBy}
                    onSelect={handleSortChange}
                />
                <TouchableOpacity onPress={handleFilter}>
                    <View style={{
                        backgroundColor: myYellow,
                        padding: 10,
                        margin: 10,
                        width: 100,
                        borderRadius: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <Text style={{ fontSize: 18, fontWeight: 500 }}>Lọc</Text>
                    </View>
                </TouchableOpacity>
                <View style={{ borderBottomColor: 'gray', width: "100%", height: 1, borderBottomWidth: 1, marginVertical: 20 }}></View>

            </View>
        )
    }
    React.useEffect(() => {
        if (selectedProvince.code === "-1") {
            setSelectedAddress("Toàn quốc")
        } else if (selectedDistrict.code === "-1" && selectedProvince.code !== "-1") {
            setSelectedAddress(`${selectedProvince.name}`)
        } else if (selectedWard.code === "-1" && selectedDistrict.code !== "-1" && selectedProvince.code !== "-1") {
            setSelectedAddress(`${selectedProvince.name}, ${selectedDistrict.name}`)
        } else {
            setSelectedAddress(`${selectedProvince.name}, ${selectedDistrict.name},${selectedWard.name}`);
        }
    }, [selectedProvince, selectedDistrict, selectedWard])
    React.useEffect(() => {
        if (minPrice === 0 && maxPrice === 0) {
            setSelectedPrice(`Mọi giá`);
        } else if (minPrice === 0) {

            setSelectedPrice(`< ${maxPrice}`);
        } else if (maxPrice === 0) {
            setSelectedPrice(`> ${minPrice}`);

        } else {

            setSelectedPrice(`${minPrice} - ${maxPrice}`);
        }


    }, [minPrice, maxPrice])
    React.useEffect(() => {
        if (minAcreage === 0 && maxAcreage === 0) {
            setSelectedAcreage(`Mọi Diện tích`);
        } else if (minAcreage === 0) {

            setSelectedAcreage(`< ${maxAcreage}`);
        } else if (maxAcreage === 0) {
            setSelectedAcreage(`> ${minAcreage}`);

        } else {

            setSelectedAcreage(`${minAcreage} - ${maxAcreage}`);

        }

    }, [minAcreage, maxAcreage])
    React.useEffect(() => {
        switch (type) {
            case TypeEnum.ALL:
                setSelectedType("Tất cả");
                break
            case TypeEnum.POSTFORRENT:
                setSelectedType("Cho thuê");
                break
            case TypeEnum.POSTWANT:
                setSelectedType("Muốn thuê");
                break
            default:
                setSelectedType("Tất cả");


        }


    }, [type])
    React.useEffect(() => {
        if(page>0){

            loadAllPost()
        }


    }, [page])
    return (
        <View style={styles.container}>

            <FlatList
                onEndReached={loadMore}
                renderItem={renderItemPost}
                data={allPost}
                onEndReachedThreshold={0.5}
                ListHeaderComponent={flatListHeader} 
                ListFooterComponent= {loading &&<ActivityIndicator animating={loading} />}
                />

               

            <BottomViewAddress
                ref={bottomAddressRef}
                onSelectAddress={handleAddressSelected}
                onUnSelectAddress={handleAddressUnSelected}
                onOpenProvince={handleAddressOpen}
                onOpenDistrict={handleAddressOpen}
                onOpenWard={handleAddressOpen}
                addressEnum={AddressEnum}
                province={province}
                district={district}
                ward={ward}

            />
            <BottomViewPrice
                ref={bottomPriceRef}
                onSelectPrice={handlePriceSelected}
            />
            <BottomViewAcreage
                ref={bottomAcreageRef}
                onSelectAcreage={handleAcreageSelected}
            />
            <BottomViewType
                ref={bottomTypeRef}
                onSelectType={handleTypeSelected}
            />
            <Provinces
                ref={bottomProvincesRef}
                onSelectProvince={handleProvinceSelected}
            />
            <Districts
                ref={bottomDistrictsRef}
                onSelectDistrict={handleDistrictSelected}
                selectedProvince={province}
            />
            <Wards
                ref={bottomWardsRef}
                onSelectWard={handleWardSelected}
                selectedDistrict={district}
                selectedProvince={province}

            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingBottom:20,
    },
    mainContent: {
        flex: 1,
        justifyContent: 'start',
        alignItems: 'start',
    },
    greetingText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
    },
    contentContainer: {
        flex: 1,
        padding: 24,
        alignItems: 'center',
    },
    bottomSheetTitle: {
        marginStart: 10,
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 24,
        color: '#000',
    },
    rowLine: {
        margin: 10,
        flexDirection: "row",
        alignItems: 'center'
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#DDDDDD',
        marginRight: 8,
        backgroundColor: 'white',
    },
    sortButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    filterText: {
        fontSize: 14,
        marginRight: 4,
    },
    icon: {
        marginRight: 4,
    },
    // Radio button styles
    radioContainer: {
        flexDirection: 'row',
        backgroundColor: '#F0F0F0',
        borderRadius: 25,
        position: 'relative',
        height: 40,
        width: 200,
    },
    selectIndicator: {
        position: 'absolute',
        width: '50%',
        height: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    radioOption: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666666',
    },
    selectedRadioText: {
        color: '#000000',
        fontWeight: '600',
    }
});

export default SearchScreen;