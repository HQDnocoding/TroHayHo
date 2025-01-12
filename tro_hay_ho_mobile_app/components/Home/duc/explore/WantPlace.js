import {View, Text, StyleSheet, Touchable} from "react-native";
import React from "react";
import {Card, Modal, TextInput} from "react-native-paper";
import {TouchableNativeFeedback} from "react-native"
import AddressDialog from "./AddressDialog";
const WantPlace = ({openDialog}) => {

    return (

        <Card style={styles.container}>
            <View>
                <Text style={styles.text}>Bạn muốn xem ở đâu</Text>
                <TouchableNativeFeedback onPress={openDialog}>
                     <View style={styles.boxAddress}>
                    <Text style={{fontSize: 15}}>Địa điểm</Text>
                </View>
                </TouchableNativeFeedback>

                <View style={styles.smallInputContainer}>
                    <TextInput
                        label={"Giá"}
                        style={[styles.smallInput, styles.input]}
                        keyboardType={"numeric"}
                    />
                    <TextInput
                        label={"Diện tích"}
                        style={[styles.smallInput, styles.input]}
                        keyboardType={"numeric"}
                    />
                </View>
            </View>
        </Card>
    );
}
const styles = StyleSheet.create({
    container: {
        margin: 10,
        backgroundColor: "#ffe0a2",
        padding: 20,
    },
    text: {

        fontSize: 20,
        margin: 10

    },
    smallInputContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: 'space-between',
    }, smallInput: {
        marginTop: 10,
        width: '48%',
        borderRadius: 8,
    },
    input: {
        backgroundColor: 'white'
    },
    boxAddress: {
        backgroundColor: "white",
        height: 50,
        width: '100%', // Hoặc chiều rộng tùy chỉnh
        justifyContent: 'center', // Căn giữa theo chiều dọc
        padding: 10,
    }

})
export default WantPlace;