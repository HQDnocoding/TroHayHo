import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps"
import { ActivityIndicator, Button } from "react-native-paper";



const Map = ({ route }) => {
    const mapRef = useRef(null);
    const [coordinate, setCoordinate] = useState({ latitude: null, longitude: null })
    useEffect(() => {
        setCoordinate({ latitude: route.params?.latitude, longitude: route.params?.longitude });
    }, [])
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
        <View style={{ flex: 1,justifyContent:'space-around' }}>

            
                <View style={{ borderRadius: 40, margin: 10, padding: 10 }}>
                {coordinate?.latitude === null ? <ActivityIndicator /> :
                    <MapView
                     ref={mapRef}
                        initialRegion={{ latitude: coordinate.latitude, longitude: coordinate.longitude, longitudeDelta: 0.01, latitudeDelta: 0.01 }}
                        style={{ height: 500, }}>
                        <Marker draggable coordinate={{ latitude: coordinate.latitude, longitude: coordinate.longitude }}
                            onDrag={onMarkerDrag}
                            onDragEnd={onMarkerDrag}/>
                    </MapView>}
                </View >
            <Button>OK</Button>

        </View>

    )
}

export default Map;