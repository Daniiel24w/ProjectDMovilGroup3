// screens/EditProfileScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function EditProfileScreen({ navigation }) {
  const [name, setName] = useState('Hector Daniel Medina');
  const [email, setEmail] = useState('hector.daniel@mundolibro.com');
  const [bio, setBio] = useState('Amante de la lectura y desarrollador.');

  const handleSave = () => {
    // Aquí iría la lógica para actualizar el perfil en Firebase/Backend
    Alert.alert("Guardado", "Tu perfil ha sido actualizado.");
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Información Personal</Text>

      <Text style={styles.label}>Nombre Completo</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      
      <Text style={styles.label}>Correo Electrónico (No Editable)</Text>
      <TextInput
        style={[styles.input, styles.disabledInput]}
        value={email}
        editable={false}
      />
      
      <Text style={styles.label}>Biografía</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={bio}
        onChangeText={setBio}
        multiline
        numberOfLines={4}
      />
      
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Guardar Cambios</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.cancelText}>Cancelar</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontFamily: 'Nunito-Bold',
    marginBottom: 25,
    color: '#333',
  },
  label: {
    fontSize: 16,
    fontFamily: 'Nunito-Medium',
    color: '#555',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
  },
  disabledInput: {
    backgroundColor: '#F5F5F5',
    color: '#888',
  },
  textArea: {
    height: 100,
    paddingTop: 15,
  },
  button: {
    width: '100%',
    backgroundColor: '#32CD32',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
  },
  cancelText: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Nunito-Regular',
  }
});