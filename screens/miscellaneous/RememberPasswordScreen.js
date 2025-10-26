// screens/RememberPasswordScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// import { sendPasswordResetEmail } from 'firebase/auth'; // Para funcionalidad Firebase
// import { auth } from '../src/config/firebaseConfig';

export default function RememberPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');

  const handleResetPassword = () => {
    if (!email) {
      Alert.alert("Error", "Por favor, ingrese su correo electrónico.");
      return;
    }
    
    // Aquí iría la lógica de Firebase:
    // sendPasswordResetEmail(auth, email)
    //   .then(() => {
    //     Alert.alert("Éxito", "Se ha enviado un enlace de restablecimiento a su correo.");
    //     navigation.goBack();
    //   })
    //   .catch(error => Alert.alert("Error", error.message));

    Alert.alert("Éxito (Simulado)", `Enlace de restablecimiento enviado a ${email}`);
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Ionicons name="lock-closed-outline" size={60} color="#00BFFF" style={styles.icon} />
      <Text style={styles.title}>Recuperar Contraseña</Text>
      <Text style={styles.subtitle}>
        Ingrese su correo electrónico para recibir un enlace de restablecimiento.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Enviar Enlace</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>Volver al inicio de sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 30,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Nunito-Bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    width: '100%',
    backgroundColor: '#00BFFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
  },
  backText: {
    color: '#00BFFF',
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
  },
});