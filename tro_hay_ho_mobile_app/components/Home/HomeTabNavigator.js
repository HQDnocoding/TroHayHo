import { useState } from "react";
import { Dimensions } from "react-native";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import Home from "./Home";
import FollowingHome from "./FollowingHome";


const HomeScreen = () => <Home />;
const FollowingScreen = () => <FollowingHome />;
const myInitialLayout = {
    width: Dimensions.get('window').width,
};


const HomeTabNavigator = () => {
    const [index, setIndex] = useState(0);

    const [routes] = useState([
        { key: 'home', title: 'Khám phá' },
        { key: 'following', title: 'Đang theo dõi' },
    ]);

    // Xử lý render từng màn hình
    const renderScene = SceneMap({
        home: HomeScreen,
        following: FollowingScreen,
    });

    const renderTabBar = (props) => (
        <TabBar
            {...props}
            activeColor="#FFBA00"
            inactiveColor="black"
            indicatorStyle={{ backgroundColor: '#FFBA00' }}
            style={{ backgroundColor: 'white' }}
            labelStyle={{ fontSize: 14, fontWeight: 'bold' }}

        />
    );

    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={myInitialLayout}
            renderTabBar={renderTabBar}

        />
    );
};



export default HomeTabNavigator;