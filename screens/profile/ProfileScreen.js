import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ImageBackground, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { auth, database } from '../../src/config/firebaseConfig';
import { signOut } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
import { ALERT_TYPE, Dialog, Toast } from 'react-native-alert-notification';

const BACKGROUND_IMAGE = require('../../assets/images/BackGround-Wallpaper.jpg');
const DEFAULT_AVATAR = require('../../assets/images/image.png');

export default function ProfileScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (currentUser) {
      const userDocRef = doc(database, 'users', currentUser.uid);
      const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          setUserData({
            uid: currentUser.uid,
            email: currentUser.email,
            ...docSnap.data(),
          });
        } else {
          // Si no existe el documento, creamos un perfil base
          setUserData({
            uid: currentUser.uid,
            displayName: currentUser.displayName || 'Usuario',
            email: currentUser.email,
            photoURL: currentUser.photoURL || null,
            address: '',
            phone: '',
          });
        }
        setIsLoading(false);
      });

      return () => unsubscribe();
    } else {
      // Si no hay usuario, dejamos de cargar para evitar un bucle infinito.
      setIsLoading(false);
    }
  }, [currentUser]);

  const handleLogout = () => {
    Dialog.show({
      type: ALERT_TYPE.WARNING,
      title: 'Cerrar Sesión',
      textBody: '¿Estás seguro de que quieres cerrar sesión?',
      button: 'Confirmar',
      onPressButton: () => {
        signOut(auth).catch(error => {
          Dialog.show({
            type: ALERT_TYPE.DANGER,
            title: 'Error',
            textBody: 'No se pudo cerrar la sesión. Inténtalo de nuevo.',
            button: 'Aceptar',
          });
        });
        Dialog.hide();
      },
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFF" />
      </View>
    );
  }

  // Si no hay datos de usuario después de cargar, mostramos un mensaje.
  // Esto puede pasar si el usuario no está logueado.
  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.buttonText}>No se pudo cargar el perfil.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground source={BACKGROUND_IMAGE} style={styles.backgroundImage} resizeMode="cover">
        <View style={styles.darkOverlay} />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.card}>
            <Image
              source={userData?.photoURL ? { uri: userData.photoURL } : DEFAULT_AVATAR}
              style={styles.profileImage}
            />
            <Text style={styles.userName}>{(userData?.displayName || 'Usuario').toUpperCase()}</Text>

            <View style={styles.infoContainer}>
              <InfoRow icon="mail-outline" text={userData?.email || 'No disponible'} />
              <InfoRow icon="location-outline" text={userData?.address || 'Dirección no especificada'} />
              <InfoRow icon="call-outline" text={userData?.phone || 'Teléfono no especificado'} />
            </View>

            <TouchableOpacity style={styles.buttonWrapper} onPress={() => navigation.navigate('EditProfile', { userData })}>
              <LinearGradient colors={['#ffc107', '#ff8f00']} style={styles.button}>
                <Ionicons name="pencil-outline" size={20} color="#FFF" />
                <Text style={styles.buttonText}>Editar Perfil</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonWrapper} onPress={handleLogout}>
              <LinearGradient colors={['#d9534f', '#c9302c']} style={styles.button}>
                <Ionicons name="log-out-outline" size={20} color="#FFF" />
                <Text style={styles.buttonText}>Cerrar Sesión</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const InfoRow = ({ icon, text }) => (
  <View style={styles.infoRow}>
    <Ionicons name={icon} size={22} color="#888" style={styles.infoIcon} />
    <Text style={styles.infoText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#1e1e1e' },
  backgroundImage: { flex: 1 },
  darkOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1e1e1e' },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', paddingVertical: 20 },
  card: { backgroundColor: 'white', borderRadius: 20, marginHorizontal: 20, padding: 25, alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.30, shadowRadius: 4.65, elevation: 8 },
  profileImage: { width: 120, height: 120, borderRadius: 60, marginBottom: 15, borderWidth: 4, borderColor: '#FFF', elevation: 5 },
  userName: { fontSize: 22, fontFamily: 'Nunito-Bold', color: '#333', textAlign: 'center', marginBottom: 20 },
  infoContainer: { alignSelf: 'stretch', marginBottom: 25 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  infoIcon: { marginRight: 15 },
  infoText: { fontSize: 16, fontFamily: 'Nunito-Regular', color: '#555', flex: 1 },
  buttonWrapper: { borderRadius: 10, overflow: 'hidden', width: '100%', marginBottom: 15 },
  button: { flexDirection: 'row', paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: 'white', fontSize: 16, fontFamily: 'Nunito-Bold', marginLeft: 8 },
});
