
import * as React from 'react';
import { View, useWindowDimensions, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Home from "../Home/Home";
import PostManagementShowing from "./PostManagementShowing";
import PostManagementPendingApproval from "./PostManagementPendingApproval";
import PostManagementHidden from "./PostManagementHidden";
import APIs, { endpointsDuc } from '../../configs/APIs';
import { MyUserContext } from '../../configs/UserContexts';
import { role_id_chu_tro, tempUser2 } from '../../utils/MyValues';
import { Role } from '../../general/General';


export default function PostManagementTabNavigator() {
    const layout = useWindowDimensions();
    const [index, setIndex] = React.useState(0);


    ////////////Show--/////////////

    const currentUser = React.useContext(MyUserContext)
    const [postShow, setPostShow] = React.useState([])

    const [loadingShow, setLoadingShow] = React.useState(false);
    const [pageShow, setPageShow] = React.useState(1);

    const loadPostShow = async () => {

        if (currentUser !== null)
            if (pageShow > 0) {

                setLoadingShow(true)

                try {
                    let url;
                    let res;
                    let updatePostResults
                    if (currentUser.groups && currentUser.groups.length > 0) {

                        if (currentUser.groups[0] === Role.CHU_TRO)//chu tro
                        {
                            url = `${endpointsDuc['getListPostForRentByUserId'](currentUser.id)}?page=${pageShow}`
                            res = await APIs.get(url)
                            const postResults = res.data.results
                            updatePostResults = postResults.map((item) => {
                                return {
                                    isPostWant: false,
                                    ...item
                                }
                            })
                        } else {
                            //nguoi thue
                            url = `${endpointsDuc['getListPostWantByUserId'](currentUser.id)}?page=${pageShow}`
                            res = await APIs.get(url)
                            const postResults = res.data.results
                            updatePostResults = postResults.map((item) => {
                                return {
                                    isPostWant: true,
                                    ...item
                                }
                            })
                        }
                    }
                    console.info("pm nẽt", postShow)

                    if (pageShow > 1) {
                        setPostShow(prev => [...prev, ...updatePostResults])
                    } else {
                        setPostShow(updatePostResults)

                    }
                    if (res.data.next === null) {
                        setPageShow(0)
                    }
                } catch (error) {
                    if (error.response?.status === 404) {
                        setPageShow(0);
                    } else {
                        console.error("Error loading post:", error, " == at page: ", pageForRent);
                    }
                } finally {
                    setLoadingShow(false)

                }
            }
    }
    const loadMoreShow = () => {
        console.info("pm", pageShow)

        if (!loadingShow && pageShow > 0) {
            setPageShow(pageShow + 1)
        }

    }
    const refreshShow = () => {
        setPageShow(1)

    }
    const handleUpdateListShow = () => {
        console.info("an", pageShow)
        setPageHide(1)
        setPageShow(1)
    };
    React.useEffect(() => {

        loadPostShow()
    }, [pageShow])

    //////////////////////////
    /////////////Hide////////////
    const [postHide, setPostHide] = React.useState([])

    const [loadingHide, setLoadingHide] = React.useState(false);
    const [pageHide, setPageHide] = React.useState(1);

    const loadPostHide = async () => {
        if (currentUser !== null)
            if (pageHide > 0) {

                setLoadingHide(true)

                try {
                    let url;
                    let res;
                    let updatePostResults
                    if (currentUser.groups && currentUser.groups.length > 0) {

                        if (currentUser.groups[0] === Role.CHU_TRO)//chu tro
                        {
                            
                            url = `${endpointsDuc['getListHidePostForRentByUserId'](currentUser.id)}?page=${pageHide}`
                            res = await APIs.get(url)
                            const postResults = res.data.results
                            updatePostResults = postResults.map((item) => {
                                return {
                                    isPostWant: false,
                                    ...item
                                }
                            })
                        } else {
                            //nguoi thue
                            url = `${endpointsDuc['getListHidePostWantByUserId'](currentUser.id)}?page=${pageHide}`
                            res = await APIs.get(url)
                            const postResults = res.data.results
                            updatePostResults = postResults.map((item) => {
                                return {
                                    isPostWant: true,
                                    ...item
                                }
                            })
                        }
                    }

                    if (pageHide > 1) {
                        setPostHide(prev => [...prev, ...updatePostResults])
                    } else {
                        setPostHide(updatePostResults)

                    }
                    if (res.data.next === null) {
                        setPageHide(0)
                    }
                } catch (error) {
                    if (error.response?.status === 404) {
                        setPageHide(0);
                    } else {
                        console.error("Error loading post:", error, " == at page: ", pageForRent);
                    }
                } finally {
                    setLoadingHide(false)

                }
            }
    }
    const loadMoreHide = () => {
        if (!loadMoreHide && pageHide > 0) {
            setPageHide(pageHide + 1)
        }

    }
    const refreshHide = () => {
        setPageHide(1)

    }
    React.useEffect(() => {

        loadPostHide()
    }, [pageHide])

    /////////////////////////
    const Showing = () => (<PostManagementShowing handleUpdateList={handleUpdateListShow} post={postShow} loading={loadingShow} refresh={refreshShow} loadMore={loadMoreShow} />);
    const Approval = () => (<PostManagementPendingApproval />);
    const Hidden = () => (<PostManagementHidden handleUpdateList={handleUpdateListShow} post={postHide} loading={loadingHide} refresh={refreshHide} loadMore={loadMoreHide} />);

    const renderScene = SceneMap({

        first: Showing,
        // second: Hidden,
        three: Hidden,

    });

    const routes = [
        { key: 'first', title: `Đang hiện thị (${postShow.length})` },
        { key: 'three', title: `Đang ẩn (${postHide.length})` },

    ];
    // { key: 'second', title: 'Chờ phê duyệt (0)' },

    const renderTabBar = props => (
        <TabBar
            {...props}
            // scrollEnabled={true}
            style={styles.tabBar}
            labelStyle={styles.label}
            // tabStyle={styles.tab}
            indicatorStyle={styles.indicator}
            activeColor={'#000000'}
            inactiveColor={'#9d9d9d'}

        // gap={20}
        />
    );

    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            renderTabBar={renderTabBar}
        />
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: '#ffffff',
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    label: {
        color: '#666',
        fontSize: 14,
        textTransform: 'none',
    },
    tab: {
        width: 'auto',
        minWidth: 120,
        paddingHorizontal: 15,
        color: 'black',
    },
    indicator: {
        backgroundColor: '#000000',
        height: 2,
    },
});