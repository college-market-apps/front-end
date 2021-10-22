/* eslint-disable react/display-name */
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import PostScreen from '../screens/post/PostScreen'
const Stack = createStackNavigator();

export default function SearchStack() {

    return (
    <Stack.Navigator>
        <Stack.Screen
            name="PostScreen"
            component={PostScreen}
            options={{
                headerShown: true,
            }}
        />
    </Stack.Navigator>
    );
}
