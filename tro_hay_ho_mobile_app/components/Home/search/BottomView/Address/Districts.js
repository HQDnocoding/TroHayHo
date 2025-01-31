import React, { useCallback, useRef, useMemo, forwardRef, useImperativeHandle } from "react";
import { StyleSheet, View, Text, Button, TouchableOpacity } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import APIs, { endpoints } from "../../../../../configs/APIs";

const Districts = forwardRef((props, ref) => {
  // hooks
  const sheetRef = useRef(null);
  const [district, setDistrict] = React.useState([])
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
  const loadDistrict = async () => {
    try {
      if (props.selectedProvince.code !== "-1") {
        let res = await APIs.get(endpoints["provinces-districts"](props.selectedProvince.code))
        if (res.data !== null) {
          setDistrict(res.data)
        }
      }else{
        setDistrict([])
      }

    } catch (error) {
      console.warn("try to get district", error);
    }
  }
  // callbacks
  const handleSheetChange = useCallback((index) => {
    console.log("handleSheetChange", index);
  }, []);

  const handleSelectDistrict = (item) => {
    props.onSelectDistrict(item)
  }

  React.useEffect(() => {
    loadDistrict()
  }, [props.selectedProvince])
  const renderItem = useCallback(
    ({ item }) => (
      <TouchableOpacity onPress={() => handleSelectDistrict(item)}>
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
      handleIndicatorStyle={{ backgroundColor: 'grey' }}
      handleStyle={{
        borderTopRightRadius: 8,
        borderTopLeftRadius: 8,
        backgroundColor: 'rgb(238, 238, 238)'
      }}

    >
      <BottomSheetFlatList
        data={district}
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
    borderBottomColor: 'grey',
    backgroundColor: 'rgb(175, 174, 174)'
  },
});

export default Districts;