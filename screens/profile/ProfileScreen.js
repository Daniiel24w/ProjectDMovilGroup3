// screens/ProfileScreen.js

import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Placeholder para la imagen del perfil
const DEFAULT_PROFILE_IMAGE = require('../../assets/images/image.png'); 

export default function ProfileScreen({ navigation }) {
  const userData = {
    name: "Hector Daniel Medina",
    email: "hector.daniel@mundolibro.com",
    booksUploaded: 10,
    booksRead: 5,
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Image source={DEFAULT_PROFILE_IMAGE} style={styles.profileImage} />
        <Text style={styles.userName}>{userData.name}</Text>
        <Text style={styles.userEmail}>{userData.email}</Text>

        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Ionicons name="pencil-outline" size={20} color="white" />
          <Text style={styles.editButtonText}>Editar Perfil</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{userData.booksUploaded}</Text>
          <Text style={styles.statLabel}>Libros Subidos</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{userData.booksRead}</Text>
          <Text style={styles.statLabel}>Libros Leídos</Text>
        </View>
      </View>

      <Text style={styles.sectionHeader}>Tu Actividad Reciente</Text>
      <View style={styles.activityCard}>
        <Text style={styles.activityText}>No hay actividad reciente.</Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerContainer: {
    backgroundColor: '#00BFFF', 
    padding: 30,
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: 'white',
  },
  userName: {
    fontSize: 22,
    fontFamily: 'Nunito-Bold',
    color: 'white',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 15,
  },
  editButton: {
    flexDirection: 'row',
    backgroundColor: '#32CD32', 
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignItems: 'center',
  },
  editButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
    marginLeft: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: '#F5F5F5',
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Nunito-Bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#666',
  },
  sectionHeader: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    paddingHorizontal: 15,
    paddingVertical: 15,
    color: '#333',
  },
  activityCard: {
    padding: 15,
    backgroundColor: 'white',
    marginHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  activityText: {
    fontFamily: 'Nunito-Regular',
    color: '#888',
  }
});