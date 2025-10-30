// screens/InMaintenanceScreen.js

import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function InMaintenanceScreen() {
  return (
    <View style={styles.container}>
      <Ionicons name="build-outline" size={80} color="#FFD700" />
      <Text style={styles.title}>En Mantenimiento</Text>
      <Text style={styles.message}>
        Estamos trabajando para mejorar esta sección. Vuelve pronto.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333333', // Fondo oscuro
    padding: 30,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Nunito-Bold',
    color: '#FFD700', // Amarillo de tu paleta
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#CCC',
    textAlign: 'center',
  },
});