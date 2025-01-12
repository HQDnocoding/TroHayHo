import { StyleSheet } from "react-native";


export default StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 10,
        flexDirection: 'row',
        backgroundColor: '#FFF8E6',
    },
    headerRow1: {
        flexDirection: 'column',
    },
    headerRow2: {
        justifyContent: 'space-between',
        marginTop: 5,
        marginLeft: 10,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 50,
    },
    info: {
        fontWeight: 700,
        fontSize: 18,
    },
    followers: {
        fontSize: 14,
        color: '#888',
        marginTop: 5,
    },
    tag: {
        width: 50,
        backgroundColor: '#4CAF50',
        paddingVertical: 2,
        paddingHorizontal: 8,
        borderRadius: 5,
        marginTop: 5,
        marginLeft: 5,
        fontSize: 10,
    },

    section: {
        marginTop: 5,
        display: 'flex',
    },

    item: {
        marginVertical: 1,
        paddingStart: 10,
        paddingVertical: 15,
        flexDirection: 'row',
        backgroundColor: '#FFF8E6',
    },

    loginRegister: {
        flexDirection: 'row',
    }
})