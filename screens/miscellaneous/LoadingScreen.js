// screens/LoadingScreen.js

import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#00BFFF" />
      <Text style={styles.message}>Cargando datos...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  message: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#555',
    marginTop: 15,
  },
});