import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import { Ionicons } from '@expo/vector-icons';
import Home from '../screens/Home/Home';
import Profile from '../screens/profile/ProfileScreen';
import Books from '../screens/books/BooksScreen';
import Settings from '../screens/miscellaneous/SettingsScreen';
import DrawerNavigationCustom from '../components/DrawerNavigationCustom';

const Drawer = createDrawerNavigator();

function DrawerNavigation() {
  return (
    <Drawer.Navigator 
      initialRouteName="Inicio"
      screenOptions={({ navigation, route }) => ({
        headerTitle: getFocusedRouteNameFromRoute(route) ?? route.name,
        headerTransparent: true, // Hacer el header transparente
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontFamily: 'Nunito-Bold',
          fontSize: 25,
          color: 'white', // Color del título en blanco
        },
        headerLeftContainerStyle: {
          paddingLeft: 20,
        },
        headerLeft: () => (
          <Ionicons 
            name="menu" 
            size={30}
            color="white" // Color del ícono de menú en blanco
            onPress={() => navigation.toggleDrawer()}
            style={{ paddingLeft: 10 }}
          />
        ),
        drawerLabelStyle: {
          marginLeft: 0, // Aumentar el espacio entre el ícono y el texto
          fontFamily: 'Nunito-SemiBold', 
          fontSize: 16,
        },
        drawerItemStyle: {
          paddingVertical: 10,
          marginVertical: 5,
          marginHorizontal: 10,
          borderRadius: 15,
        },
        drawerActiveBackgroundColor: '#f0f0f0', // Un gris claro para el item activo
        drawerInactiveTintColor: '#333', // Texto oscuro para items inactivos
        drawerActiveTintColor: '#007BFF', // Un color azul para el item activo
        headerShown: true,
        })}
      drawerContent={(props) => <DrawerNavigationCustom {...props} />}>
      <Drawer.Screen 
        name="Inicio" 
        component={Home}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name='home-outline' size={size} color={color} />
          )
        }}
      />
      <Drawer.Screen 
        name="Libros" 
        component={Books}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name='book-outline' size={size} color={color} />
          )
        }}
      />
      <Drawer.Screen 
        name="Perfil" 
        component={Profile}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name='person-outline' size={size} color={color} />
          )
        }}
      />
      <Drawer.Screen 
        name="Configuracion" 
        component={Settings}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name='settings-outline' size={size} color={color} />
          )
        }}
      />
    </Drawer.Navigator>
  );
}
export default DrawerNavigation;