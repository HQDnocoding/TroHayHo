import { Stack } from "../../../general/General";
import {View, Text, StyleSheet, ScrollView,FlatList,RefreshControl,Image} from "react-native";
import { HeaderBackButton } from "@react-navigation/elements";
import React from "react";
import APIs, { endpointsDuc } from "../../../configs/APIs";
import { ActivityIndicator } from "react-native-paper";
import MessageScreen from "./MessageScreen";
import Vi from "dayjs/locale/vi";
import { sampleImage } from "../../../utils/MyValues";
const MessageStackNavigator = () => {
  
  return (
    
       <Stack.Navigator 
        screenOptions={({navigation,route})=>({
            headerShown: true,
           
            headerLeft:()=>{
                return (
                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFBA00' }}>
                    <HeaderBackButton onPress={() => navigation.goBack()} />
                        <View style={styles.containImage}>
                        <Image
                         style={styles.mainImage}
                        source={{uri:sampleImage}}
                        />
                        </View>
                       
                    <Text style={{ color: '#fff', marginLeft: 10 }}>Tin nhắn</Text>
                  </View>
                )
            },
            headerStyle: {
                backgroundColor: '#FFBA00',
            },
            headerTintColor: '#fff',

        })}
        
       >
        <Stack.Screen
            name={'oneMessage'}
            component={MessageScreen}
            options={{
               title:null,
            }}
        />
           
    
        </Stack.Navigator>
        
      
  );
}
const styles= StyleSheet.create({
    container:{
      backgroundColor:'#fff'
    },
    searchBar:{
        marginHorizontal:20,
        marginTop:20,
        backgroundColor:'#bdbdbd',
        marginBottom:10,
    },
    mainImage: {
        width:40,
        objectFit:'cover',
        height:40,
        
        marginRight: 5,
        borderRadius: 100,
    },
    containImage:{
     

    }
})
export default MessageStackNavigator;

