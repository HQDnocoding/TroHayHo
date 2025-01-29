import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const CustomNumericInput = ({ min = 0, max = 99999999999, step = 10000, initialValue = 0, setPostValues, price }) => {
    const [value, setValue] = useState(initialValue);


    useEffect(() => {
        setPostValues((prev) => ({
            ...prev,
            price: value,
        }));
    },[value]);

    const increase = () => {
        if (value + step <= max) {
            setValue(prev => prev + step);
        }
    };

    const decrease = () => {
        if (value - step >= min) {
            setValue(prev => prev - step);
        }
    };

    const handleChange = (text) => {
        const numericValue = parseInt(text, 10);
        if (!isNaN(numericValue) && numericValue >= min && numericValue <= max) {
            setValue(numericValue);
        } else if (text === "") {
            setValue(0); // Nếu input trống, đặt giá trị về 0
        }
    };

    return (
        <View style={styles.container}>
            {/* Nút giảm */}
            <TouchableOpacity onPress={decrease} style={styles.button}>
                <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>

            {/* Input */}
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={value.toString()}
                onChangeText={handleChange}
            />

            {/* Nút tăng */}
            <TouchableOpacity onPress={increase} style={styles.button}>
                <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
        </View>
    );
};


const styles = StyleSheet.create({
    appContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        overflow: 'hidden',
    },
    button: {
        backgroundColor: '#007bff',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    input: {
        width: 60,
        height: 40,
        textAlign: 'center',
        fontSize: 16,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: '#ccc',
        color: '#000',
    },
});

export default CustomNumericInput;
