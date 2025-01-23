import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { FontAwesome, Entypo } from '@expo/vector-icons';
import { Button } from 'react-native-paper';

const ProfileUser = () => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={{ uri: 'https://randomuser.me/api/portraits/men/3.jpg' }}
                    style={styles.avatar}
                />

            </View>

            <View style={styles.details}>
                <Text style={styles.name}>Nguyen Van Y</Text>
                <Text style={styles.id}>Được theo dõi : 23 | Đang theo dõi : 12</Text>
                <View style={styles.detail}>
                    <FontAwesome name={'paw'} color="#808080" size={15} />
                    <Text style={styles.detailText}>Đã tham gia : 12-05-2024</Text>
                </View>
                <View style={styles.detail}>
                    <FontAwesome name='question-circle' color="#808080" size={15} />
                    <Text style={styles.detailText}>Chưa xác thực</Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <View style={styles.buttonPositive} labelStyle={styles.textPositive}>
                    <FontAwesome name={'bell'} color="#000000" size={20} />
                    <Text>
                        Theo dõi
                    </Text>
                </View>
                <View style={styles.buttonPositive} labelStyle={styles.textPositive}>
                    <FontAwesome name={'send'} color="#000000" size={15}  />
                    <Text>
                        Nhắn tin
                    </Text>
                </View>
                <View style={styles.buttonThem}>
                    <Entypo name={'menu'} color="#000000" size={20} />

                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    header: {
        alignItems: 'flex-start',
        backgroundColor: '#f5f5f5',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        height: 150,
    },
    avatar: {
        marginStart: 20,
        marginTop: 100,
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 8,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    id: {
        fontSize: 14,
        color: '#808080',
    },
    details: {
        marginTop: 20,
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    detail: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailText: {
        fontSize: 14,
        color: '#808080',
        marginLeft: 8,
    },
    buttonPositive: {
        flexDirection:'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flex: 5,
        backgroundColor: '#FFBA00',
        borderRadius: 8,
        margin: 4,
        height:40,
    },
    buttonThem: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 4,
        width: 40,
        backgroundColor: '#FFBA00',
        borderRadius: 8,
    },
    buttonNegative: {
        borderWidth: 1,
        borderColor: '#bdbdbd'
    },
    textPositive: {
        fontSize: 14,
        color: '#000000',
    },
});

export default ProfileUser;