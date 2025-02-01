import React, { useCallback, useMemo, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Keyboard } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Feather, Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native-paper';
import { myYellow } from '../../../../utils/MyValues';


const BottomViewPrice = forwardRef((props, ref) => {
    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => ['25%', '60%', "90%"], []);
    const [minPrice, setMinPrice] = useState(0)
    const [maxPrice, setMaxPrice] = useState(0)

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

    const handleSelectPrice = useCallback(() => {
        Keyboard.dismiss();
        let price = {
            min: minPrice,
            max: maxPrice,
        }
        if (props.onSelectPrice) {
            props.onSelectPrice(price);
        }
    }, [maxPrice, minPrice, props.onSelectPrice]);
    const handleUnSelect = useCallback(() => {
        Keyboard.dismiss();
        let price = {
            min: "0",
            max: "0",
        }
        if (props.onSelectPrice) {
            props.onSelectPrice(price);
        }
    }, [maxPrice, minPrice, props.onSelectPrice]);

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
                <Text style={{ margin: 10, fontSize: 20 }}>Giá</Text>
                <TextInput
                    label="Giá tối thiểu"
                    value={minPrice}
                    onChangeText={setMinPrice}
                    keyboardType="numeric"
                    style={styles.input}
                />
                <TextInput
                    label="Giá tối đa"
                    value={maxPrice}
                    onChangeText={setMaxPrice}
                    keyboardType="numeric"
                    style={styles.input}
                />
                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-around', }}>
                    <TouchableOpacity
                        onPress={handleSelectPrice}
                        style={styles.button}
                    >
                        <Text>Lọc giá</Text>
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
        backgroundColor: 'white'
    },
    input: {
        width: '100%',
        marginBottom: 10,
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

export default BottomViewPrice;