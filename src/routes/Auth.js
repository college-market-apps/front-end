import React from 'react'
import SingIn from '../screens/auth/SignIn'
import SignUp from '../screens/auth/SignUp'

import { createStackNavigator } from "@react-navigation/stack";
const Stack = createStackNavigator();
export default function Auth(){
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="SignIn"
                component={SingIn}
                options={{
                headerShown: false,
                }}
            />

            <Stack.Screen
                name="SignUp"
                component={SignUp}
                options={{
                headerShown: false,
                }}
            />
        </Stack.Navigator>
    )
}
