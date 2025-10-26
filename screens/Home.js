import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ImageBackground, Image, ScrollView, Dimensions } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../src/config/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';

const APP_LOGO = require('../assets/images/logo.png');
const LIBRARY_BACKGROUND = require('../assets/images/logo.png');
const { height } = Dimensions.get('window');

export default function Home({ navigation }) {
  const navigateToBooks = () => navigation.navigate('Libros');
  const navigateToAddBook = () => Alert.alert("Funcionalidad", "Navegar a Agregar Libro");
  const navigateToProfile = () => navigation.navigate('Perfil');

  return (
    <ScrollView style={styles.container}>
      <ImageBackground source={LIBRARY_BACKGROUND} style={styles.backgroundImage}>
        <View style={styles.darkOverlay} /> 
      </ImageBackground>

      <View style={styles.buttonsSection}> 
        <View style={styles.topContentContainer}>
          <Image source={APP_LOGO} style={styles.logo} />
          <Text style={styles.title}>Mundo Libro</Text>
          <Text style={styles.missionText}>
            En MundoLibro acompañamos a los lectores en un viaje infinito de palabras y emociones. Creemos en los libros como refugio, compañía y fuente de inspiración para transformar vidas y abrir caminos hacia nuevos mundos.
          </Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.actionButton, styles.booksButton]} onPress={navigateToBooks}>
              <Ionicons name="book-outline" size={30} color="white" />
              <Text style={styles.buttonText}>Libros</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.addButton]} onPress={navigateToAddBook}>
              <Ionicons name="add-circle-outline" size={30} color="white" />
              <Text style={styles.buttonText}>Agregar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.profileButton]} onPress={navigateToProfile}>
              <Ionicons name="person-circle-outline" size={30} color="white" />
              <Text style={styles.buttonText}>Perfil</Text>
            </TouchableOpacity>
          </View>
            <View style={styles.contentSpacer} />
            <Text style={styles.carouselTitle}>Libros Recomendados</Text>
            <Text style={styles.recommendedBooksPlaceholder}>Aquí irá el carrusel de libros.</Text>
        </View>
      </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>Mundo Libro - 2025</Text>
        </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  backgroundImage: {
    width: '100%',
    height: height * 0.45,
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  buttonsSection: {
    paddingHorizontal: 15,
    backgroundColor: '#ffffffff',
    marginTop: -150,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 30,
  },
  topContentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
    resizeMode: 'contain',
    marginTop: 0,
    padding: 100,
    borderRadius: 360,
  },
  title: {
    fontSize: 42,
    fontFamily: 'Roboto',
    color: 'black',
    fontStyle: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  missionText: {
    fontSize: 16,
    fontFamily: 'roboto-regular',
    color: 'gray',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 22,
    maxWidth: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  bottomSection: {
    paddingHorizontal: 15,
    backgroundColor: 'white',
    paddingTop: 30, 
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
    marginTop: 50,
  },
  actionButton: {
    width: '30%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    padding: 10,
    marginHorizontal:15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  booksButton: { backgroundColor: '#16a2d1ff' },
  addButton: { backgroundColor: '#37b937ff' },
  profileButton: { backgroundColor: '#cfb41bff' },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Nunito-Medium',
    marginTop: 5,
    textAlign: 'center',
  },
  contentSpacer: {
    marginTop: 30,
  },
  carouselTitle: {
    fontSize: 22,
    fontFamily: 'Roboto-bold',
    textAlign: 'center',
    marginBottom: 15,
    color: 'black',
  },
  recommendedBooksPlaceholder: {
    textAlign: 'center',
    paddingVertical: 40,
    color: '#999',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    marginBottom: 20,
  },
  footer: {
    padding: 15,
    backgroundColor: 'white',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  footerText: {
    fontSize: 12,
    color: 'gray',
    fontFamily: 'Nunito-Regular',
  },
});