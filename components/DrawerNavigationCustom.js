import React from 'react';
import { View, Text, ImageBackground, Image, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItemList, DrawerItem} from '@react-navigation/drawer';
// Iconos
import { Ionicons } from '@expo/vector-icons';
// Imagenes 
const PROFILE_IMAGE = require('../assets/images/image.png');
const BACKGROUND_IMAGE = require('../assets/images/image.png');

const DrawerNavigationCustom = (props) => {
    return (
        <View style={styles.container}>
            <ImageBackground 
                source={BACKGROUND_IMAGE} 
                style={styles.profileHeaderBackground}
            >
                <View style={styles.darkOverlay}> 
                    <View style={styles.appTitleContainer}>
                        <Text style={styles.appTitleText}>Mundo Libro</Text>
                    </View>
                    <View style={styles.headerSeparator} />
                    <View style={styles.userInfoContainer}>
                        <Image source={PROFILE_IMAGE} style={styles.profileImage}/>
                        <Text style={styles.userNameText}>Hector Daniel, Medina</Text>
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
                <DrawerItem
                    label="Cerrar Sesión"
                    icon={({ size }) => (
                        <Ionicons name="log-out-outline" size={size} color="red" />
                    )}
                    labelStyle={styles.logoutText}
                />
                <Text style={styles.versionText}>Mundo Libro - 2025</Text>
            </View>
        </View>
    );
}

export default DrawerNavigationCustom;

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: 'white',
    },
    profileHeaderBackground: {
        height: 260, 
        padding: 0,
        justifyContent: 'flex-start',
    },    
    darkOverlay: {
        flex: 1, 
        backgroundColor: 'rgba(0, 0, 0, 0.6)', 
        padding: 20, 
        justifyContent: 'flex-start',
    },
    appTitleContainer: {
        paddingTop: 25,
        marginBottom: 10,
        alignItems: 'center', 
    },
    appTitleText: {
        color: 'white',
        fontSize: 22,
        fontFamily: 'Nunito-Medium',
        textAlign: 'left',
    },
    headerSeparator: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        marginBottom: 15,
    },
    userInfoContainer: {
        alignItems: 'center', 
        paddingVertical: 10,
    },
    profileImage: {
        height: 90,
        width: 90,
        borderRadius: 45,
        marginBottom: 8,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.8)',
        resizeMode: 'cover',
    },
    userNameText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Nunito-Medium', 
        textAlign: 'center',
    },
    drawerScrollViewContent: {
        paddingTop: 0,
    },
    drawerItemsContainer: {
        marginTop: 10, 
        paddingHorizontal: 5,
    },
    footer: {
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        backgroundColor: 'white',
        alignItems: 'start',
        marginTop: 50,
        marginBottom: 50,
    },
    logoutText: {
        color: 'red',
        fontWeight: 'bold',
    },
    versionText: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        paddingTop: 5,
    },
});