// screens/DeleteBooksScreen.js

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';

export default function DeleteBooksScreen({ navigation, route }) {
  const bookTitle = route.params?.title || 'este libro';

  useEffect(() => {
    // 🚨 Dispara la alerta inmediatamente al cargarse la pantalla
    Alert.alert(
      "Confirmar Eliminación",
      `¿Está seguro que desea eliminar permanentemente ${bookTitle}? Esta acción no se puede deshacer.`,
      [
        {
          text: "Cancelar",
          onPress: () => navigation.goBack(),
          style: "cancel"
        },
        { 
          text: "Eliminar", 
          onPress: () => handleDeleteConfirmed(bookTitle),
          style: "destructive"
        }
      ],
      { cancelable: false }
    );
  }, [bookTitle, navigation]);

  const handleDeleteConfirmed = (title) => {
    // 🚨 Lógica de Backend: Eliminar el libro
    console.log(`Eliminando el libro: ${title}`);
    Alert.alert("Eliminado", `El libro "${title}" fue eliminado.`);
    
    // Navegar de vuelta a la lista (List-CRUD) o Home
    navigation.popToTop(); // Volver a la raíz del stack (si está bien anidado)
  };

  // ⚠️ Esta pantalla solo muestra un spinner mientras la alerta está activa
  return (
    <View style={styles.container}>
      <Text style={styles.message}>Esperando confirmación...</Text>
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
    color: '#888',
  },
});