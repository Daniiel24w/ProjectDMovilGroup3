import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { auth } from '../src/config/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
// Alertar personalizables para react native
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';

// Logo
import Logo from "../assets/logo.png";
// Iconos
import iconGmail from "../assets/icon/mail.png";
import iconPassword from "../assets/icon/key.png";
import iconUser from "../assets/icon/user.png";
import { Button } from 'react-native-web';

export default function SignUp({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // VALIDACIONES

  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Complete todos los campos",
        button: "Aceptar",
        closeOnOverlayTap: false
      });
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(password)) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "Error",
        textBody: "La contraseña debe tener al menos 6 caracteres, incluyendo una letra mayúscula, una minúscula y un número.",
        button: "Aceptar",
        closeOnOverlayTap: false
      });
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Registro exitoso",
        textBody: "Usuario registrado con éxito",
      });
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] }); 
    } catch (error) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          Dialog.show({
            type: ALERT_TYPE.WARNING,
            title: "Hubo un problema",
            textBody: "El correo electrónico ya está en uso.",
            button: "Aceptar",
            closeOnOverlayTap: false
          });
          break;
        case 'auth/invalid-email':
          Dialog.show({
            type: ALERT_TYPE.WARNING,
            title: "Hubo un problema",
            textBody: "El formato del correo electrónico no es válido.",
            button: "Aceptar",
            closeOnOverlayTap: false
          });
          break;
        case 'auth/weak-password':
          Dialog.show({
            type: ALERT_TYPE.WARNING,
            title: "Hubo un problema",
            textBody: "La contraseña es demasiado débil.",
            button: "Aceptar",
            closeOnOverlayTap: false
          });
          break;
        case 'auth/network-request-failed':
          Dialog.show({
            type: ALERT_TYPE.WARNING,
            title: "Hubo un problema",
            textBody: "Error de conexión, por favor intenta más tarde.",
            button: "Aceptar",
            closeOnOverlayTap: false
          });
          break;
      }
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Hubo un problema al registrar el usuario.",
      });
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Image source={Logo} style={styles.logo} />
        <Text style={styles.title}>Regístrate</Text>
        <Text style={styles.subTitle}>Registrate para poder continuar</Text>

        <Text style={styles.label}>Nombre:</Text>
        <View style={styles.inputContainer}>
          <Image source={iconUser} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            placeholderTextColor={"#6b6b6b"}
            keyboardType="ascii-capable"
            value={firstName}
            onChangeText={setFirstName}/>
        </View>

        <Text style={styles.label}>Apellido:</Text>
        <View style={styles.inputContainer}>
          <Image source={iconUser} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Apellido"
            placeholderTextColor={"#6b6b6b"}
            keyboardType="ascii-capable"
            value={lastName}
            onChangeText={setLastName}/>
        </View>

        <Text style={styles.label}>Correo</Text>
        <View style={styles.inputContainer}>
          <Image source={iconGmail} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor={"#6b6b6b"}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"/>
        </View>

        <Text style={styles.label}>Contraseña:</Text>
        <View style={styles.inputContainer}>
          <Image source={iconPassword} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor={"#6b6b6b"}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}/>
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <FontAwesome name={showPassword ? "eye-slash" : "eye"} size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Confirmar Contraseña:</Text>
        <View style={styles.inputContainer}>
          <FontAwesome name="lock" size={20} color="#ccc" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Repetir contraseña"
            placeholderTextColor={"#6b6b6b"}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}/>
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <FontAwesome name={showConfirmPassword ? "eye-slash" : "eye"} size={20} color="#ccc" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.rememberPassword}>
          <Text style={styles.footerText}>Al registrarte aceptar los <Text onPress={() => navigation.navigate('#')} style={styles.link}>Terminos y Condiciones</Text></Text>
        </View>


        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.signUpText}>¿Ya tienes cuenta? Inicia sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
    alignSelf: "flex-start",
    marginTop: 5,
    marginBottom: 20,
  },
});
