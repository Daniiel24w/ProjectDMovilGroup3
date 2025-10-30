// screens/SettingsScreen.js

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Componente reutilizable para cada opción
const SettingItem = ({ icon, title, onPress }) => (
  <TouchableOpacity style={itemStyles.item} onPress={onPress}>
    <Ionicons name={icon} size={24} color="#555" style={itemStyles.icon} />
    <Text style={itemStyles.title}>{title}</Text>
    <Ionicons name="chevron-forward-outline" size={20} color="#999" />
  </TouchableOpacity>
);

export default function SettingsScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Cuenta</Text>
      <SettingItem 
        icon="person-circle-outline" 
        title="Editar Perfil" 
        onPress={() => navigation.navigate('Profile', { screen: 'EditProfile' })}
      />
      <SettingItem 
        icon="lock-closed-outline" 
        title="Cambiar Contraseña" 
        onPress={() => console.log('Navegar a cambiar contraseña')}
      />

      <Text style={styles.header}>General</Text>
      <SettingItem 
        icon="notifications-outline" 
        title="Notificaciones" 
        onPress={() => console.log('Abrir notificaciones')}
      />
      <SettingItem 
        icon="earth-outline" 
        title="Idioma" 
        onPress={() => console.log('Abrir selector de idioma')}
      />

      <Text style={styles.header}>Soporte</Text>
      <SettingItem 
        icon="information-circle-outline" 
        title="Acerca de" 
        onPress={() => console.log('Navegar a Acerca de')}
      />
      <SettingItem 
        icon="help-circle-outline" 
        title="Ayuda y FAQs" 
        onPress={() => console.log('Navegar a ayuda')}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  header: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    color: '#333',
    paddingHorizontal: 15,
    paddingTop: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    backgroundColor: 'white',
  },
});

const itemStyles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  icon: {
    width: 30,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    marginLeft: 10,
  },
});