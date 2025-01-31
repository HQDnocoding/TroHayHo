import React, { useCallback, useMemo, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { RadioButton ,Provider as PaperProvider, DefaultTheme} from 'react-native-paper';
import { TypeEnum } from '../SearchScreen'
import { myYellow } from '../../../../utils/MyValues';
const customTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: myYellow, // Màu cho indicator
    },
   
};
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
            handleIndicatorStyle={{ backgroundColor: 'white' }}
            handleStyle={{
                borderTopRightRadius: 8,
                borderTopLeftRadius: 8,
                backgroundColor: "rgb(255, 215, 121)"
            }}
        >
            <BottomSheetView style={styles.contentContainer}>
                <Text style={{ margin: 10, fontSize: 20 }}>Chọn loại bài đăng</Text>
                <PaperProvider theme={customTheme}>
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
        </PaperProvider>

               
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
    button: {
        backgroundColor: 'rgb(255, 215, 121)',
        padding: 10,
        borderRadius: 8,
        marginTop: 10,
        justifyContent:'center',
        alignItems:'center'
    },
    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
});

export default BottomViewType;