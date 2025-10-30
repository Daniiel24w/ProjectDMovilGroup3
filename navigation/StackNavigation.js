// navigation/Navigation.js (Versión Optimizada)

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth'; 
import { auth } from '../src/config/firebaseConfig'; 
import { AlertNotificationRoot } from 'react-native-alert-notification';
import CreateBooksScreen from "../screens/books/CreateBooksScreen";


// Importamos el flujo de la aplicación principal
import DrawerNavigation from './DrawerNavigation'; 

// Importamos las rutas de autenticación
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';

const Stack = createStackNavigator();

// --- 1. Componente para el Flujo de Autenticación ---
// Contiene las pantallas Login y SignUp
function AuthStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="SignUp" component={SignUp} />
        </Stack.Navigator>
    );
}

// --- 2. Componente para el Flujo Principal de la Aplicación ---
// Simplemente renderiza tu Drawer Navigation
function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainDrawer" component={DrawerNavigation} />
      <Stack.Screen name="CreateBooks" component={CreateBooksScreen} />
    </Stack.Navigator>
  );
}



function Navigation() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Estado de carga para evitar flashes

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setIsAuthenticated(!!user);
      setIsLoading(false); // La verificación de Firebase ha terminado
    });
    return () => unsubscribe();
  }, []);

  if (isLoading) {
    // Retorna nulo o una pantalla de carga mientras Firebase verifica el token
    return null; 
  }

  return (
    <NavigationContainer>
      <AlertNotificationRoot>
        {/* Renderizado Condicional: Muestra AuthStack o AppStack completo */}
        {isAuthenticated ? <AppStack /> : <AuthStack />}
      </AlertNotificationRoot> 
    </NavigationContainer>
  );
}

export default Navigation;