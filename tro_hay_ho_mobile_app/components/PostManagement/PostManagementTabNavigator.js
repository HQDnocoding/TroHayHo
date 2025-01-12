
import * as React from 'react';
import { View, useWindowDimensions, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Home from "../Home/Home";
import PostManagementShowing from "./PostManagementShowing";

const Showing = () => (<PostManagementShowing/>);
const Approve = () => (<Home/>);
const Hidden = () => (<Home/>);

const renderScene = SceneMap({
  first: Showing,
  second: Approve,
  three: Hidden,

});

const routes = [
  { key: 'first', title: 'Đang hiện thị (3)' },
  { key: 'second', title: 'Chờ phê duyệt (0)' },
  { key: 'three', title: 'Đang ẩn (0)' },

];

export default function PostManagementTabNavigator() {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);

  const renderTabBar = props => (
    <TabBar
      {...props}
      scrollEnabled={true}
      style={styles.tabBar}
      labelStyle={styles.label}
      tabStyle={styles.tab}
      indicatorStyle={styles.indicator}
      activeColor={'#000000'}
      inactiveColor={'#9d9d9d'}
      gap={20}
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
    minWidth:120,
    paddingHorizontal: 15,
    color:'black',
  },
  indicator: {
    backgroundColor: '#000000',
    height: 2,
  },
});