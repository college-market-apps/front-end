/* eslint-disable react/display-name */
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AntDesign from "react-native-vector-icons/AntDesign"
import Feather from "react-native-vector-icons/Feather"
import Ionicons from 'react-native-vector-icons/Ionicons'
// components
import ProductsStack from './ProductsStack'
import PostScreenStack from './PostStack'
import MessagesStack from './MessagesStack'
import ProfileStack from './ProfileStack'
import { useNavigation } from '@react-navigation/native';

import {getUserProductLikes} from '../store/reducers/likes'
import {getUser} from '../store/reducers/user'
import {useDispatch} from 'react-redux';
import {getSchoolProducts} from '../store/reducers/products'


const Tab = createBottomTabNavigator();

export default function TabNav() {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  useEffect(()=>{
        dispatch(getUserProductLikes())
        dispatch(getSchoolProducts())
        dispatch(getUser())
    },[])

  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: "black",
        showIcon: true,
      }}
    >

      <Tab.Screen
        name="ProductsStack"
        component={ProductsStack}
        options={{
          tabBarLabel: "products",
          tabBarIcon: ({ color, size }) => (
            <AntDesign
              name="home"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tab.Screen
        name="PostScreenStack"
        component={PostScreenStack}
        options={{
          tabBarLabel: "sell",
          tabBarIcon: ({ color, size }) => (
            <Feather
              name="camera"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tab.Screen
        name="MessagesStack"
        component={MessagesStack}
        options={{
          tabBarLabel: "messages",
          tabBarIcon: ({ color, size }) => (
            <AntDesign
              name="message1"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tab.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={{
          tabBarLabel:'profile',
          tabBarIcon:({ color, size })=>(
            <Ionicons
              name='ios-person-outline'
              color={color}
              size={size}
            />
          ),
        }}
      />

      {/* more tabs */}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});
