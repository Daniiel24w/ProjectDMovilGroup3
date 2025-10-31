import React, { useState, useEffect } from 'react';
import { View, Text, ImageBackground, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import { auth, database } from '../src/config/firebaseConfig';
import { signOut } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';

const LOGO_IMAGE = require('../assets/images/logo.png');
const PROFILE_IMAGE_GENERIC = require('../assets/images/image.png');
const BACKGROUND_IMAGE = require('../assets/images/BackGround-Wallpaper.jpg');

const DrawerNavigationCustom = (props) => {
    const [userData, setUserData] = useState(null);
    const currentUser = auth.currentUser;

    useEffect(() => {
        if (currentUser) {
            const userDocRef = doc(database, 'users', currentUser.uid);
            const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
                if (docSnap.exists()) {
                    setUserData(docSnap.data());
                } else {
                    // Fallback si el documento no existe pero el usuario sí
                    setUserData({
                        displayName: currentUser.displayName || 'Usuario',
                        photoURL: currentUser.photoURL,
                    });
                }
            });

            return () => unsubscribe();
        }
    }, [currentUser]);

    const handleLogout = () => {
        Dialog.show({
            type: ALERT_TYPE.WARNING,
            title: 'Confirmar Cierre de Sesión',
            textBody: '¿Estás seguro de que quieres cerrar sesión?',
            button: 'Cerrar Sesión',
            onPressButton: async () => {
                Dialog.hide();
                try {
                    await signOut(auth);
                } catch (error) {
                    Dialog.show({
                        type: ALERT_TYPE.DANGER,
                        title: 'Error',
                        textBody: 'No se pudo cerrar sesión. Inténtalo de nuevo.',
                        button: 'Aceptar',
                    });
                }
            },
            closeOnOverlayTap: true,
        });
    };

    return (
        <View style={styles.container}>
            <ImageBackground 
                source={BACKGROUND_IMAGE} 
                style={styles.profileHeaderBackground}
            >
                <View style={styles.darkOverlay}> 
                    <View style={styles.appTitleContainer}>
                        <Image source={LOGO_IMAGE} style={styles.logo} />
                    </View>
                    <View style={styles.headerSeparator} />
                    {/* // TODO: Obtener la información del usuario de Firebase */}
                    <View style={styles.userInfoContainer}> 
                        <Image 
                            source={userData?.photoURL ? { uri: userData.photoURL } : PROFILE_IMAGE_GENERIC} 
                            style={styles.profileImage}/>
                        <Text style={styles.userNameText}>{userData?.displayName || 'Cargando...'}</Text>
                    </View>    
                </View>
            </ImageBackground>
            <DrawerContentScrollView 
                {...props} 
                contentContainerStyle={styles.drawerScrollViewContent} 
            >
                <View style={styles.drawerItemsContainer}>
                    <DrawerItemList {...props}/>
                </View>
            </DrawerContentScrollView>
            <View style={styles.footer}>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <Ionicons name="log-out-outline" size={24} color="#d9534f" />
                    <Text style={styles.logoutText}>Cerrar Sesión</Text>
                </TouchableOpacity>
                <Text style={styles.versionText}>Mundo Libro - 2025</Text>
            </View>
        </View>
    );
}

export default DrawerNavigationCustom;

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: '#FFFFFF', // Fondo blanco
    },
    profileHeaderBackground: {
        height: 280, // Aumentar la altura para más espacio
        justifyContent: 'flex-end',
    },    
    darkOverlay: {
        flex: 1, 
        backgroundColor: 'rgba(0, 0, 0, 0.7)', 
        padding: 20, 
        paddingTop: 50, // Añadir padding superior para bajar el contenido
        justifyContent: 'center',
    },
    appTitleContainer: {
        alignItems: 'center', 
        marginBottom: 20, // Aumentar margen inferior
    },
    logo: {
        width: 150,
        height: 50,
        resizeMode: 'contain',
        tintColor: '#FFF',
    },
    headerSeparator: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        marginBottom: 20, // Aumentar margen inferior
    },
    userInfoContainer: {
        alignItems: 'center', 
    },
    profileImage: {
        height: 90,
        width: 90,
        borderRadius: 45,
        marginBottom: 10,
        borderWidth: 3,
        borderColor: 'rgba(255, 255, 255, 0.9)',
    },
    userNameText: {
        color: '#FFFFFF', // Mantenemos el texto blanco sobre el fondo oscuro
        fontSize: 18,
        fontFamily: 'Nunito-Bold', 
    },
    drawerScrollViewContent: {
        paddingTop: 0, // Quitamos padding superior
    },
    drawerItemsContainer: {
        paddingHorizontal: 5,
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#EEE', // Borde claro
        alignItems: 'center',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    logoutText: {
        color: '#d9534f',
        fontWeight: 'bold',
        marginLeft: 10,
        fontSize: 16,
    },
    versionText: {
        fontSize: 12,
        color: '#888',
        textAlign: 'center',
        marginTop: 15,
    },
});