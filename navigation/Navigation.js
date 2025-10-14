import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { onAuthStateChanged } from 'firebase/auth';  
import { auth } from '../src/config/firebaseConfig';  
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import Home from '../screens/Home';

// Import AlertNotificationRoot por dentro de NavigationContainer por que si no tira error por path
import { AlertNotificationRoot } from 'react-native-alert-notification';

const Stack = createStackNavigator();

function Navigation() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setIsAuthenticated(true); 
      } else {
        setIsAuthenticated(false); 
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AlertNotificationRoot>
          <Stack.Navigator
          initialRouteName={isAuthenticated ? "Home" : "Login"}
            //oculta el header en las diferentes pantallas
            screenOptions={{ 
            headerShown: false 
          }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="Home" component={Home} />
          </Stack.Navigator>
        </AlertNotificationRoot>  
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default Navigation;

