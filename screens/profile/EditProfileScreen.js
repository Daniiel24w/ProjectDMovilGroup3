import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { auth, database } from '../../src/config/firebaseConfig';
import { updateProfile, updateEmail, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Toast, Dialog, ALERT_TYPE } from 'react-native-alert-notification';
import { LinearGradient } from 'expo-linear-gradient';

const BACKGROUND_IMAGE = require('../../assets/images/BackGround-Wallpaper.jpg');

export default function EditProfileScreen({ navigation, route }) {
  const { userData } = route.params;
  const currentUser = auth.currentUser;

  const [lastName, setLastName] = useState(userData.displayName?.split(', ')[0] || '');
  const [firstName, setFirstName] = useState(userData.displayName?.split(', ')[1] || '');

  const [photoURL, setPhotoURL] = useState(userData.photoURL || '');
  const [address, setAddress] = useState(userData.address || '');
  const [phone, setPhone] = useState(userData.phone || '');
  const [newEmail, setNewEmail] = useState(userData.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Para operaciones sensibles, necesitamos re-autenticar
      if ((newEmail !== currentUser.email || newPassword) && !currentPassword) {
        Dialog.show({ type: ALERT_TYPE.WARNING, title: 'Contraseña requerida', textBody: 'Para cambiar tu correo o contraseña, debes ingresar tu contraseña actual.', button: 'Aceptar' });
        setIsSaving(false);
        return;
      }

      const userDocRef = doc(database, 'users', currentUser.uid);
      let credential;

      if (currentPassword) {
        credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
        await reauthenticateWithCredential(currentUser, credential);
      }

      // Actualizar email si ha cambiado
      if (newEmail !== currentUser.email) {
        await updateEmail(currentUser, newEmail);
      }

      // Actualizar contraseña si se ha proporcionado una nueva
      if (newPassword) {
        await updatePassword(currentUser, newPassword);
      }

      const fullName = `${lastName}, ${firstName}`;
      // Actualizar nombre y foto en el perfil de Auth
      await updateProfile(currentUser, { displayName: fullName, photoURL });

      // Actualizar/crear documento en Firestore
      await setDoc(userDocRef, {
        displayName: fullName,
        photoURL,
        address,
        phone,
        email: newEmail, // Guardamos el nuevo email también en Firestore
      }, { merge: true });

      Toast.show({ type: ALERT_TYPE.SUCCESS, title: '¡Guardado!', textBody: 'Tu perfil ha sido actualizado.' });
      navigation.goBack();

    } catch (error) {
      console.error("Error al actualizar el perfil: ", error);
      let errorBody = 'No se pudieron guardar los cambios. Inténtalo de nuevo.';
      if (error.code === 'auth/wrong-password') {
        errorBody = 'La contraseña actual es incorrecta.';
      } else if (error.code === 'auth/email-already-in-use') {
        errorBody = 'El nuevo correo electrónico ya está en uso por otra cuenta.';
      }
      Dialog.show({ type: ALERT_TYPE.DANGER, title: 'Error', textBody: errorBody, button: 'Aceptar' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground source={BACKGROUND_IMAGE} style={styles.backgroundImage} resizeMode="cover">
        <View style={styles.darkOverlay} />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.header}>Editar Perfil</Text>
          <View style={styles.card}>
            <InputRow label="Apellidos" value={lastName} onChangeText={setLastName} icon="person-outline" />
            <InputRow label="Nombres" value={firstName} onChangeText={setFirstName} icon="person-outline" />
            <InputRow label="URL de Foto de Perfil" value={photoURL} onChangeText={setPhotoURL} icon="image-outline" />
            <InputRow label="Dirección" value={address} onChangeText={setAddress} icon="location-outline" />
            <InputRow label="Teléfono" value={phone} onChangeText={setPhone} icon="call-outline" keyboardType="phone-pad" />
            
            <Text style={styles.sectionHeader}>Cambios de Seguridad</Text>
            <InputRow label="Correo Electrónico" value={newEmail} onChangeText={setNewEmail} icon="mail-outline" keyboardType="email-address" />
            <InputRow label="Nueva Contraseña (dejar en blanco para no cambiar)" value={newPassword} onChangeText={setNewPassword} icon="lock-closed-outline" secureTextEntry />
            <InputRow label="Contraseña Actual (para cambios de seguridad)" value={currentPassword} onChangeText={setCurrentPassword} icon="key-outline" secureTextEntry />
            
            <TouchableOpacity style={styles.buttonWrapper} onPress={handleSave} disabled={isSaving}>
              <LinearGradient colors={['#007BFF', '#0056b3']} style={styles.button}>
                {isSaving ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={styles.buttonText}>Guardar Cambios</Text>}
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

const InputRow = ({ label, icon, ...props }) => (
  <>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputContainer}>
      <Ionicons name={icon} size={20} color="#888" style={styles.icon} />
      <TextInput style={styles.input} placeholderTextColor="#AAA" {...props} />
    </View>
  </>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#1e1e1e' },
  backgroundImage: { flex: 1 },
  darkOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)' },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', paddingVertical: 20 },
  header: { fontSize: 24, fontFamily: 'Nunito-Bold', color: '#FFF', textAlign: 'center', marginBottom: 20 },
  card: { backgroundColor: 'white', borderRadius: 20, marginHorizontal: 20, padding: 25, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.30, shadowRadius: 4.65, elevation: 8 },
  label: { fontSize: 14, fontFamily: 'Nunito-SemiBold', color: '#555', marginBottom: 5, marginTop: 10 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 10, paddingHorizontal: 15, marginBottom: 10, borderWidth: 1, borderColor: '#E0E0E0' },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: '#333', paddingVertical: 12, fontFamily: 'Nunito-Regular' },
  sectionHeader: { fontSize: 16, fontFamily: 'Nunito-Bold', color: '#333', marginTop: 20, marginBottom: 10, borderTopWidth: 1, borderTopColor: '#EEE', paddingTop: 15 },
  buttonWrapper: { borderRadius: 10, overflow: 'hidden', marginTop: 20 },
  button: { paddingVertical: 15, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: 'white', fontSize: 18, fontFamily: 'Nunito-Bold' },
  cancelText: { color: '#d9534f', fontSize: 16, textAlign: 'center', fontFamily: 'Nunito-SemiBold', marginTop: 15, padding: 5 },
});