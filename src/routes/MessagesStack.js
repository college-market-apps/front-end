/* eslint-disable react/display-name */
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Messages from "../screens/messages/MessagesScreen";
import SingleMessage from "../screens/messages/SingleMessage"
import ShoppingCart from '../screens/messages/ShoppingCart'

const Stack = createStackNavigator();

export default function MessagesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Messages"
        component={Messages}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="SingleMessage"
        component={SingleMessage}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Shopping Cart"
        component={ShoppingCart}
        options={{
          headerShown:true
        }}
      />

    </Stack.Navigator>
  );
}
