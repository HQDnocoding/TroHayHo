import React, { useCallback, useRef, useMemo, forwardRef, useImperativeHandle } from "react";
import { StyleSheet, View, Text, Button, TouchableOpacity } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import APIs, { endpoints } from "../../../../../configs/APIs";

const Wards = forwardRef((props, ref) => {
  // hooks
  const sheetRef = useRef(null);
  const [ward, setWard] = React.useState([])
  useImperativeHandle(ref, () => ({
    open: () => {
      sheetRef.current?.snapToIndex(0);
    },
    close: () => {
      sheetRef.current?.close();
    }
  }));
  const snapPoints = useMemo(() => ["60%", "90%"], []);


  const loadWards = async () => {
    try {
      if (props.selectedDistrict.code !== "-1" && props.selectedProvince.code !== "-1") {
        let res = await APIs.get(endpoints["provinces-districts-wards"](props.selectedProvince.code, props.selectedDistrict.code))
        if (res.data !== null) {
          setWard(res.data)
        }
      } else {
        setWard([])
      }
    } catch (error) {
      console.warn("try to get province", error);
    }
  }
  // callbacks
  const handleSheetChange = useCallback((index) => {
    console.log("handleSheetChange", index);
  }, []);

  const handleSelectWard = (item) => {
    props.onSelectWard(item)
  }

  React.useEffect(() => {
    loadWards()
  }, [props.selectedDistrict, props.selectedProvince])
  const renderItem = useCallback(
    ({ item }) => (
      <TouchableOpacity onPress={() => handleSelectWard(item)}>
        <View style={styles.itemContainer}>
          <Text>{item.name}</Text>
        </View>
      </TouchableOpacity>

    ),
    []
  );

  return (

    <BottomSheet
      ref={sheetRef}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      onChange={handleSheetChange}
      enablePanDownToClose={true}
      index={-1}
      handleIndicatorStyle={{ backgroundColor: 'white' }}
      handleStyle={{
        borderTopRightRadius: 8,
        borderTopLeftRadius: 8,
        backgroundColor: "rgb(255, 215, 121)"
      }}

    >
      <BottomSheetFlatList
        data={ward}
        keyExtractor={(item) => item.code}
        renderItem={renderItem}
        contentContainerStyle={styles.contentContainer}

      />
    </BottomSheet>
  );
})

const styles = StyleSheet.create({

  contentContainer: {

    backgroundColor: 'rgb(175, 174, 174)'
  },

  itemContainer: {
    padding: 10,
    borderBottomWidth: 0.8,
    borderBottomColor: 'rgb(230, 230, 230)',
    backgroundColor: 'rgb(255, 255, 255)'
  },
});

export default Wards;