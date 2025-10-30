import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import TabNavigation from './TabNavigation'; 
import { Ionicons } from '@expo/vector-icons';
import Home from '../screens/Home';
import Profile from '../screens/profile/ProfileScreen';
import Books from '../screens/books/BooksScreen';
import Settings from '../screens/miscellaneous/SettingsScreen';
import DrawerNavigationCustom from '../components/DrawerNavigationCustom';

const Drawer = createDrawerNavigator();

export default function MainDrawer() {
  return (
    <Drawer.Navigator 
      initialRouteName="Inicio"
      screenOptions={({ navigation, route }) => ({
        headerTitle: getFocusedRouteNameFromRoute(route) ?? 'Inicio',        
        headerTransparent: false,
        headerStyle: {
          backgroundColor: 'white',
          shadowColor: 'transparent',
          elevation: 0,
        },
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontFamily: 'Roboto-Medium',
          fontSize: 25,
          color: 'black',
          marginLeft: -50,
        },
        headerLeftContainerStyle: {
          paddingLeft: 20,
        },
        headerLeft: () => (
          <Ionicons 
            name="menu" 
            size={30}
            color="black"
            onPress={() => navigation.toggleDrawer()}
            style={{ paddingLeft: 10 }}
          />
        ),
        drawerLabelStyle: {marginLeft: 25, fontFamily: 'Roboto-Medium', fontSize: 16},
        drawerItemStyle: {
          borderBottomWidth: 1,
          borderBottomColor: '#EEE',
          paddingVertical: 2,
          marginHorizontal: 0, 
          borderRadius: 40, 
        },
        drawerActiveBackgroundColor: '#a67f441a',
        drawerInactiveTintColor: '#333',
        drawerActiveTintColor: '#835e27ff',
        headerShown: true,
        })}
      drawerContent={props => <DrawerNavigationCustom {...props} />}>
      <Drawer.Screen 
        name="Inicio" 
        component={Home}
        options={{
          drawerIcon: (color) => (
            <Ionicons name='home-outline' size={24} color={color} />
          )
        }}
      />
      <Drawer.Screen 
        name="Libros" 
        component={Books}
        options={{
          drawerIcon: (color) => (
            <Ionicons name='book-outline' size={24} color={color} />
          )
        }}
      />
      <Drawer.Screen 
        name="Perfil" 
        component={Profile}
        options={{
          drawerIcon: (color) => (
            <Ionicons name='person-outline' size={24} color={color} />
          )
        }}
      />
      <Drawer.Screen 
        name="Configuracion" 
        component={Settings}
        options={{
          drawerIcon: (color) => (
            <Ionicons name='settings-outline' size={24} color={color} />
          )
        }}
      />
    </Drawer.Navigator>
  );
}