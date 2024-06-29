import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Feather } from '@expo/vector-icons'
import Home from '../screens/Home'
import Search from '../screens/Search'
import Favorite from '../screens/Favorite'

const Tab = createBottomTabNavigator()

const BottomTabNavigator = (): JSX.Element => (
    <Tab.Navigator
        screenOptions={{
            tabBarStyle: {
                backgroundColor: '#1e1e1e', // Set your desired background color here
                borderTopColor: 'transparent', // Optional: to remove the top border
            },
            tabBarActiveTintColor: '#FFFFFF', // Active tab icon color
            tabBarInactiveTintColor: '#808080', // Inactive tab icon color
        }}
    >
        <Tab.Screen
            name="Home"
            component={Home}
            options={{
                tabBarIcon: ({ color }) => (
                    <Feather name="home" size={28} color={color} />
                ),
                headerShown: false,
            }}
        />
        <Tab.Screen
            name="Search"
            component={Search}
            options={{
                tabBarIcon: ({ color }) => (
                    <Feather name="search" size={28} color={color} />
                ),
                headerShown: false,
            }}
        />
        <Tab.Screen
            name="Favorite"
            component={Favorite}
            options={{
                tabBarIcon: ({ color }) => (
                    <Feather name="heart" size={28} color={color} />
                ),
                headerShown: false,
            }}
        />
    </Tab.Navigator>
)

export default BottomTabNavigator