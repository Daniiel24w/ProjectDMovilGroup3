import * as React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { doc, deleteDoc } from 'firebase/firestore';
import { database } from '../../src/config/firebaseConfig';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function FuncionesBooks({
  id,
  title,
  author,
  summary,
  rating,
  publicationYear,
}) {
  const navigation= useNavigation()

  const onDelete = () => {
    Alert.alert(
      "Eliminar libro",
      `¿Estás seguro de que deseas eliminar "${title}"?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
          onPress: () => navigation.goBack(),
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const docRef = doc(database, "books", id);
              await deleteDoc(docRef);
              Alert.alert("Libro eliminado", "El libro ha sido eliminado con éxito.");
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar el libro.");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.bookCard}>


      
      <View style={styles.detailsContainer}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDetail}>Autor: {author}</Text>
        <Text style={styles.cardDetail}>Publicación: {publicationYear}</Text>

        <View style={styles.ratingContainer}>
          <Text style={styles.cardDetail}>Rating:</Text>
          {Array(5).fill(0).map((_, i) => (
            <Ionicons
              key={i}
              name={i < rating ? 'star' : 'star-outline'}
              size={16}
              color={i < rating ? '#FFD700' : '#888'}
              style={{ marginLeft: 3 }}
            />
          ))}
        </View>

        <Text style={styles.cardSummary}>Resumen: {summary}</Text>
      </View>

      
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButtonIcon}>
          <Ionicons name="create-outline" size={24} color="#FFD700" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButtonIcon}>
          <Ionicons name="download-outline" size={24} color="#16a2d1ff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButtonIcon}
          onPress={onDelete}
        >
          <AntDesign name="delete" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bookCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#EEE',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  bookCover: {
    width: 70,
    height: 100,
    borderRadius: 5,
    marginRight: 15,
    resizeMode: 'cover',
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
    marginBottom: 4,
  },
  cardDetail: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: '#555',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  cardSummary: {
    fontSize: 12,
    fontFamily: 'Roboto-Italic',
    color: '#888',
    marginTop: 4,
  },
  actionsContainer: {
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: '#F5F5F5',
  },
  actionButtonIcon: {
    padding: 5,
  },
});
