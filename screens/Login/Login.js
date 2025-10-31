// Importaciones a usar en la vista de Login
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../src/config/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LinearGradient } from 'expo-linear-gradient';
import { ALERT_TYPE, Dialog, Toast } from 'react-native-alert-notification';

// Logo
import Logo from "../../assets/images/logo.png";

// Constants for navigation routes
const REMEMBER_PASSWORD_SCREEN = 'RememberPassword';
const REGISTER_SCREEN = 'Register';

export default function Login({ navigation }) {

  // Estados para manejar el email, la contraseña y la visibilidad de la contraseña
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  // NUEVOS ESTADOS para el foco de los TextInput
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  // Colores para el borde enfocado
  const BORDER_COLOR_FOCUSED = '#1e1e1e'; // Usando el negro del botón para el foco
  const BORDER_COLOR_BLURRED = '#d1d1d1';

  // Función para obtener el estilo dinámico del borde
  const getBorderStyle = (isFocused) => ({
    borderColor: isFocused ? BORDER_COLOR_FOCUSED : BORDER_COLOR_BLURRED,
    borderWidth: isFocused ? 2 : 1,
  });

  // VALIDACIONES 
  const validateEmail = (email) => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
  }
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return passwordRegex.test(password);
  }

  const handleLogin = async () => {
    if (!email || !password) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Complete todos los campos",
        button: "Aceptar",
        closeOnOverlayTap: false
      });
      return;
    } 
    
    if (!validateEmail(email)) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Correo inválido",
      }); 
      return;
    }

    if (!validatePassword(password)) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Contraseña inválida",
        textBody: "La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula y un número."
      }); 
      return;
    }

    try { 
      await signInWithEmailAndPassword(auth, email, password);

    } catch (error) {
      let title = "Hubo un problema";
      let textBody = "No se pudo iniciar sesión. Intenta nuevamente.";

      switch (error.code) {
        case 'auth/invalid-email':
          textBody = "El formato del correo electrónico no es válido.";
          break;
        case 'auth/wrong-password':
          textBody = "La contraseña es incorrecta.";
          break;
        case 'auth/user-not-found':
          textBody = "No se encontró un usuario con este correo.";
          break;
        case 'auth/network-request-failed':
          textBody = "Error de conexión, por favor intenta más tarde.";
          break;
      }
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: title,
        textBody: textBody,
        button: "Aceptar",
        closeOnOverlayTap: true,
      });
    }
  };

  // Función de marcador de posición para los botones sociales
  const handleSocialLogin = (provider) => {
    Dialog.show({
      type: ALERT_TYPE.INFO,
      title: 'Próximamente',
      textBody: `El inicio de sesión con ${provider} estará disponible en futuras actualizaciones.`,
      button: 'Entendido',
    });
  };


  return (
    <SafeAreaView style={style.safeAreaContainer}>
      <KeyboardAwareScrollView
        extraScrollHeight={40}
        resetScrollToCoords={{ x: 0, y: 0 }}
        enableOnAndroid={true}
        keyboardVerticalOffset={100}
        contentContainerStyle={{ flexGrow: 1 }}
      >

        <LinearGradient
          // Gradiente horizontal
          colors={['#000000', '#7A2A13']} 
          start={{ x: 0, y: 0 }} 
          end={{ x: 1, y: 0 }}
          style={style.topContainer}
        > 
          <Image source={Logo} style={style.logo}/>
        </LinearGradient>

        <View style={style.card}> 
          <Text style={style.title}>Iniciar Sesion</Text>
          <Text style={style.subTitle}>Inicia sesión para poder continuar</Text> 
          
          <Text style={style.label}>Correo electrónico:</Text>
          <View style={[style.inputContainer, getBorderStyle(isEmailFocused)]}>
            <Ionicons name="mail-outline" size={20} color="#6b6b6b" style={style.icon}/>
            <TextInput
              style={style.input}
              placeholder="Example@example.com"
              placeholderTextColor={"#6b6b6b"}
              onChangeText={(value) => setEmail(value)}
              value={email}
              keyboardType="email-address"
              autoCapitalize="none"
              onFocus={() => setIsEmailFocused(true)}
              onBlur={() => setIsEmailFocused(false)}/>
          </View>

          <Text style={style.label}>Contraseña:</Text>
          <View style={[style.inputContainer, getBorderStyle(isPasswordFocused)]}>
            <Ionicons name="key-outline" size={20} color="#6b6b6b" style={style.icon}/>
            <TextInput
              style={style.input}
              placeholder="************"
              placeholderTextColor={"#6b6b6b"}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}/>
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#ccc" />
            </TouchableOpacity>
          </View>

          <View style={style.forgotPasswordContainer}> 
            <Text onPress={() => navigation.navigate(REMEMBER_PASSWORD_SCREEN)} style={style.link}>¿Olvidaste tu contraseña?</Text>
          </View>

          <TouchableOpacity onPress={handleLogin} style={style.buttonWrapper}>
            <LinearGradient
              colors={['#000000', '#7A2A13']} 
              start={{ x: 0, y: 0 }} 
              end={{ x: 1, y: 0 }}
              style={style.button}
            >
              <Text style={style.buttonText}>Entrar</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <View style={style.dividerContainer}>
            <View style={style.dividerLine} />
            <Text style={style.dividerText}>O ingresa con</Text>
            <View style={style.dividerLine} />
          </View>

          <View style={style.socialButtonsContainer}>
            <TouchableOpacity style={style.socialIconContainer} onPress={() => handleSocialLogin('Google')}>
              <Image source={{uri: 'https://cdn-icons-png.flaticon.com/512/281/281764.png'}} style={style.socialIcon}/>
            </TouchableOpacity>
            <TouchableOpacity style={style.socialIconContainer} onPress={() => handleSocialLogin('GitHub')}>
              <Image source={{uri: 'https://cdn-icons-png.flaticon.com/512/25/25231.png'}} style={style.socialIcon}/>
            </TouchableOpacity>
            <TouchableOpacity style={style.socialIconContainer} onPress={() => handleSocialLogin('Twitter')}>
              <Image source={{uri: 'https://cdn-icons-png.flaticon.com/512/733/733579.png'}} style={style.socialIcon}/>
            </TouchableOpacity>
          </View>

          <Text style={style.footerText}>
            ¿Aun no tienes cuenta? <Text onPress={() => navigation.navigate(REGISTER_SCREEN)} style={style.link}>Cree una cuenta</Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

const style = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: "#1e1e1e", 
  },
  topContainer: { 
    alignItems: "center",
    padding: 20,
    paddingTop: 50, 
    paddingBottom: 50,
    minHeight: 180, 
  },
  card: { 
    backgroundColor: "#FFF",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingHorizontal: 30,
    paddingVertical: 20,
    flex: 1, 
    marginTop: -50, 
    paddingBottom: 50
  },
  logo: {
    width: 150, 
    height: 60,
    marginBottom: 20,
    resizeMode: "contain",
    tintColor: "#FFF" 
  },
  title: {
    fontSize: 28,
    color: "#000",
    fontFamily: 'Nunito-Bold', 
    marginBottom: 5,
    alignSelf: 'center',
  },
  subTitle: {
    fontSize: 16,
    color: "#6b6b6b", 
    fontFamily: 'Nunito-Regular',
    marginBottom: 30,
    alignSelf: 'center',
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 16, 
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
    paddingHorizontal: 15, // Mantenemos padding horizontal
    paddingVertical: 12,   // Aumentamos el padding vertical para más altura
    width: "100%",
    marginBottom: 20,      // Aumentamos el margen inferior para más separación
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
    marginTop: 25, // Aumentamos el margen superior para separar del "olvidaste contraseña"
    marginBottom: 20,
    overflow: 'hidden', 
  },
  button: {
    borderRadius: 10, 
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: 'center',
    width: "100%",
    height: 50, 
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: 'Nunito-Bold', 
  },
  footerText: {
    fontSize: 14,
    color: "#000",
    marginTop: 20,
    alignSelf: 'center',
    fontFamily: 'Nunito-Regular',
  },
  link: {
    color: "#4d77b0", 
    fontFamily: 'Nunito-SemiBold',
  },
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginBottom: 10, // Reducimos el margen inferior para acercarlo al campo de contraseña
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    // Unificamos los márgenes verticales para un espaciado consistente
    marginVertical: 25,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#d1d1d1', 
    marginHorizontal: 10,
  },
  dividerText: {
    color: '#6b6b6b',
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '60%', 
    marginBottom: 30,
    alignSelf: 'center',
  },
  socialIconContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#d1d1d1',
    borderRadius: 50,
  },
  socialIcon: {
    width: 30,
    height: 30,
  },
});