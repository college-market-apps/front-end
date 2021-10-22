/* eslint-disable react/display-name */
import React, { useLayoutEffect } from "react";
import ProfileScreen from '../screens/profile/ProfileScreen'
import SettingsScreen from '../screens/profile/SettingsScreen'
import SingleProduct from '../screens/products/SingleProduct'
import { createStackNavigator } from "@react-navigation/stack";
const Stack = createStackNavigator();

export default function ProfileStack() {
    return (
    <Stack.Navigator>
        <Stack.Screen
            name="Profile Screen"
            component={ProfileScreen}
            options={{
                headerShown: true,
            }}
        />
        <Stack.Screen
            name="Settings Screen"
            component={SettingsScreen}
            options={{
                headerShown: true,
            }}
        />
        <Stack.Screen
            name='Single Product'
            component={SingleProduct}
            options={{
                headerShown: true
            }}
        />
    </Stack.Navigator>
    );
}
