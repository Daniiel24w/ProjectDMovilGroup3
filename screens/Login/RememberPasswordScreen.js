// Importaciones
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { sendPasswordResetEmail } from 'firebase/auth'; 
import { auth } from '../../src/config/firebaseConfig';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LinearGradient } from 'expo-linear-gradient';
import { ALERT_TYPE, Dialog, Toast } from 'react-native-alert-notification';
import Logo from "../../assets/images/logo.png";

export default function RememberPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const BORDER_COLOR_FOCUSED = '#1e1e1e';
  const BORDER_COLOR_BLURRED = '#d1d1d1';

  const getBorderStyle = (isFocused) => ({
    borderColor: isFocused ? BORDER_COLOR_FOCUSED : BORDER_COLOR_BLURRED,
    borderWidth: isFocused ? 2 : 1,
  });

  const validateEmail = (email) => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
  }

  const handlePasswordReset = async () => {
    if (isSending) return;

    if (!email || !validateEmail(email)) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Error de Validación",
        textBody: "Por favor, introduce un correo electrónico válido.",
      });
      return;
    }

    setIsSending(true);
    try {
      await sendPasswordResetEmail(auth, email);

      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Correo Enviado",
        textBody: "Revisa tu bandeja de entrada (y spam) para seguir las instrucciones de recuperación.",
        button: "Entendido",
        onPressButton: () => navigation.goBack(),
        closeOnOverlayTap: false,
      });
    } catch (error) {
      let errorMessage = "No pudimos enviar el correo de recuperación. Inténtalo de nuevo.";
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = "No se encontró ningún usuario con ese correo electrónico. Verifica la dirección.";
          break;
        case 'auth/invalid-email':
          errorMessage = "El formato del correo electrónico es inválido.";
          break;
      }

      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: errorMessage,
        button: "Aceptar",
        closeOnOverlayTap: true,
      });
    } finally {
      setIsSending(false);
    }
  };


  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <LinearGradient
        colors={['#000000', '#7A2A13']} 
        start={{ x: 0, y: 0 }} 
        end={{ x: 1, y: 0 }}
        style={styles.gradientBackground}
      > 
        <KeyboardAwareScrollView
          extraScrollHeight={40}
          resetScrollToCoords={{ x: 0, y: 0 }}
          enableOnAndroid={true}
          keyboardVerticalOffset={100}
          contentContainerStyle={styles.scrollContent}
        >

          <View style={styles.topContainer}> 
            <Image source={Logo} style={styles.logo}/>
          </View>

          <View style={styles.contentWrapper}> 
            <View style={styles.card}> 
              <Text style={styles.title}>Recuperar Contraseña</Text>
              <Text style={styles.subTitle}>
                Introduce tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
              </Text>
            
              <Text style={styles.label}>Correo electrónico:</Text>
              <View style={[styles.inputContainer, getBorderStyle(isEmailFocused)]}>
                <Ionicons name="mail-outline" size={20} color="#6b6b6b" style={styles.icon}/>
                <TextInput
                  style={styles.input}
                  placeholder="Example@example.com"
                  placeholderTextColor={"#6b6b6b"}
                  onChangeText={setEmail}
                  value={email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={() => setIsEmailFocused(false)}/>
              </View>

              <TouchableOpacity onPress={handlePasswordReset} style={styles.buttonWrapper} disabled={isSending}>
                <LinearGradient
                  colors={['#000000', '#7A2A13']} 
                  start={{ x: 0, y: 0 }} 
                  end={{ x: 1, y: 0 }}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>
                    {isSending ? 'Enviando...' : 'Enviar Correo'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </LinearGradient>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: "#1e1e1e",
  },
  gradientBackground: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  topContainer: { 
    alignItems: "center",
    padding: 20,
    paddingTop: 50, 
    paddingBottom: 50,
    minHeight: 250, 
  },
  contentWrapper: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: -50,
  },
  card: { 
    backgroundColor: "#FFF",
    borderRadius: 30, 
    paddingHorizontal: 30,
    paddingVertical: 40, 
    width: '100%', 
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
    marginBottom: 50,
  },
  logo: {
    width: 150, 
    height: 60,
    marginBottom: 20,
    resizeMode: "contain",
    tintColor: "#FFF" 
  },
  title: {
    fontSize: 24, 
    color: "#000",
    fontFamily: 'Nunito-Bold', 
    marginBottom: 15,
    alignSelf: 'center', 
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 14, 
    color: "#6b6b6b", 
    fontFamily: 'Nunito-Regular',
    marginBottom: 30, 
    lineHeight: 22,
    textAlign: 'center', 
    alignSelf: 'center', 
    width: '90%', 
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 14, 
    color: "#000",
    fontFamily: 'Nunito-SemiBold',
    marginBottom: 5,
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF", 
    borderRadius: 10, 
    paddingHorizontal: 15,
    paddingVertical: 12,
    width: "100%",
    marginBottom: 30, 
    borderWidth: 1, 
    borderColor: '#d1d1d1',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    paddingVertical: 0, 
    fontFamily: 'Nunito-Regular', 
  },
  buttonWrapper: {
    borderRadius: 10,
    width: "100%",
    marginTop: 10,
    marginBottom: 20,
    overflow: 'hidden', 
  },
  button: {
    borderRadius: 10, 
    paddingVertical: 18, 
    alignItems: "center",
    justifyContent: 'center',
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: 'Nunito-Bold', 
  },
});