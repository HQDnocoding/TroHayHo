
import * as React from 'react';
import { View, useWindowDimensions, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Home from "../Home/Home";

const FirstRoute = () => (<Home/>);
const SecondRoute = () => (<Home/>);
const tRoute = () => (<Home/>);
const fRoute = () => (<Home/>);

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
  three: tRoute,
  four: fRoute,
});

const routes = [
  { key: 'first', title: 'First' },
  { key: 'second', title: 'Second' },
  { key: 'three', title: 'heh' },
  { key: 'four', title: '4' },
];

export default function PostManagement() {
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
      gap={100}
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
    backgroundColor: '#fbb800',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  label: {
    color: '#666',
    fontSize: 14,
    textTransform: 'none', // Giữ nguyên chữ hoa/thường như đã định nghĩa
  },
  tab: {
    width: 'auto', // Tab sẽ có chiều rộng tùy thuộc vào nội dung
    paddingHorizontal: 15,
  },
  indicator: {
    backgroundColor: '#ff0000',
    height: 2,
  },
});