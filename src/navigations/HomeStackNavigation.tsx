/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/Home';
import MovieDetail from '../screens/MovieDetail';

const Stack = createNativeStackNavigator();

const HomeStackNavigation = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="MovieDetail" component={MovieDetail} />
        </Stack.Navigator>
    );
};

export default HomeStackNavigation;