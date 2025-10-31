import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import { auth, database } from '../../src/config/firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';

const BACKGROUND_IMAGE = require('../../assets/images/BackGround-Wallpaper.jpg');

const SettingsOption = ({ icon, title, subtitle, onPress }) => (
  <TouchableOpacity style={styles.optionRow} onPress={onPress}>
    <Ionicons name={icon} size={26} color="#444" style={styles.optionIcon} />
    <View style={styles.optionTextContainer}>
      <Text style={styles.optionTitle}>{title}</Text>
      {subtitle && <Text style={styles.optionSubtitle}>{subtitle}</Text>}
    </View>
    <Ionicons name="chevron-forward-outline" size={22} color="#CCC" />
  </TouchableOpacity>
);

export default function SettingsScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (currentUser) {
      const userDocRef = doc(database, 'users', currentUser.uid);
      const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          setUserData({ uid: currentUser.uid, ...docSnap.data() });
        }
      });
      return () => unsubscribe();
    }
  }, [currentUser]);

  const handleManageAccount = () => {
    if (userData) {
      navigation.navigate('EditProfile', { userData });
    } else {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: 'Cargando...',
        textBody: 'Los datos del perfil aún no están listos. Inténtalo en un momento.',
        button: 'Aceptar',
      });
    }
  };

  const showComingSoon = () => {
    Dialog.show({
      type: ALERT_TYPE.INFO,
      title: 'Próximamente',
      textBody: 'Esta funcionalidad estará disponible en futuras actualizaciones.',
      button: 'Entendido',
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground source={BACKGROUND_IMAGE} style={styles.backgroundImage} resizeMode="cover">
        <View style={styles.darkOverlay} />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.card}>
            <Text style={styles.sectionHeader}>Cuenta y Apariencia</Text>
            <SettingsOption icon="person-outline" title="Gestionar Cuenta" subtitle="Edita tu perfil y seguridad" onPress={handleManageAccount} />
            <SettingsOption icon="moon-outline" title="Modo Oscuro" subtitle="Actualmente activado" onPress={showComingSoon} />
            <SettingsOption icon="language-outline" title="Idioma" subtitle="Español" onPress={showComingSoon} />

            <Text style={styles.sectionHeader}>Notificaciones</Text>
            <SettingsOption icon="notifications-outline" title="Notificaciones Push" subtitle="Alertas de nuevos libros y más" onPress={showComingSoon} />
            <SettingsOption icon="mail-outline" title="Notificaciones por Correo" subtitle="Resúmenes y noticias" onPress={showComingSoon} />

            <Text style={styles.sectionHeader}>Soporte y Legal</Text>
            <SettingsOption icon="help-circle-outline" title="Centro de Ayuda" onPress={showComingSoon} />
            <SettingsOption icon="document-text-outline" title="Términos de Servicio" onPress={showComingSoon} />
            <SettingsOption icon="shield-checkmark-outline" title="Política de Privacidad" onPress={showComingSoon} />
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
  scrollContainer: { flexGrow: 1, paddingVertical: 20 },
  card: { backgroundColor: 'white', borderRadius: 20, marginHorizontal: 20, paddingVertical: 15, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.23, shadowRadius: 2.62, elevation: 4 },
  sectionHeader: { fontSize: 16, fontFamily: 'Nunito-Bold', color: '#333', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
  optionRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  optionIcon: { marginRight: 20 },
  optionTextContainer: { flex: 1 },
  optionTitle: { fontSize: 16, fontFamily: 'Nunito-SemiBold', color: '#333' },
  optionSubtitle: { fontSize: 12, fontFamily: 'Nunito-Regular', color: '#888', paddingTop: 2 },
});
