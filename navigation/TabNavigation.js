import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
// Screens
import Home from '../screens/Home';
import Profile from '../screens/profile/ProfileScreen';
import Books from '../screens/books/BooksScreen';

const Tab = createBottomTabNavigator();

export default function HomeTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Inicio"
      screenOptions={{
        tabBarInactiveTintColor: 'black',
        tabBarActiveTintColor: 'tomato',
        headerShown: false,
      }}
    >
        <Tab.Screen 
            name="Inicio"
            component={Home}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="home" color={color} size={size} />
              ),
            }}
        />
        <Tab.Screen 
            name="Libros"
            component={Books}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="book" color={color} size={size} />
              ),
            }}
        />
        <Tab.Screen 
            name="Perfil"
            component={Profile}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="person" color={color} size={size} />
              ),
            }}
        />

    </Tab.Navigator>
  );
}