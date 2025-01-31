import React, { useCallback, useMemo, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { RadioButton } from 'react-native-paper';
import {TypeEnum} from '../SearchScreen'

const BottomViewType = forwardRef((props, ref) => {
    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => ['25%', '50%'], []);
    const [type, setType] = useState(TypeEnum.ALL);

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

    const handleSelectType = useCallback(() => {
        let typeValue = type;
        if (props.onSelectType) {
            props.onSelectType(typeValue);
        }
    }, [props.onSelectType, type]);

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
                <Text style={{margin:10,fontSize:20}}>Chọn loại bài đăng</Text>
                <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
                    <View style={styles.radioContainer}>
                        <RadioButton value={TypeEnum.ALL} />
                        <Text>Tất cả</Text>
                    </View>
                    <View style={styles.radioContainer}>
                        <RadioButton value={TypeEnum.POSTWANT} />
                        <Text>Muốn thuê</Text>
                    </View>
                    <View style={styles.radioContainer}>
                        <RadioButton value={TypeEnum.POSTFORRENT} />
                        <Text>Cho thuê</Text>
                    </View>
                </RadioButton.Group>

                <TouchableOpacity
                    onPress={handleSelectType}
                    style={styles.button}
                >
                    <Text>Chọn loại</Text>
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
    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
});

export default BottomViewType;