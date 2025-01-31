import React, { useCallback, useMemo, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Feather, Ionicons } from '@expo/vector-icons';
import { AddressEnum, noneDistrict, noneProvince, noneWard } from '../SearchScreen';
import { myYellow } from '../../../../utils/MyValues';

const renderFilterButton = (label, value, onPress) => {
    return (
        <TouchableOpacity
            style={styles.filterButton}
            onPress={onPress}
        >
            <Text style={styles.filterText}>{value}</Text>
            <Ionicons name="chevron-down" size={16} color="#666" />

        </TouchableOpacity>
    )

}

const BottomViewAddress = forwardRef((props, ref) => {

    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => ['25%', '50%'], []);
    useImperativeHandle(ref, () => ({
        open: () => {
            bottomSheetRef.current?.snapToIndex(1);
        },
        close: () => {
            bottomSheetRef.current?.close();
        }
    }));

    const handleSheetChanges = useCallback((index) => {
        // console.log('handleSheetChanges', index);
    }, []);

    const handleSelectAddress = useCallback(() => {
        let address = {
            province: props.province,
            district: props.district,
            ward: props.ward,
        }
        if (props.onSelectAddress) {
            props.onSelectAddress(address);
        }
    }, [props.onSelectAddress, props.province, props.district, props.ward]);
    const handleUnSelect = useCallback(() => {
       
        if (props.onUnSelectAddress) {
            props.onUnSelectAddress();
        }
    }, [props.onUnSelectAddress, props.province, props.district, props.ward]);
    const handleOpenProvince = useCallback(() => {
        if (props.onOpenProvince) {

            props.onOpenProvince(AddressEnum.PROVINCE)
        }

    }, [props.onOpenProvince])
    const handleOpenDistrict = useCallback(() => {
        if (props.onOpenDistrict) {

            props.onOpenDistrict(AddressEnum.DISTRICT)
        }

    }, [props.onOpenDistrict])
    const handleOpenWard = useCallback(() => {
        if (props.onOpenWard) {

            props.onOpenWard(AddressEnum.WARD)
        }
    }, [props.onOpenWard])



    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            enablePanDownToClose={true}
            handleIndicatorStyle={{ backgroundColor: 'white' }}
            handleStyle={{
                borderTopRightRadius: 8,
                borderTopLeftRadius: 8,
                backgroundColor: "rgb(255, 215, 121)"
            }}
        >
            <BottomSheetView style={styles.contentContainer}>
                <Text>Khu vực</Text>
                <View style={styles.rowLine}>
                    {renderFilterButton(
                        'Tỉnh/TP',
                        props.province.name,
                        handleOpenProvince,
                    )}
                </View>
                <View style={styles.rowLine}>
                    {renderFilterButton(
                        'Quận/Huyện',
                        props.district.name,
                        handleOpenDistrict,
                    )}
                </View>
                <View style={styles.rowLine}>
                    {renderFilterButton(
                        'Xã/Phường',
                        props.ward.name,
                        handleOpenWard,
                    )}
                </View>
                <View style={{width:'100%', flexDirection: 'row', justifyContent: 'space-around',  }}>
                    <TouchableOpacity
                        onPress={handleSelectAddress}
                        style={styles.button}
                    >
                        <Text style={{ color: 'black' }}>Chọn khu vực</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleUnSelect}
                        style={styles.buttonNegative}
                    >
                        <Text style={{ color: 'black' }}>Bỏ chọn</Text>
                    </TouchableOpacity>
                </View>

            </BottomSheetView>
        </BottomSheet>
    );
});

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        padding: 24,
        alignItems: 'center',
        backgroundColor: 'rgb(255, 255, 255)'
    },
    button: {
        backgroundColor: "rgb(255, 215, 121)",
        padding: 10,
        borderRadius: 8,
        marginTop: 10
    }, buttonNegative: {
        borderColor: myYellow,
        borderWidth: 0.8,
        backgroundColor: "rgb(255, 255, 255)",
        padding: 10,
        borderRadius: 8,
        marginTop: 10
    },
    filterButton: {
        width: "100%",
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'rgb(199, 199, 199)',
        marginRight: 8,
        backgroundColor: 'rgb(250, 237, 213)',
        justifyContent: 'space-between',

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
    rowLine: {
        width: "300",
        margin: 10,
        flexDirection: "row",
        alignItems: 'center',
    },
});

export default BottomViewAddress;