import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { auth } from '../src/config/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// Alertas personalizables para react native
// Alertas personalizables para react native
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';

// Logo
import Logo from "../assets/images/logo.png";
// Iconos
import iconGmail from "../assets/icon/mail.png";
import iconPassword from "../assets/icon/key.png";
import iconUser from "../assets/icon/user.png";
 //Mostrar los requisitos de la contraseña
const PasswordRequirement = ({ label, regex, value, styles }) => {
  const isMet = regex.test(value);

  const colorActive = '#a8e6cf'; 
  const colorInactive = '#d1d1d1'; 
  const color = isMet ? colorActive : colorInactive;

  const icon = isMet ? 'check-circle' : 'circle';

  return (
    <View style={styles.requirementItem}>
      <FontAwesome name={icon} size={14} color={color} style={styles.requirementIcon} />
      <Text style={[styles.requirementText, { color }]}>
        {label}
      </Text>
    </View>
  );
};
 //Mostrar los requisitos de la contraseña
const PasswordRequirement = ({ label, regex, value, styles }) => {
  const isMet = regex.test(value);

  const colorActive = '#a8e6cf'; 
  const colorInactive = '#d1d1d1'; 
  const color = isMet ? colorActive : colorInactive;

  const icon = isMet ? 'check-circle' : 'circle';

  return (
    <View style={styles.requirementItem}>
      <FontAwesome name={icon} size={14} color={color} style={styles.requirementIcon} />
      <Text style={[styles.requirementText, { color }]}>
        {label}
      </Text>
    </View>
  );
};

export default function SignUp({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  //FOCOS
  const [isFirstNameFocused, setIsFirstNameFocused] = useState(false);
  const [isLastNameFocused, setIsLastNameFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);
  
  // Colores para el borde enfocado
  const BORDER_COLOR_FOCUSED = '#191d1aff';
  const BORDER_COLOR_BLURRED = '#d1d1d1';

  // Función para obtener el estilo dinámico del borde
  const getBorderStyle = (isFocused) => ({
    borderColor: isFocused ? BORDER_COLOR_FOCUSED : BORDER_COLOR_BLURRED,
    borderWidth: isFocused ? 2 : 1,
  });

  // Nuevo estado para controlar si mostramos los requisitos
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

  const passwordRequirements = [
  {
    label: 'Mínimo 6 caracteres',
    regex: /.{6,}/,
  },
  {
    label: 'Una letra mayúscula',
    regex: /(?=.*[A-Z])/,
  },
  {
    label: 'Una letra minúscula',
    regex: /(?=.*[a-z])/,
  },
  {
    label: 'Al menos un número',
    regex: /(?=.*\d)/,
  },
  ];

  // VALIDACIONES
  const validarSoloLetras = (texto) => {
  const regexLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  if (!texto) return true; 
  return regexLetras.test(texto);
  };
  const validarSoloLetras = (texto) => {
  const regexLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  if (!texto) return true; 
  return regexLetras.test(texto);
  };

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
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "Error",
        textBody: "Las contraseñas no coinciden",
        button: "Aceptar",
        closeOnOverlayTap: false
      })
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


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "Correo inválido",
        textBody: "Por favor ingrese un correo válido",
        button: "Aceptar",
        closeOnOverlayTap: false
      });
      return;
    }
    if (!validarSoloLetras(firstName) || !validarSoloLetras(lastName)) {
      Dialog.show({
          type: ALERT_TYPE.WARNING,
          title: "Nombre o apellido invalido",
          textBody: "El nombre y apellido solo pueden contener letras y espacios. No se permiten números ni caracteres especiales.",
          button: "Aceptar",
          closeOnOverlayTap: false
        });
        button: "Aceptar",
        closeOnOverlayTap: false
      });
      return;
    }
    if (!validarSoloLetras(firstName) || !validarSoloLetras(lastName)) {
      Dialog.show({
          type: ALERT_TYPE.WARNING,
          title: "Nombre o apellido invalido",
          textBody: "El nombre y apellido solo pueden contener letras y espacios. No se permiten números ni caracteres especiales.",
          button: "Aceptar",
          closeOnOverlayTap: false
        });
      return;
    }

    if ((firstName.length < 4 || firstName.length > 25) || (lastName.length < 4 || lastName.length > 25)) {
    if ((firstName.length < 4 || firstName.length > 25) || (lastName.length < 4 || lastName.length > 25)) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "Nombre o apellido invalido",
        textBody: "Debe tener entre 4 y 25 caracteres",
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
    <SafeAreaView style={styles.safeAreaContainer}>
      <KeyboardAwareScrollView
            extraScrollHeight={200}
            resetScrollToCoords={{ x: 0, y: 0 }}
            enableOnAndroid={true}
            keyboardVerticalOffset={100}
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingBottom: 40 }}
          >
      
        <View style={styles.container}>
          <Image source={Logo} style={styles.logo} />
          <Text style={styles.title}>Regístrate</Text>
          <Text style={styles.subTitle}>Registrate para poder continuar</Text>
    <SafeAreaView style={styles.safeAreaContainer}>
      <KeyboardAwareScrollView
            extraScrollHeight={200}
            resetScrollToCoords={{ x: 0, y: 0 }}
            enableOnAndroid={true}
            keyboardVerticalOffset={100}
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingBottom: 40 }}
          >
      
        <View style={styles.container}>
          <Image source={Logo} style={styles.logo} />
          <Text style={styles.title}>Regístrate</Text>
          <Text style={styles.subTitle}>Registrate para poder continuar</Text>

          <Text style={styles.label}>Nombre:</Text>
          <View style={[styles.inputContainer, getBorderStyle(isFirstNameFocused)]}>
            <Image source={iconUser} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              placeholderTextColor={"#6b6b6b"}
              keyboardType="ascii-capable"
              value={firstName}
              onChangeText={setFirstName}
              onFocus={() => setIsFirstNameFocused(true)}
              onBlur={() => setIsFirstNameFocused(false)}/>
          </View>
          <Text style={styles.label}>Nombre:</Text>
          <View style={[styles.inputContainer, getBorderStyle(isFirstNameFocused)]}>
            <Image source={iconUser} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              placeholderTextColor={"#6b6b6b"}
              keyboardType="ascii-capable"
              value={firstName}
              onChangeText={setFirstName}
              onFocus={() => setIsFirstNameFocused(true)}
              onBlur={() => setIsFirstNameFocused(false)}/>
          </View>

          <Text style={styles.label}>Apellido:</Text>
          <View style={[styles.inputContainer, getBorderStyle(isLastNameFocused)]}>
            <Image source={iconUser} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Apellido"
              placeholderTextColor={"#6b6b6b"}
              keyboardType="ascii-capable"
              value={lastName}
              onChangeText={setLastName}
              onFocus={() => setIsLastNameFocused(true)}
              onBlur={() => setIsLastNameFocused(false)}/>
          </View>
          <Text style={styles.label}>Apellido:</Text>
          <View style={[styles.inputContainer, getBorderStyle(isLastNameFocused)]}>
            <Image source={iconUser} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Apellido"
              placeholderTextColor={"#6b6b6b"}
              keyboardType="ascii-capable"
              value={lastName}
              onChangeText={setLastName}
              onFocus={() => setIsLastNameFocused(true)}
              onBlur={() => setIsLastNameFocused(false)}/>
          </View>

          <Text style={styles.label}>Correo</Text>
          <View style={[styles.inputContainer, getBorderStyle(isEmailFocused)]}>
            <Image source={iconGmail} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor={"#6b6b6b"}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              onFocus={() => setIsEmailFocused(true)}
              onBlur={() => setIsEmailFocused(false)}/>
          </View>
          <Text style={styles.label}>Correo</Text>
          <View style={[styles.inputContainer, getBorderStyle(isEmailFocused)]}>
            <Image source={iconGmail} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
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
            <Image source={iconPassword} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor={"#6b6b6b"}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}/>
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <FontAwesome name={showPassword ? "eye-slash" : "eye"} size={20} color="#ccc" />
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
          <Text style={styles.label}>Contraseña:</Text>
          <View style={[styles.inputContainer, getBorderStyle(isPasswordFocused)]}>
            <Image source={iconPassword} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor={"#6b6b6b"}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}/>
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <FontAwesome name={showPassword ? "eye-slash" : "eye"} size={20} color="#ccc" />
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

          <Text style={styles.label}>Confirmar Contraseña:</Text>
          <View style={[styles.inputContainer, getBorderStyle(isConfirmPasswordFocused)]}>
            <FontAwesome name="lock" size={20} color="#ccc" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Repetir contraseña"
              placeholderTextColor={"#6b6b6b"}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              onFocus={() => setIsConfirmPasswordFocused(true)}
              onBlur={() => setIsConfirmPasswordFocused(false)}/>
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <FontAwesome name={showConfirmPassword ? "eye-slash" : "eye"} size={20} color="#ccc" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.rememberPassword}>
            <Text style={styles.footerText}>Al registrarte aceptar los <Text onPress={() => Dialog.show({
                        type: ALERT_TYPE.INFO,
                        title: "Información",
                        textBody: "Funcionalidad no implementada. Aquí se mostrarían los Términos y Condiciones.",
                        button: "Aceptar",
                        closeOnOverlayTap: true
                    })}  style={styles.link}>Terminos y Condiciones</Text></Text>
          </View>
          <Text style={styles.label}>Confirmar Contraseña:</Text>
          <View style={[styles.inputContainer, getBorderStyle(isConfirmPasswordFocused)]}>
            <FontAwesome name="lock" size={20} color="#ccc" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Repetir contraseña"
              placeholderTextColor={"#6b6b6b"}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              onFocus={() => setIsConfirmPasswordFocused(true)}
              onBlur={() => setIsConfirmPasswordFocused(false)}/>
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <FontAwesome name={showConfirmPassword ? "eye-slash" : "eye"} size={20} color="#ccc" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.rememberPassword}>
            <Text style={styles.footerText}>Al registrarte aceptar los <Text onPress={() => Dialog.show({
                        type: ALERT_TYPE.INFO,
                        title: "Información",
                        textBody: "Funcionalidad no implementada. Aquí se mostrarían los Términos y Condiciones.",
                        button: "Aceptar",
                        closeOnOverlayTap: true
                    })}  style={styles.link}>Terminos y Condiciones</Text></Text>
          </View>


          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Registrarse</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Registrarse</Text>
          </TouchableOpacity>

          
          <Text style={styles.signUpText}>¿Ya tienes cuenta? <Text onPress={() => navigation.navigate('Login')}style={styles.link}>Inicia sesión</Text></Text>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
          
          <Text style={styles.signUpText}>¿Ya tienes cuenta? <Text onPress={() => navigation.navigate('Login')}style={styles.link}>Inicia sesión</Text></Text>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeAreaContainer: {
  safeAreaContainer: {
    flex: 1,
    backgroundColor: "#425949", 
  },
  container: {
    backgroundColor: "#425949", 
  },
  container: {
    alignItems: "center",
    padding: 20,
    paddingTop: 50, 
    paddingBottom: 50,
    paddingTop: 50, 
    paddingBottom: 50,
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
  requirementsBox: {
    backgroundColor: 'transparent', 
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 10,
    width: '100%',
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
  },
  requirementsBox: {
    backgroundColor: 'transparent', 
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 10,
    width: '100%',
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
  },
});