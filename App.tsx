// App.tsx
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import BottomTabNavigator from './src/navigations/BottomTabNavigation'
import MovieDetail from './src/screens/MovieDetail'

const Stack = createStackNavigator()

export default function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MovieDetail"
          options={{ headerShown: false }}
          component={MovieDetail}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
