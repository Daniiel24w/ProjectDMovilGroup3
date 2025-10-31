import React from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView, Alert, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { database } from '../../src/config/firebaseConfig';
import { doc, deleteDoc } from 'firebase/firestore';
import { Toast, Dialog, ALERT_TYPE } from 'react-native-alert-notification';
import { LinearGradient } from 'expo-linear-gradient';

const BACKGROUND_IMAGE = require('../../assets/images/BackGround-Wallpaper.jpg');

const StarRating = ({ rating }) => (
  <View style={styles.starContainer}>
    {Array(5).fill(0).map((_, i) => (
      <Ionicons
        key={i}
        name={i < rating ? 'star' : 'star-outline'}
        size={28}
        color={i < rating ? '#FFD700' : '#CCC'}
        style={styles.star}
      />
    ))}
  </View>
);

export default function ViewBookScreen({ navigation, route }) {
  const { book } = route.params;

  const handleEdit = () => {
    navigation.navigate('EditBooks', { book });
  };

  const handleDelete = () => {
    Dialog.show({
      type: ALERT_TYPE.WARNING,
      title: 'Confirmar Eliminación',
      textBody: `¿Estás seguro de que quieres eliminar "${book.title}"? Esta acción no se puede deshacer.`,
      button: 'Eliminar',
      onPressButton: async () => {
        Dialog.hide();
        try {
          await deleteDoc(doc(database, 'books', book.id));
          Toast.show({
            type: 'SUCCESS',
            title: 'Eliminado',
            textBody: `El libro "${book.title}" ha sido eliminado.`,
          });
          navigation.goBack();
        } catch (error) {
          console.error("Error al eliminar el libro: ", error);
          Dialog.show({
            type: ALERT_TYPE.DANGER,
            title: 'Error',
            textBody: 'No se pudo eliminar el libro.',
            button: 'Aceptar',
          });
        }
      },
      closeOnOverlayTap: true,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground source={BACKGROUND_IMAGE} style={styles.backgroundImage} resizeMode="cover">
        <View style={styles.darkOverlay} />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          
          <View style={styles.card}>
            {book.coverUrl ? (
              <Image source={{ uri: book.coverUrl }} style={styles.coverImage} />
            ) : (
              <View style={styles.coverPlaceholder}>
                <Ionicons name="book-outline" size={60} color="#CCC" />
              </View>
            )}

            <Text style={styles.title}>{book.title}</Text>
            <Text style={styles.author}>por {book.author}</Text>
            <Text style={styles.year}>Publicado en {book.publicationYear}</Text>

            <StarRating rating={book.rating} />

            <Text style={styles.summaryHeader}>Resumen</Text>
            <Text style={styles.summary}>{book.summary}</Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.buttonWrapper} onPress={handleEdit}>
                <LinearGradient colors={['#ffc107', '#ff8f00']} style={styles.button}>
                  <Ionicons name="pencil-outline" size={20} color="#FFF" />
                  <Text style={styles.buttonText}>Editar</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.buttonWrapper} onPress={handleDelete}>
                <LinearGradient colors={['#d9534f', '#c9302c']} style={styles.button}>
                  <Ionicons name="trash-outline" size={20} color="#FFF" />
                  <Text style={styles.buttonText}>Eliminar</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backText}>Volver Atrás</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#1e1e1e' },
  backgroundImage: { flex: 1 },
  darkOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)' },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', paddingVertical: 20 },
  card: { backgroundColor: 'white', borderRadius: 20, marginHorizontal: 20, padding: 25, alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.30, shadowRadius: 4.65, elevation: 8 },
  coverImage: { width: 150, height: 220, borderRadius: 10, marginBottom: 20, backgroundColor: '#F0F0F0', resizeMode: 'contain' },
  coverPlaceholder: { width: 150, height: 220, borderRadius: 10, marginBottom: 20, backgroundColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E0E0E0' },
  title: { fontSize: 24, fontFamily: 'Nunito-Bold', color: '#333', textAlign: 'center' },
  author: { fontSize: 18, fontFamily: 'Nunito-Regular', color: '#555', textAlign: 'center', marginBottom: 5 },
  year: { fontSize: 16, fontFamily: 'Nunito-Italic', color: '#777', textAlign: 'center', marginBottom: 15 },
  starContainer: { flexDirection: 'row', justifyContent: 'center', marginVertical: 15 },
  star: { marginHorizontal: 3 },
  summaryHeader: { fontSize: 18, fontFamily: 'Nunito-Bold', color: '#333', marginTop: 15, borderTopWidth: 1, borderTopColor: '#EEE', paddingTop: 15, width: '100%', textAlign: 'center' },
  summary: { fontSize: 16, fontFamily: 'Nunito-Regular', color: '#666', textAlign: 'justify', lineHeight: 24, marginTop: 5, marginBottom: 25 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 15 },
  buttonWrapper: { borderRadius: 10, overflow: 'hidden', width: '45%' },
  button: { flexDirection: 'row', paddingVertical: 12, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: 'white', fontSize: 16, fontFamily: 'Nunito-Bold', marginLeft: 8 },
  backText: { color: '#007BFF', fontSize: 16, textAlign: 'center', fontFamily: 'Nunito-SemiBold', marginTop: 10, padding: 5 },
});