import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, database } from '../../src/config/firebaseConfig';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LinearGradient } from 'expo-linear-gradient';
import { ALERT_TYPE, Dialog, Toast } from 'react-native-alert-notification';
import Logo from "../../assets/images/logo.png";

const LOGIN_SCREEN = 'Login';

const PasswordRequirement = ({ label, regex, value, styles }) => {
  const isMet = regex.test(value);
  const colorActive = '#1e1e1e'; 
  const colorInactive = '#d1d1d1'; 
  const color = isMet ? colorActive : colorInactive;
  const icon = isMet ? 'checkmark-circle' : 'ellipse-outline';

  return (
    <View style={styles.requirementItem}>
      <Ionicons name={icon} size={14} color={color} style={styles.requirementIcon} />
      <Text style={[styles.requirementText, { color }]}>
        {label}
      </Text>
    </View>
  );
};

export default function RegisterScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isFirstNameFocused, setIsFirstNameFocused] = useState(false);
  const [isLastNameFocused, setIsLastNameFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);
  
  const BORDER_COLOR_FOCUSED = '#1e1e1e';
  const BORDER_COLOR_BLURRED = '#d1d1d1';

  const getBorderStyle = (isFocused) => ({
    borderColor: isFocused ? BORDER_COLOR_FOCUSED : BORDER_COLOR_BLURRED,
    borderWidth: isFocused ? 2 : 1,
    borderRadius: 10, 
  });

  const passwordRequirements = [
    { label: 'Mínimo 6 caracteres', regex: /.{6,}/, },
    { label: 'Una letra mayúscula', regex: /(?=.*[A-Z])/, },
    { label: 'Una letra minúscula', regex: /(?=.*[a-z])/, },
    { label: 'Al menos un número', regex: /(?=.*\d)/, },
  ];

  const validateOnlyLetters = (text) => {
    const lettersRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!text) return true; 
    return lettersRegex.test(text);
  };

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      Dialog.show({ type: ALERT_TYPE.DANGER, title: "Error", textBody: "Complete todos los campos", button: "Aceptar", closeOnOverlayTap: false });
      return;
    }

    if (!validateOnlyLetters(firstName) || !validateOnlyLetters(lastName)) {
      Dialog.show({ type: ALERT_TYPE.WARNING, title: "Nombre o apellido inválido", textBody: "El nombre y apellido solo pueden contener letras y espacios.", button: "Aceptar", closeOnOverlayTap: false });
      return;
    }

    if ((firstName.length < 4 || firstName.length > 25) || (lastName.length < 4 || lastName.length > 25)) {
      Dialog.show({ type: ALERT_TYPE.WARNING, title: "Nombre o apellido inválido", textBody: "Debe tener entre 4 y 25 caracteres", button: "Aceptar", closeOnOverlayTap: false });
      return;
    }
    
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      Dialog.show({ type: ALERT_TYPE.WARNING, title: "Correo inválido", textBody: "Por favor ingrese un correo válido", button: "Aceptar", closeOnOverlayTap: false });
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(password)) {
      Dialog.show({ type: ALERT_TYPE.WARNING, title: "Contraseña inválida", textBody: "La contraseña debe cumplir con todos los requisitos.", button: "Aceptar", closeOnOverlayTap: false });
      return;
    }

    if (password !== confirmPassword) {
      Dialog.show({ type: ALERT_TYPE.WARNING, title: "Error", textBody: "Las contraseñas no coinciden", button: "Aceptar", closeOnOverlayTap: false });
      return;
    }

    try {
      // 1. Crear el usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const fullName = `${lastName}, ${firstName}`;

      // 2. Actualizar el perfil de Firebase Auth (displayName)
      await updateProfile(user, {
        displayName: fullName,
      });

      // 3. Crear un documento para el usuario en Firestore
      await setDoc(doc(database, "users", user.uid), {
        displayName: fullName,
        email: user.email,
        photoURL: '', // Inicialmente vacío
        address: '',   // Inicialmente vacío
        phone: '',     // Inicialmente vacío
      });

      // Mostramos el Toast de éxito. El listener de Auth se encargará de la navegación.
      Toast.show({ type: ALERT_TYPE.SUCCESS, title: "Registro exitoso", textBody: "Usuario registrado con éxito" });
      // No es necesario navegar manualmente, onAuthStateChanged lo hará.

    } catch (error) {
      let title = "Hubo un problema";
      let textBody = "No se pudo registrar el usuario. Intenta nuevamente.";

      switch (error.code) {
        case 'auth/email-already-in-use':
          textBody = "El correo electrónico ya está en uso.";
          break;
        case 'auth/invalid-email':
          textBody = "El formato del correo electrónico no es válido.";
          break;
        case 'auth/weak-password':
          textBody = "La contraseña es demasiado débil.";
          break;
        case 'auth/network-request-failed':
          textBody = "Error de conexión, por favor intenta más tarde.";
          break;
      }
      Dialog.show({ type: ALERT_TYPE.WARNING, title: title, textBody: textBody, button: "Aceptar", closeOnOverlayTap: false });
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
            extraScrollHeight={200}
            resetScrollToCoords={{ x: 0, y: 0 }}
            enableOnAndroid={true}
            keyboardVerticalOffset={100}
            contentContainerStyle={styles.scrollContent}
          >
        
          <View style={styles.topContainer}>
            <Image source={Logo} style={styles.logo} />
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Crear Cuenta</Text>
            <Text style={styles.subTitle}>Cree una cuenta para poder continuar</Text>

            <View style={styles.rowContainer}>
              <View style={styles.inputColumn}>
                <Text style={styles.label}>Nombres:</Text>
                <View style={[styles.inputContainer, getBorderStyle(isFirstNameFocused)]}>
                  <Ionicons name="person-outline" size={20} color="#6b6b6b" style={styles.icon}/>
                  <TextInput
                    style={styles.input}
                    placeholder="Nombres"
                    placeholderTextColor={"#6b6b6b"}
                    keyboardType="default"
                    value={firstName}
                    onChangeText={setFirstName}
                    onFocus={() => setIsFirstNameFocused(true)}
                    onBlur={() => setIsFirstNameFocused(false)}/>
                </View>
              </View>

              <View style={styles.inputColumn}>
                <Text style={styles.label}>Apellidos:</Text>
                <View style={[styles.inputContainer, getBorderStyle(isLastNameFocused)]}>
                  <Ionicons name="person-outline" size={20} color="#6b6b6b" style={styles.icon}/>
                  <TextInput
                    style={styles.input}
                    placeholder="Apellidos"
                    placeholderTextColor={"#6b6b6b"}
                    keyboardType="default"
                    value={lastName}
                    onChangeText={setLastName}
                    onFocus={() => setIsLastNameFocused(true)}
                    onBlur={() => setIsLastNameFocused(false)}/>
                </View>
              </View>
            </View>

            <Text style={styles.label}>Correo electrónico:</Text>
            <View style={[styles.inputContainer, getBorderStyle(isEmailFocused)]}>
              <Ionicons name="mail-outline" size={20} color="#6b6b6b" style={styles.icon}/>
              <TextInput
                style={styles.input}
                placeholder="Example@example.com"
                placeholderTextColor={"#6b6b6b"}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}/>
            </View>

            <Text style={styles.label}>Contraseña:</Text>
            <View style={[styles.inputContainer, getBorderStyle(isPasswordFocused)]}>
              <Ionicons name="key-outline" size={20} color="#6b6b6b" style={styles.icon} />
              <TextInput
                style={styles.input}
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
            {isPasswordFocused && ( 
              <View style={styles.requirementsBox}>
                {passwordRequirements.map((req, index) => (
                  <PasswordRequirement
                    key={index}
                    label={req.label}
                    regex={req.regex}
                    value={password}
                    styles={styles}
                  />
                ))}
              </View>
            )}

            <Text style={styles.label}>Repetir Contraseña:</Text>
            <View style={[styles.inputContainer, getBorderStyle(isConfirmPasswordFocused)]}>
              <Ionicons name="key-outline" size={20} color="#6b6b6b" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="************"
                placeholderTextColor={"#6b6b6b"}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                onFocus={() => setIsConfirmPasswordFocused(true)}
                onBlur={() => setIsConfirmPasswordFocused(false)}/>
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Ionicons name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#ccc" />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity style={styles.buttonWrapper} onPress={handleRegister}>
              <LinearGradient
                colors={['#000000', '#7A2A13']} 
                start={{ x: 0, y: 0 }} 
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Registrarse</Text>
              </LinearGradient>
            </TouchableOpacity>

            
            <Text style={styles.RegisterText}>¿Ya tienes cuenta? <Text onPress={() => navigation.navigate(LOGIN_SCREEN)}style={styles.link}>Inicia sesión</Text></Text>
          </View>
        </KeyboardAwareScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
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
  },
  topContainer: { 
    alignItems: "center",
    padding: 20,
    paddingTop: 50, 
    paddingBottom: 50,
    minHeight: 180,
  },
  logo: {
    width: 100,
    height: 60,
    marginBottom: 20,
    resizeMode: "contain",
    tintColor: "#FFF" 
  },
  card: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingHorizontal: 30,
    paddingVertical: 20,
    flex: 1,
    marginTop: -50,
  },
  title: {
    fontSize: 24,
    color: "#000",
    fontFamily: 'Nunito-Bold',
    marginBottom: 5,
    alignSelf: 'center',
  },
  subTitle: {
    fontSize: 14,
    color: "#6b6b6b",
    fontFamily: 'Nunito-Regular',
    marginBottom: 30,
    alignSelf: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Mantenemos la distribución
    marginBottom: 10, // Reducimos un poco el margen para que los campos de nombre/apellido se sientan agrupados
  },
  inputColumn: {
    width: '48%', 
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 14,
    color: "#000",
    fontFamily: 'Nunito-SemiBold',
    marginBottom: 8, // Aumentamos el espacio entre la etiqueta y el campo
    marginTop: 15, // Añadimos margen superior para separar de elementos anteriores
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 10, 
    paddingHorizontal: 15, // Mantenemos padding horizontal
    paddingVertical: 12,   // Aumentamos padding vertical para más altura
    width: "100%",
    marginBottom: 0,
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
    fontFamily: 'Nunito-Regular',
    paddingVertical: 0,
  },
  buttonWrapper: {
    borderRadius: 10,
    width: "100%",
    marginTop: 30, // Aumentamos el margen superior para separar del último campo
    marginBottom: 25, // Aumentamos el margen inferior
    overflow: 'hidden', 
  },
  button: {
    borderRadius: 10, 
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: 'center',
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
  },
  RegisterText: { 
    fontSize: 14,
    color: "#000",
    marginTop: 10,
    alignSelf: 'center',
    fontFamily: 'Nunito-Regular',
  },
  link: {
    color: "#4d77b0",
    fontFamily: 'Nunito-SemiBold',
  },
  requirementsBox: {
    backgroundColor: 'transparent', 
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 10,
    marginTop: 5, // Añadimos un pequeño margen superior
    marginBottom: 15, 
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  requirementIcon: {
    marginRight: 8,
    width: 15,
    textAlign: 'center',
  },
  requirementText: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
  },
});