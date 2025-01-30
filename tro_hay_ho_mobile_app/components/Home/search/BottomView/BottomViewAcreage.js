import React, { useCallback, useMemo, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,Keyboard } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Feather, Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native-paper';


const BottomViewAcreage = forwardRef((props, ref) => {
    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => ['25%', '50%',], []);
    const [minAcreage, setMinAcreage] = useState(0)
    const [maxAcreage, setMaxAcreage] = useState(0)

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

    const handleSelectAcreage = useCallback(() => {
        Keyboard.dismiss();
        let acreage = {
            min: minAcreage,
            max: maxAcreage,
        }
        if (props.onSelectAcreage) {
            props.onSelectAcreage(acreage);
        }
    }, [maxAcreage,minAcreage,props.onSelectAcreage]);

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
                <Text>Diện tích</Text>
                <TextInput
                    label="Diện tích tối thiểu"
                    value={minAcreage}
                    onChangeText={setMinAcreage}
                    keyboardType="numeric"
                    style={styles.input}
                />
                <TextInput
                    label="Diện tích tối đa"
                    value={maxAcreage}
                    onChangeText={setMaxAcreage}
                    keyboardType="numeric"
                    style={styles.input}
                />
                <TouchableOpacity
                    onPress={handleSelectAcreage}
                    style={styles.button}
                >
                    <Text>Lọc diện tích</Text>
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
    input: {
        width: '100%',
        marginBottom: 10,
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

export default BottomViewAcreage;