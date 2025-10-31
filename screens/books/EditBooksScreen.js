import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, ScrollView, Alert, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { database, storage } from '../../src/config/firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { Toast, Dialog, ALERT_TYPE } from 'react-native-alert-notification';
import { LinearGradient } from 'expo-linear-gradient'; 

const BACKGROUND_IMAGE = require('../../assets/images/BackGround-Wallpaper.jpg');

// Reutilizamos el componente StarRating de CreateBooksScreen
const StarRating = ({ rating, onRate }) => (
  <View style={styles.starContainer}>
    {Array(5).fill(0).map((_, i) => (
      <TouchableOpacity key={i} onPress={() => onRate(i + 1)}>
        <Ionicons name={i < rating ? 'star' : 'star-outline'} size={30} color={i < rating ? '#FFD700' : '#CCC'} style={styles.star} />
      </TouchableOpacity>
    ))}
  </View>
);

export default function EditBooksScreen({ navigation, route }) {
  const { book: bookToEdit } = route.params;
  
  const [title, setTitle] = useState(bookToEdit.title);
  const [author, setAuthor] = useState(bookToEdit.author);
  const [summary, setSummary] = useState(bookToEdit.summary);
  const [publicationYear, setPublicationYear] = useState(String(bookToEdit.publicationYear));
  const [rating, setRating] = useState(bookToEdit.rating);
  const [coverUrl, setCoverUrl] = useState(bookToEdit.coverUrl || ''); // Usamos el nuevo estado
  const [isSaving, setIsSaving] = useState(false);



  const validateFields = () => {
    if (!title || !author || !summary || !publicationYear) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: 'Campos incompletos',
        textBody: 'Por favor, rellena todos los campos obligatorios.',
      });
      return false;
    }
    if (!/^[a-zA-Z\s.,'-]+$/.test(author)) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: 'Autor inválido',
        textBody: 'El nombre del autor solo puede contener letras y espacios.',
      });
      return false;
    }
    const year = parseInt(publicationYear, 10);
    const currentYear = new Date().getFullYear();
    if (isNaN(year) || year < 1000 || year > currentYear) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: 'Año inválido',
        textBody: `Por favor, introduce un año válido entre 1000 y ${currentYear}.`,
      });
      return false;
    }
    if (rating === 0) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: 'Rating requerido',
        textBody: 'Por favor, asigna una calificación al libro.',
      });
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateFields()) return;

    setIsSaving(true);
    try {
      const bookRef = doc(database, 'books', bookToEdit.id);

      const updatedBookData = {
        title,
        author,
        summary,
        publicationYear: parseInt(publicationYear, 10),
        rating,
        coverUrl: coverUrl.trim(), // Usar la URL del campo de texto
      };

      await updateDoc(bookRef, updatedBookData);

      // Navegamos DESPUÉS de que la actualización fue exitosa.
      navigation.goBack();
      Toast.show({
        type: 'SUCCESS',
        title: '¡Guardado!',
        textBody: 'Los cambios en el libro han sido guardados.',
      });
    } catch (error) {
      console.error("Error al actualizar el libro: ", error);
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'No se pudieron guardar los cambios. Inténtalo de nuevo.',
        button: 'Aceptar',
        closeOnOverlayTap: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground source={BACKGROUND_IMAGE} style={styles.backgroundImage} resizeMode="cover">
        <View style={styles.darkOverlay} />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.header}>Editar Libro</Text>

          <View style={styles.card}>
            <Text style={styles.cardHeader}>Editando: {bookToEdit.title}</Text>
            
            {/* Mostramos la imagen si hay una URL */}
            {coverUrl ? (
              <Image source={{ uri: coverUrl }} style={styles.coverImagePreview} />
            ) : null}

            <View style={styles.inputContainer}>
              <Ionicons name="book-outline" size={20} color="#888" style={styles.icon} />
              <TextInput style={styles.input} placeholder="Título del libro" value={title} onChangeText={setTitle} />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#888" style={styles.icon} />
              <TextInput style={styles.input} placeholder="Autor" value={author} onChangeText={setAuthor} />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="calendar-outline" size={20} color="#888" style={styles.icon} />
              <TextInput style={styles.input} placeholder="Año de publicación (YYYY)" value={publicationYear} onChangeText={setPublicationYear} keyboardType="number-pad" maxLength={4} />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="link-outline" size={20} color="#888" style={styles.icon} />
              <TextInput style={styles.input} placeholder="URL de la portada (Opcional)" value={coverUrl} onChangeText={setCoverUrl} />
            </View>

            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <Ionicons name="document-text-outline" size={20} color="#888" style={[styles.icon, { paddingTop: 12 }]} />
              <TextInput style={[styles.input, styles.textArea]} placeholder="Resumen / Sinopsis" value={summary} onChangeText={setSummary} multiline />
            </View>

            <Text style={styles.label}>Calificación:</Text>
            <StarRating rating={rating} onRate={setRating} />

            <TouchableOpacity style={styles.buttonWrapper} onPress={handleSave} disabled={isSaving}>
              <LinearGradient colors={['#007BFF', '#0056b3']} style={styles.button}>
                {isSaving ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={styles.buttonText}>Guardar Cambios</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.goBack()} disabled={isSaving}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

// Estilos adaptados de CreateBooksScreen
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#1e1e1e' },
  backgroundImage: { flex: 1 },
  darkOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)' },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', paddingVertical: 20 },
  header: { fontSize: 24, fontFamily: 'Nunito-Bold', color: '#FFF', textAlign: 'center', marginBottom: 20 },
  card: { backgroundColor: 'white', borderRadius: 20, marginHorizontal: 20, padding: 25, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.30, shadowRadius: 4.65, elevation: 8 },
  cardHeader: { fontSize: 18, fontFamily: 'Nunito-Bold', color: '#333', textAlign: 'center', marginBottom: 15 },
  coverImagePreview: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#F5F5F5', // Un fondo que coincida con los inputs
    resizeMode: 'contain',
  },
  coverUploadText: { fontSize: 16, color: '#007AFF', fontFamily: 'Nunito-SemiBold', marginTop: 8 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 10, paddingHorizontal: 15, marginBottom: 15, borderWidth: 1, borderColor: '#E0E0E0' },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: '#333', paddingVertical: 12, fontFamily: 'Nunito-Regular' },
  textAreaContainer: { alignItems: 'flex-start' },
  textArea: { height: 100, textAlignVertical: 'top', paddingTop: 12 },
  label: { fontSize: 16, fontFamily: 'Nunito-SemiBold', color: '#555', textAlign: 'center', marginTop: 10, marginBottom: 10 },
  starContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 25 },
  star: { marginHorizontal: 5 },
  buttonWrapper: { borderRadius: 10, overflow: 'hidden', marginTop: 10 },
  button: { paddingVertical: 15, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: 'white', fontSize: 18, fontFamily: 'Nunito-Bold' },
  cancelText: { color: '#d9534f', fontSize: 16, textAlign: 'center', fontFamily: 'Nunito-SemiBold', marginTop: 15, padding: 5 },
});