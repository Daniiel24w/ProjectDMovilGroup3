// screens/CreateBooksScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CreateBooksScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [summary, setSummary] = useState('');
  const [publicationYear, setPublicationYear] = useState('');

  const handleSave = () => {
    if (!title || !author || !summary) {
      Alert.alert('Error', 'Por favor, complete todos los campos obligatorios.');
      return;
    }

    // 🚨 Lógica de Backend: Enviar datos a Firebase/API
    const newBook = { title, author, summary, publicationYear };
    console.log('Nuevo libro creado:', newBook);
    
    Alert.alert("Éxito", `El libro "${title}" ha sido creado y subido.`);
    navigation.goBack(); // Volver a la lista de libros
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Subir Nuevo Libro</Text>
      
      {/* Opción para subir portada */}
      <TouchableOpacity style={styles.coverUploadButton}>
        <Ionicons name="image-outline" size={30} color="#00BFFF" />
        <Text style={styles.coverUploadText}>Seleccionar Portada</Text>
      </TouchableOpacity>
      
      <Text style={styles.label}>Título *</Text>
      <TextInput
        style={styles.input}
        placeholder="Título del Libro"
        value={title}
        onChangeText={setTitle}
      />
      
      <Text style={styles.label}>Autor *</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre del Autor"
        value={author}
        onChangeText={setAuthor}
      />
      
      <Text style={styles.label}>Año de Publicación</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: 2024"
        value={publicationYear}
        onChangeText={setPublicationYear}
        keyboardType="numeric"
        maxLength={4}
      />
      
      <Text style={styles.label}>Resumen/Sinopsis *</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Escriba un breve resumen..."
        value={summary}
        onChangeText={setSummary}
        multiline
        numberOfLines={4}
      />
      
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Crear y Subir Libro</Text>
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
    textAlign: 'center',
  },
  coverUploadButton: {
    alignItems: 'center',
    padding: 20,
    borderWidth: 2,
    borderColor: '#EEE',
    borderStyle: 'dashed',
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#F9F9F9',
  },
  coverUploadText: {
    fontSize: 16,
    fontFamily: 'Nunito-Medium',
    color: '#00BFFF',
    marginTop: 8,
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
  textArea: {
    height: 100,
    paddingTop: 15,
  },
  button: {
    width: '100%',
    backgroundColor: '#32CD32', // Color verde
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