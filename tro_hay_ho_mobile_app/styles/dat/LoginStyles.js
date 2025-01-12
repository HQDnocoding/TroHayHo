import { StyleSheet } from "react-native";


export default StyleSheet.create({
    topAppBar: {
        backgroundColor: '#FFBA00',
    },
    textInput: {
        backgroundColor: 'white',
        borderColor: '#FFBA00',
        margin: 15,

    }
    ,
    containerOtherLogin:{
      flexDirection:'column',  
      alignItems:'center'
    },
    containerLine: {
        paddingHorizontal:15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'center'
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#CAC4D0',
        
    }
});