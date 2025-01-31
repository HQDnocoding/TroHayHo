import React, { useCallback, useRef, useMemo, forwardRef, useImperativeHandle } from "react";
import { StyleSheet, View, Text, Button, TouchableOpacity } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import APIs, { endpoints } from "../../../../../configs/APIs";

const Provinces = forwardRef((props, ref) => {
  // hooks
  const sheetRef = useRef(null);
  const [province, setProvince] = React.useState([])
  useImperativeHandle(ref, () => ({
    open: () => {
      sheetRef.current?.snapToIndex(0);
    },
    close: () => {
      sheetRef.current?.close();
    }
  }));
  const snapPoints = useMemo(() => ["60%", "90%"], []);

  // variables
  const data = useMemo(
    () =>
      Array(50)
        .fill(0)
        .map((_, index) => `index-${index}`),
    []
  );
  const loadProvinces = async () => {
    try {
      let res = await APIs.get(endpoints.provinces)
      if (res.data !== null) {
        setProvince(res.data)
      }
    } catch (error) {
      console.warn("try to get province", error);
    }
  }
  // callbacks
  const handleSheetChange = useCallback((index) => {
    console.log("handleSheetChange", index);
  }, []);

  const handleSelectProvince = (item) => {
    let selectProvince = item
    props.onSelectProvince(selectProvince)
  }

  React.useEffect(() => {
    loadProvinces()
  }, [])
  const renderItem = useCallback(
    ({ item }) => (
      <TouchableOpacity onPress={() => handleSelectProvince(item)}>
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
        data={province}
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

export default Provinces;