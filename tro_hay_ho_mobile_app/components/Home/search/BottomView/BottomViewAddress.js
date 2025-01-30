import React, { useCallback, useMemo, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Feather, Ionicons } from '@expo/vector-icons';

const renderFilterButton = (label, value, onPress) => (
    <TouchableOpacity
        style={styles.filterButton}
        onPress={onPress}
    >
        <Text style={styles.filterText}>{value}</Text>
        <Ionicons name="chevron-down" size={16} color="#666" />
    </TouchableOpacity>
);

const BottomViewAddress = forwardRef((props, ref) => {
    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => ['25%', '50%',], []);
    const [province, setProvince] = useState("chọn tỉnh/tp")
    const [district, setDistrict] = useState("chọn quận/huyện")
    const [ward, setWard] = useState("chọn xã/phường")
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
            province: province,
            district: district,
            ward: ward,
        }
        if (props.onSelectAddress) {
            props.onSelectAddress(address);
        }
    }, [props.onSelectAddress,province,district,ward]);

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            enablePanDownToClose={true}
            handleIndicatorStyle={{ backgroundColor: 'grey' }}
            handleStyle={{
                borderTopRightRadius: 8,
                borderTopLeftRadius: 8,
                backgroundColor: 'rgb(238, 238, 238)'
            }}
        >
            <BottomSheetView style={styles.contentContainer}>
                <Text>Khu vực</Text>
                <View style={styles.rowLine}>
                    {renderFilterButton(
                        'Tỉnh/TP',
                        province,
                        () => { },
                    )}
                </View>
                <View style={styles.rowLine}>
                    {renderFilterButton(
                        'Quận/Huyện',
                        district,
                        () => { },
                    )}
                </View>
                <View style={styles.rowLine}>
                    {renderFilterButton(
                        'Xã/Phường',
                        ward,
                        () => { },
                    )}
                </View>
                <TouchableOpacity
                    onPress={handleSelectAddress}
                    style={styles.button}
                >
                    <Text>Chọn khu vực</Text>
                </TouchableOpacity>
            </BottomSheetView>
        </BottomSheet>
    );
});

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        padding: 24,
        alignItems: 'center',
        backgroundColor: 'rgb(175, 174, 174)'
    },
    button: {
        backgroundColor: '#EEEEEE',
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
        borderColor: '#DDDDDD',
        marginRight: 8,
        backgroundColor: 'white',
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