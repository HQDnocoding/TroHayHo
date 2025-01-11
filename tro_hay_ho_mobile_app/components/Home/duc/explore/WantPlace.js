import {View, Text, StyleSheet} from "react-native";
import React from "react";
import {Card, TextInput} from "react-native-paper";

const WantPlace = () => {
    return (
        <Card style={styles.container}>
            <View>
                <Text style={styles.text}>Bạn muốn xem ở đâu</Text>
                <TextInput
                    label={"Địa điểm"}
                    style={[styles.input]}
                    selectionColor={'yellow'}
                    cursorColor={'yellow'}
                    activeOutlineColor={'yellow'}
                    underlineColor={'yellow'}
                />
                <View style={styles.smallInputContainer}>
                    <TextInput
                        label={"Giá"}
                        style={[styles.smallInput,styles.input]}
                        keyboardType={"numeric"}
                    />
                    <TextInput
                        label={"Diện tích"}
                        style={[styles.smallInput,styles.input]}
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
    input:{
      backgroundColor:'white'
    },

})
export default WantPlace;