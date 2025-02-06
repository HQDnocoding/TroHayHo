import { useEffect, useState } from "react";
import APIs, { authAPIs, endpoints } from "../../configs/APIs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, Dimensions, FlatList, Image, StyleSheet, Text, View } from "react-native";
import { RefreshControl } from "react-native-gesture-handler";
import { ref } from "firebase/database";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";



const FollowersTab = () => {
    const [page, setPage] = useState(1);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadFollowing = async () => {
        if (page > 0) {
            setLoading(true)
            try {
                const token = await AsyncStorage.getItem("access_token");
                let url = `${endpoints['follow-me']}?page=${page}&&page_size=10`;
                const res = await authAPIs(token).get(url);

                if (page > 1) {
                    setData([...data, ...res.data.results]);
                } else {
                    setData(res.data.results);
                }
                if (res.data.next === null) {
                    setPage(0);
                }

            } catch (ex) {
                console.error(ex);
            } finally {
                setLoading(false);
            }
        }

    }


    useEffect(() => {
        loadFollowing();
    },[])

    const loadMore = () => {
        if (page > 0 && !loading)
            setPage(page + 1);
    }


    const refresh = () => {
        setPage(1);
        loadFollowing()
    }

    useEffect(() => {
        let timer = setTimeout(() => loadFollowing(), 500);

        return () => clearTimeout(timer);
    }, [page]);

    if (loading) return <ActivityIndicator size="large" />;

    const renderItem = ({ item }) => {
        console.log("follower", item);

        return (
            <View style={styles.itemRender}>
                {item.follower.avatar === '' ? <Image source={require('../../assets/noavatar.png')} style={styles.avatar} />
                    : <Image source={{ uri: item.follower.avatar }} style={styles.avatar} />}
                {(item.follower.first_name === '' && item.follower.last_name === '') ? <Text style={styles.name}>No name user</Text> :
                    <Text style={styles.name}>{item.follower.first_name} {item.follower.last_name}</Text>
                }
            </View>
        )
    }

    return (
        <FlatList
            onEndReached={loadMore}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
            data={data}
            keyExtractor={(item) => item.follower.id.toString()}
            on
            renderItem={renderItem}
        />
    );
};

const FollowingTab = () => {
    const [page, setPage] = useState(1);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadFollowing = async () => {
        if (page > 0) {
            setLoading(true)
            try {
                const token = await AsyncStorage.getItem("access_token");
                let url = `${endpoints['following']}?page=${page}`;
                const res = await authAPIs(token).get(url);

                if (page > 1) {
                    setData([...data, ...res.data.results]);
                } else {
                    setData(res.data.results);
                }
                if (res.data.next === null) {
                    setPage(0);
                }

            } catch (ex) {
                console.error(ex);
            } finally {
                setLoading(false);
            }
        }

    }


    useEffect(() => {
        loadFollowing();
    },[])

    const loadMore = () => {
        if (page > 0 && !loading)
            setPage(page + 1);
    }


    const refresh = () => {
        setPage(1);
        loadFollowing()
    }

    useEffect(() => {
        let timer = setTimeout(() => loadFollowing(), 500);

        return () => clearTimeout(timer);
    }, [page]);

    // if (loading) return <ActivityIndicator size="large" />;

    const renderItem = ({ item }) => {
        console.log("followed", item);
        return (
            <View style={styles.itemRender}>
                {item.followed.avatar === '' ? <Image source={require('../../assets/noavatar.png')} style={styles.avatar} /> :
                    <Image source={{ uri: item.followed.avatar }} style={styles.avatar} />}
                {(item.followed.first_name === '' && item.followed.last_name === '') ?
                <Text style={styles.name}>No name user</Text>:
                    <Text style={styles.name}>{item.followed.first_name} {item.followed.last_name}</Text> 
                    
                }
            </View>
        )
    }

    return (
        <FlatList
            onEndReached={loadMore}
            onEndReachedThreshold={0.7}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
            data={data}
            keyExtractor={(item) => item.followed.id.toString()}
            on
            renderItem={renderItem}
        />
    );
};


const FollowingScreen = () => <FollowingTab />
const FollowerScreen = () => <FollowersTab />
const myInitialLayout = {
    width: Dimensions.get('window').width,
};


const FollowingTabScreenNavigator = () => {
    const [index, setIndex] = useState(0);

    const [routes] = useState([
        { key: 'following', title: 'Bạn đang theo dõi' },
        { key: 'follower', title: 'Đang theo bạn' },
    ]);

    const renderScene = SceneMap({
        follower: FollowerScreen,
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
}

export default FollowingTabScreenNavigator;

const styles = StyleSheet.create({
    itemRender: {
        flexDirection: 'row', backgroundColor: '#F4F6FF',
        marginVertical: 5,
        elevation:1,marginHorizontal:10
    },

    avatar: {
        width: 50,
        height: 50,
        borderRadius: 100,
        padding: 10
    },
    name: {
        fontSize: 16, fontWeight: 400,
        marginStart:20
    }
})

