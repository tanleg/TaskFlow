import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import { StackNavigationProp } from '@react-navigation/stack';
import DetailsProjetScreen from './src/screens/DetailProjetScreen';

type RootStackParamList = {
    Login: undefined;
    Dashboard: undefined;
    DetailsProjet:undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="DetailsProjet" component={DetailsProjetScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}