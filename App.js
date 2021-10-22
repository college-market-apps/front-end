import React, { useEffect, useState } from "react";
import Toast from 'react-native-toast-message';
import { AppRegistry, LogBox } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Auth from './src/routes/Auth'
import {auth} from './firebase'
LogBox.ignoreAllLogs();
import {Provider as ReduxProvider} from 'react-redux'
import store from './src/store'
import {useDispatch, useSelector, batch } from 'react-redux';
import { singInLoading, singInWithFBToken, setAppLoading } from './src/store/reducers/auth'

// components
import CircleProgress from './src/screens/components/Progress'
import TabNav from "./src/routes/TabNav";

const Stack = createStackNavigator();

function StackScreens(props) {
    const dispatch = useDispatch()
    const [mounted, setMounted] = useState(false)
    const { loggedIn, appLoading } = useSelector(mapState)
    useEffect(() => {
        return auth.onAuthStateChanged(async(stuff)=>{
            const token  = await stuff?.getIdToken()
            if (token){
                dispatch(singInWithFBToken(token))
            }else dispatch(setAppLoading(false))
        })
    }, [ appLoading ])

    if (appLoading) return <CircleProgress text="Loading app..."/>

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}
            >
                { loggedIn ?
                    (<Stack.Screen name="Nav">
                        {props => <TabNav {...props} />}
                    </Stack.Screen>) :
                    (<Stack.Screen name="Auth">
                        {props=><Auth {...props}/>}
                    </Stack.Screen>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}


export default function App() {
    return (
        <ReduxProvider store={store}>
            <StackScreens />
            <Toast ref={(ref) => Toast.setRef(ref)} />
        </ReduxProvider>
    );
}

function mapState(state){
    return {
        loggedIn: state.Auth.uid,
        appLoading: state.Auth.appLoading
    }
}

AppRegistry.registerComponent("template", () => App);
