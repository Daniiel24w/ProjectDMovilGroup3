// navigation/Navigation.js (Versión Optimizada)
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth'; 
import { auth } from '../src/config/firebaseConfig'; 
import { AlertNotificationRoot } from 'react-native-alert-notification';
import useAppFonts from '../src/hooks/useAppFonts';

import DrawerNavigation from './DrawerNavigation'; 

// Screens
import Login from '../screens/Login/Login';
import Register from '../screens/Register/Register';
import RememberPassword from '../screens/Login/RememberPasswordScreen';
import CreateBooks from "../screens/books/CreateBooksScreen";
import LoadingScreen from '../screens/miscellaneous/LoadingScreen';
import EditBooks from '../screens/books/EditBooksScreen';
import EditProfile from '../screens/profile/EditProfileScreen';
import ViewBook from '../screens/books/ViewBookScreen';

const Stack = createStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login}/>
      <Stack.Screen name="Register" component={Register}/>
      <Stack.Screen name="RememberPassword" component={RememberPassword}/>
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainDrawer" component={DrawerNavigation}/>
      <Stack.Screen name="CreateBooks" component={CreateBooks}/>
      <Stack.Screen name="ViewBook" component={ViewBook}/>
      <Stack.Screen name="EditProfile" component={EditProfile}/>
      <Stack.Screen name="EditBooks" component={EditBooks}/>
    </Stack.Navigator>
  );
}

function Navigation() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fontsLoaded = useAppFonts(); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setIsAuthenticated(!!user);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (!fontsLoaded || isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <AlertNotificationRoot>
        {isAuthenticated ? <AppStack /> : <AuthStack />}
      </AlertNotificationRoot> 
    </NavigationContainer>
  );
}

export default Navigation;