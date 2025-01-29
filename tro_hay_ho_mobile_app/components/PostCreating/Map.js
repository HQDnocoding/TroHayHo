import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Geolocation from "@react-native-community/geolocation";
import { ActivityIndicator, Button } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Map = ({ route, navigation }) => {
    const mapRef = useRef(null);
    const [coordinate, setCoordinate] = useState(null); // Ban đầu là null

    useEffect(() => {
        // Lấy vị trí hiện tại
        Geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setCoordinate({ latitude, longitude });
            },
            (error) => {
                console.log("Error getting location: ", error);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }, []);

    const onMarkerDrag = (e) => {
        const { latitude, longitude } = e.nativeEvent.coordinate;
        setCoordinate({ latitude, longitude });

        if (mapRef.current) {
            mapRef.current.animateToRegion(
                {
                    latitude,
                    longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                },
                500 // Thời gian di chuyển khung hình (ms)
            );
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: "space-around" }}>
            <View style={{ borderRadius: 40, margin: 10, padding: 10 }}>
                {coordinate === null ? (
                    <ActivityIndicator />
                ) : (
                    <MapView
                        ref={mapRef}
                        initialRegion={{
                            latitude: coordinate.latitude,
                            longitude: coordinate.longitude,
                            longitudeDelta: 0.01,
                            latitudeDelta: 0.01,
                        }}
                        style={{ height: 500 }}
                    >
                        <Marker
                            draggable
                            coordinate={{
                                latitude: coordinate.latitude,
                                longitude: coordinate.longitude,
                            }}
                            onDrag={onMarkerDrag}
                            onDragEnd={onMarkerDrag}
                        />
                    </MapView>
                )}
            </View>
            <Button
                onPress={async () => {
                    await AsyncStorage.setItem("coord", JSON.stringify(coordinate));
                    navigation.goBack();
                }}
            >
                OK
            </Button>
        </View>
    );
};

export default Map;
