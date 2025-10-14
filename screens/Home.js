import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, Platform, Alert,ImageBackground} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from '../src/config/firebaseConfig';
import { SafeAreaView } from 'react-native-safe-area-context';
import Librito from '../assets/Libro-animado.png';
import LibraryBackground from '../assets/FondoLibreria.png';

export default function Home({ navigation }) {
  const handleLogOut = async () => {
    try {
      await signOut(auth);
      Alert.alert("Sesión cerrada", "Has cerrado sesión correctamente.");
      navigation.replace('Login');
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al cerrar sesión.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={LibraryBackground} style={styles.fullScreenBackground}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogOut}>
            <Ionicons name="log-out-outline" size={20} color="#fff" />
            <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.notificationButton}
          >
            <Ionicons name="notifications-outline" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.contentWrapper}>
          <View style={styles.contentCard}>
            <Image source={Librito} style={styles.bookCharacter} resizeMode="contain" />
            <Text style={styles.mainTitle}>MundoLibro</Text>
            <Text style={styles.descriptionText}>
              En MundoLibro acompañamos a los lectores en un viaje infinito de palabras
              y emociones. Creemos en los libros como refugio, compañía y fuente de
              inspiración para transformar vidas y abrir caminos hacia nuevos mundos.
            </Text>
          </View>
        </View>
      </ImageBackground>
      <View style={styles.bottomTabBar}>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="home" size={24} color={'#005a50'} />
          <Text style={styles.activeTabText}>Inicio</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="book-outline" size={24} color="#888" />
          <Text style={styles.tabText}>Libros</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="person-outline" size={24} color="#888" />
          <Text style={styles.tabText}>Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="menu-outline" size={24} color="#888" />
          <Text style={styles.tabText}>Más</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  fullScreenBackground: {
    flex: 1,
    resizeMode: 'cover',
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 0,
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    paddingTop: 10,
    width: '100%',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#922b21',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  notificationButton: {
    padding: 5,
  },
  contentCard: {
    flex: 0.65,
    backgroundColor: '#44664c',
    borderRadius: 30,
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  bookCharacter: {
    width: 150,
    height: 150,
    marginTop: -55,
    borderRadius: 35,
    objectFit: 'cover',
  },
  mainTitle: {
    fontSize: 48,
    fontWeight: '800',
    color: '#E9FF6B',
    marginTop: 10,
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  descriptionText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 28,
  },
  bottomTabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    height: 70,
    paddingBottom: Platform.OS === 'ios' ? 10 : 0,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  activeTabText: {
    fontSize: 12,
    color: '#005a50',
    fontWeight: '600',
    marginTop: 4,
  },
});
