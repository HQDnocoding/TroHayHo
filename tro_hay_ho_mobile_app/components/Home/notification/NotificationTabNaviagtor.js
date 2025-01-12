import * as React from 'react';
import {View, useWindowDimensions, StyleSheet} from 'react-native';
import { TabView, SceneMap,TabBar } from 'react-native-tab-view';
import NotificationScreen from "./NotificationScreen";

const FirstRoute=()=>(<NotificationScreen/>)
const SecondRoute=()=>(<NotificationScreen/>)
const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
});

const routes = [
  { key: 'first', title: 'Hoạt động' },
  { key: 'second', title: 'Tin mới' },
];

export default function NotificationTabNaviagtor() {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
const renderTabBar = props => (
    <TabBar
      {...props}
      style={styles.tabBar}
      labelStyle={styles.label}

      indicatorStyle={styles.indicator}
      activeColor={'#000000'}
      inactiveColor={'#9d9d9d'}
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