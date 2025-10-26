// screens/EditBooksScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Hardcodeamos un libro de ejemplo para la edición si no se pasan parámetros
const EXAMPLE_BOOK = {
  id: '1',
  title: 'El Ladrón del Rayo',
  author: 'Rick Riordan',
  summary: 'Percy Jackson descubre que es un semidiós...',
  publicationYear: '2005',
};

export default function EditBooksScreen({ navigation, route }) {
  // Usamos los parámetros de la ruta o el libro de ejemplo
  const bookToEdit = route.params?.book || EXAMPLE_BOOK; 
  
  const [title, setTitle] = useState(bookToEdit.title);
  const [author, setAuthor] = useState(bookToEdit.author);
  const [summary, setSummary] = useState(bookToEdit.summary);
  const [publicationYear, setPublicationYear] = useState(bookToEdit.publicationYear);

  const handleSave = () => {
    if (!title || !author) {
      Alert.alert('Error', 'El título y el autor no pueden estar vacíos.');
      return;
    }

    // 🚨 Lógica de Backend: Actualizar datos
    const updatedBook = { id: bookToEdit.id, title, author, summary, publicationYear };
    console.log('Libro actualizado:', updatedBook);
    
    Alert.alert("Éxito", `El libro "${title}" ha sido guardado.`);
    navigation.goBack(); // Volver a la vista anterior (Lista de libros)
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Editar: {bookToEdit.title}</Text>
      
      {/* Controles de Subida de Portada (Estilos reutilizados) */}
      <TouchableOpacity style={styles.coverUploadButton}>
        <Ionicons name="image-outline" size={30} color="#00BFFF" />
        <Text style={styles.coverUploadText}>Cambiar Portada</Text>
      </TouchableOpacity>
      
      <Text style={styles.label}>Título *</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />
      
      <Text style={styles.label}>Autor *</Text>
      <TextInput
        style={styles.input}
        value={author}
        onChangeText={setAuthor}
      />
      
      <Text style={styles.label}>Año de Publicación</Text>
      <TextInput
        style={styles.input}
        value={publicationYear}
        onChangeText={setPublicationYear}
        keyboardType="numeric"
        maxLength={4}
      />
      
      <Text style={styles.label}>Resumen/Sinopsis *</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={summary}
        onChangeText={setSummary}
        multiline
        numberOfLines={4}
      />
      
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Guardar Cambios</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.cancelText}>Descartar</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

// Estilos reutilizados de CreateBooksScreen (asegúrate de que los estilos estén definidos)
const styles = StyleSheet.create({
    // ... (Usar los mismos estilos de CreateBooksScreen)
    container: { flexGrow: 1, backgroundColor: 'white', padding: 20 },
    header: { fontSize: 24, fontFamily: 'Nunito-Bold', marginBottom: 25, color: '#333', textAlign: 'center' },
    coverUploadButton: { alignItems: 'center', padding: 20, borderWidth: 2, borderColor: '#EEE', borderStyle: 'dashed', borderRadius: 10, marginBottom: 20, backgroundColor: '#F9F9F9' },
    coverUploadText: { fontSize: 16, fontFamily: 'Nunito-Medium', color: '#00BFFF', marginTop: 8 },
    label: { fontSize: 16, fontFamily: 'Nunito-Medium', color: '#555', marginBottom: 8, marginTop: 15 },
    input: { width: '100%', height: 50, borderColor: '#CCC', borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, fontSize: 16, fontFamily: 'Nunito-Regular' },
    textArea: { height: 100, paddingTop: 15 },
    button: { width: '100%', backgroundColor: '#32CD32', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 30, marginBottom: 10 },
    buttonText: { color: 'white', fontSize: 16, fontFamily: 'Nunito-Bold' },
    cancelText: { color: '#999', fontSize: 14, textAlign: 'center', fontFamily: 'Nunito-Regular' }
});