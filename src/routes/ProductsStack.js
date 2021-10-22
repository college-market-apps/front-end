/* eslint-disable react/display-name */
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// Components
import Products from "../screens/products/ProductScreen";
import SingleProduct from '../screens/products/SingleProduct'
import ProductSearchScreen from '../screens/products/ProductSearchScreen'

const Stack = createStackNavigator();

export default function ProductStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Products"
                component={Products}
                options={{
                    headerShown: true,
                }}
            />

            <Stack.Screen
                name="Single Product"
                component={SingleProduct}
                options={{
                    headerShown: true
                }}
            />

            <Stack.Screen
                name="Product Search"
                component={ProductSearchScreen}
                options={{
                    headerShown: true,
                    // headerLeft: false
                }}
            />
        </Stack.Navigator>
    );
}
