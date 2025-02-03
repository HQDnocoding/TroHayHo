import React, { useCallback, useMemo, useRef, forwardRef, useImperativeHandle, useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Keyboard, FlatList } from 'react-native';
import BottomSheet, { BottomSheetFlatList, BottomSheetView } from '@gorhom/bottom-sheet';
import { Feather, Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native-paper';
import { myYellow, tempUser, tempUser2 } from '../../../utils/MyValues';
import APIs, { endpointsDuc } from '../../../configs/APIs';
import { MyUserContext } from '../../../configs/UserContexts';
import SharePostCard from './SharePostCard';
import { isEnabled } from 'react-native/Libraries/Performance/Systrace';
const DATA = [
    { id: '1', title: 'Item 1' },
    { id: '2', title: 'Item 2' },
    { id: '3', title: 'Item 3' },
    { id: '4', title: 'Item 4' },
    { id: '5', title: 'Item 5' },
    { id: '6', title: 'Item 6' },
    { id: '7', title: 'Item 7' },
];

const BottomSheetSendToFollowed = forwardRef((props, ref) => {
    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => ['25%'], []);
    const currentUser = useContext(MyUserContext)
    // const currentUser = tempUser

    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [followed, setFollowed] = useState(null)

    useImperativeHandle(ref, () => ({
        open: () => {
            bottomSheetRef.current?.snapToIndex(0);
        },
        close: () => {
            bottomSheetRef.current?.close();
        }
    }));
  const handleSheetChange = useCallback( async(index) => {
    console.log("handleSheetChange", index);
    
  }, []);
    const loadUserFollowing = async () => {

        try {
            if (currentUser !== null && props.post != null && page > 0) {
                const res = await APIs.get(endpointsDuc.getListMeFollowing(currentUser.id))
                console.log(res.data);

                if (res.data !== null) {
                    if (page === 1) {
                        setFollowed(res.data.results)
                    } else {
                        setFollowed(prev => [...prev, res.data.results])
                    }

                    if (res.data.next === null) {
                        setPage(0)
                    }
                } else {
                    setPage(0)
                }

            }
        } catch (error) {
            console.warn("khong the load lay du lieu cac user dang theo doi", error)
            setPage(0)
        }
    }
    const loadMore = () => {
        if (page > 0) {

            setPage(prev => prev + 1)
        }
    }
    React.useEffect(() => {
        console.log("yes",props.post);

        if (currentUser !== null && props.post != null) {
            setPage(0); 
            setTimeout(() => setPage(1), 0);
        }
    }, [props.post])
    React.useEffect(() => {
        console.log("non",props.post);
        if (currentUser !== null && props.post != null && page > 0) {
            loadUserFollowing()
        }
    }, [page])
    const renderItem = ({ item }) => (
        <SharePostCard followed={item.followed} follower={item.follower} post={props.post} />
    );
    //   const renderItem = useCallback(
    //     ({ item }) => (
    //       <SharePostCard/>
    
    //     ),
    //     []
    //   );
    return (
        <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        onChange={handleSheetChange}
        enablePanDownToClose={true}
        enableHandlePanningGesture={true}
        index={-1}
        handleIndicatorStyle={{ backgroundColor: 'white' }}
        handleStyle={{
          borderTopRightRadius: 8,
          borderTopLeftRadius: 8,
          backgroundColor: "rgb(255, 215, 121)"
        }}
  
      >
        <BottomSheetFlatList
          data={followed}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.contentContainer}
            horizontal={true}
        />
      </BottomSheet>
      
    );
});

const styles = StyleSheet.create({
    contentContainer: {
        // flex: 1,
        // padding: 24,
        // alignItems: 'center',
        backgroundColor: 'white'
    },
    input: {
        width: '100%',
        marginBottom: 10,
        backgroundColor: 'white'
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
        backgroundColor: "rgb(255, 215, 121)",
        justifyContent: 'space-between',
    },

    icon: {
        marginRight: 4,
    },
    item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginHorizontal: 10,
        borderRadius: 10,
    },
    title: {
        fontSize: 32,
    },
    itemContainer: {
        padding: 10,
        height:100,
        borderBottomWidth: 0.8,
        borderBottomColor: 'rgb(230, 230, 230)',
        backgroundColor: 'rgb(255, 255, 255)'
      },

});

export default BottomSheetSendToFollowed;
  // <BottomSheet
        //     ref={bottomSheetRef}
        //     index={-1}
        //     snapPoints={snapPoints}
        //     enablePanDownToClose={true}
        //     enableDynamicSizing={false}

        //     handleIndicatorStyle={{ backgroundColor: 'white' }}
        //     handleStyle={{
        //         borderTopRightRadius: 8,
        //         borderTopLeftRadius: 8,
        //         backgroundColor: "rgb(255, 215, 121)"
        //     }}
        // >
        //     <BottomSheetView style={styles.contentContainer}>
        //         <BottomSheetFlatList
        //             data={DATA}
        //             renderItem={renderItem}
        //             keyExtractor={item => item.id}
        //             showsHorizontalScrollIndicator={false} // Ẩn thanh cuộn ngang
        //             contentContainerStyle={styles.contentContainer}

        //         />
        //     </BottomSheetView>
        // </BottomSheet>