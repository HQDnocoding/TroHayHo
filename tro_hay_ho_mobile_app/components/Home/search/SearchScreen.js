import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableWithoutFeedback, FlatList, RefreshControl, Keyboard, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Feather, Ionicons } from '@expo/vector-icons';
import PostCard from './PostCard';
import { myYellow } from '../../../utils/MyValues';
import BottomViewAddress from './BottomView/BottomViewAddress';
import BottomViewPrice from './BottomView/BottomViewPrice';
import BottomViewAcreage from './BottomView/BottomViewAcreage';
import BottomViewType from './BottomView/BottomViewType';
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
const SearchScreen = () => {
    const [selectedAcreage, setSelectedAcreage] = useState('Diện tích');
    const [selectedAddress, setSelectedAddress] = useState('Toàn quốc');
    const [selectedPrice, setSelectedPrice] = useState('Giá');
    const [selectedType, setSelectedType] = useState('Loại bài đăng');
    const [sortBy, setSortBy] = useState('newest');
    const bottomAddressRef = useRef(null);
    const bottomPriceRef = useRef(null);
    const bottomTypeRef = useRef(null);
    const bottomAcreageRef = useRef(null);

    const handleOpen = (type) => {
        switch (type) {
            case BottomSheetType.ADDRESS:
                bottomAddressRef.current?.open();
                //mot thang mo, 3 thang dong
                bottomAcreageRef.current?.close();
                bottomPriceRef.current?.close();
                bottomTypeRef.current?.close();

                break;
            case BottomSheetType.ACREAGE:
                bottomAcreageRef.current?.open();

                bottomAddressRef.current?.close();
                bottomPriceRef.current?.close();
                bottomTypeRef.current?.close();
                break;
            case BottomSheetType.PRICE:
                bottomPriceRef.current?.open();

                bottomAcreageRef.current?.close();
                bottomAddressRef.current?.close();
                bottomTypeRef.current?.close();
                break;
            case BottomSheetType.TYPE:
                bottomTypeRef.current?.open();

                bottomAcreageRef.current?.close();
                bottomPriceRef.current?.close();
                bottomAddressRef.current?.close();
                break;
            default:
                console.warn('Unknown bottom sheet type');
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
  

    const handleAddressSelected = (address) => {
        setSelectedAddress(`${address.province}, ${address.district},${address.ward}`);
        handleClose(BottomSheetType.ADDRESS);
    };
    const handlePriceSelected = (price) => {
        setSelectedPrice(`${price.min} - ${price.max}`);

        handleClose(BottomSheetType.PRICE);

    };
    const handleAcreageSelected = (acreage) => {
        setSelectedAcreage(`${acreage.min} - ${acreage.max}`);
        handleClose(BottomSheetType.ACREAGE);

    };
    const handleTypeSelected = (type) => {
        setSelectedType(type);
        handleClose(BottomSheetType.TYPE);

    };
    const handleSortChange = (value) => {
        setSortBy(value);
        // Optional: close bottom sheet after selection
        // closeBottomSheet();
    };

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
        )
    }
    const flatListHeader = () => {
        return (
            <View style={styles.mainContent}>

                <View style={styles.rowLine}>
                    {renderFilterButton(
                        'Area',
                        selectedAddress,
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
                <TouchableOpacity>
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
    return (
        <View style={styles.container}>

            <FlatList
                renderItem={renderItemPost}
                data={posts}
                ListHeaderComponent={flatListHeader} />
            <BottomViewAddress
                ref={bottomAddressRef}
                onSelectAddress={handleAddressSelected}
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
           
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
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