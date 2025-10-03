// Importaciones a usar en la vista de Login
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { auth } from '../src/config/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
//Focus en los campos react-native-keyboard-aware-scroll-view
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// Alertar personalizables para react native
import { ALERT_TYPE, Dialog, Toast } from 'react-native-alert-notification';


// Logo
import Logo from "../assets/logo.png";
// Iconos
import iconGmail from "../assets/icon/mail.png";
import iconPassword from "../assets/icon/key.png";

// Componente principal de la pantalla de Login
export default function Login({ navigation }) {

  // Estados para manejar el email, la contraseña y la visibilidad de la contraseña
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // VALIDACIONES 
  const validarEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  const validarPassword = (password) => {
    // Al menos 6 caracteres, una mayúscula, una minúscula y un número
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return passwordRegex.test(password);
  }

  // Validaciones con if
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
    } else if (!validarEmail(email) && !validarPassword(password)) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Correo y contraseña inválidos",
      }); 
      return;
    } else if (!validarEmail(email)) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Correo inválido",
      }); 
      return;
    } else if (!validarPassword(password)) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Contraseña inválida",
      }); 
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Login exitoso",
        textBody: "Has iniciado sesión correctamente.",
      });
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] }); 
    } catch (error) {
      switch (error.code) {
        case 'auth/invalid-email':
          Dialog.show({
            type: ALERT_TYPE.WARNING,
            title: "Hubo un problema",
            textBody: "El formato del correo electrónico no es válido.",
            button: "Aceptar",
            closeOnOverlayTap: true,
          });
          break;
        case 'auth/wrong-password':
          Dialog.show({
            type: ALERT_TYPE.WARNING,
            title: "Hubo un problema",
            textBody: "La contraseña es incorrecta.",
            button: "Aceptar",
            closeOnOverlayTap: true,
          });
          break;
        case 'auth/user-not-found':
          Dialog.show({
            type: ALERT_TYPE.WARNING,
            title: "Hubo un problema",
            textBody: "No se encontró un usuario con este correo.",
            button: "Aceptar",
            closeOnOverlayTap: true,
          });
          break;
        case 'auth/network-request-failed':
          Dialog.show({
            type: ALERT_TYPE.WARNING,
            title: "Hubo un problema",
            textBody: "Error de conexión, por favor intenta más tarde.",
            button: "Aceptar",
            closeOnOverlayTap: true,
          });
          break;
      }
      Toast.show({
          type: ALERT_TYPE.WARNING,
          title: "Hubo un problema",
        });
    }
  };

  return (
    <KeyboardAwareScrollView
      extraScrollHeight={40}
      resetScrollToCoords={{ x: 0, y: 0 }}
      enableOnAndroid={true}
      keyboardVerticalOffset={100}
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
    >

      <View style={style.container}>
        <Image source={Logo} style={style.logo}/>
        <Text style={style.title}>Iniciar sesión</Text>
        <Text style={style.subTitle}>¡Bienvenido otra vez! Alegrado de verte</Text>

        <Text style={style.label}>Correo electrónico:</Text>
        <View style={style.inputContainer}>
          <Image source={iconGmail} style={style.icon}/>
          <TextInput
            style={style.input}
            placeholder="Correo electrónico"
            placeholderTextColor={"#6b6b6b"}
            onChangeText={(value) => setEmail(value)}
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"/>
        </View>

        <Text style={style.label}>Contraseña:</Text>
        <View style={style.inputContainer}>
          <Image source={iconPassword} style={style.icon}/>
          <TextInput
            style={style.input}
            placeholder="************"
            placeholderTextColor={"#6b6b6b"}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}/>
          <TouchableOpacity style={style.icon} onPress={() => setShowPassword(!showPassword)}>
            <FontAwesome name={showPassword ? "eye-slash" : "eye"} size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        <View style={style.rememberPassword}>
          <Text onPress={() => navigation.navigate('#')} style={style.link}>¿Olvide mi contraseña?</Text>
        </View>

        <TouchableOpacity onPress={handleLogin} style={style.button}>
          <Text style={style.buttonText}>Ingresar</Text>
        </TouchableOpacity>

        <Text style={style.footerText}>¿No tienes cuenta aún? <Text onPress={() => navigation.navigate('SignUp')} style={style.link}>Regístrate</Text></Text>
      </View>
    </KeyboardAwareScrollView>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#425949",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    resizeMode: "contain",
  },
  title: {
    fontSize: 28,
    color: "#FFF",
    fontWeight: "bold",
    marginBottom: 25,
  },
  subTitle: {
    fontSize: 14,
    color: "#FFF",
    marginBottom: 50,
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 16,
    color: "#ffffffff",
    fontWeight: "bold",
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 25,
    borderColor: "#000",
    paddingHorizontal: 15,
    paddingVertical: 8,
    width: "100%",
    marginBottom: 15,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
    tintColor: "#6b6b6b",
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#000",
  },
  button: {
    backgroundColor: "#4d77b0",
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
    width: "100%",
    marginTop: 10,
    marginBottom: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footerText: {
    fontSize: 14,
    color: "#000000ff",
    marginTop: 10,
  },
  link: {
    color: "#0099ffff",
    fontWeight: "bold",
  },
  rememberPassword: {
    alignSelf: "flex-end",
    marginTop: 5,
    marginBottom: 20,
  },
});