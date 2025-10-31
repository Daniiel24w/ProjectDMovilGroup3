import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler';
import { database } from '../../src/config/firebaseConfig';
import { onSnapshot, collection, orderBy, query } from 'firebase/firestore';
import FuncionesBooks from '../books/FuncionesBooks';

const { height } = Dimensions.get('window');

const LIBRARY_BACKGROUND = require('../../assets/images/BackGround-Wallpaper.jpg');

export default function BooksScreen({ navigation }) {

  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const collectionRef = collection(database, 'books');
    const q = query(collectionRef, orderBy('rating', 'desc'));

    const unsubscribe = onSnapshot(q, snapshot => {
      setBooks(
        snapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title,
          author: doc.data().author, 
          summary: doc.data().summary, 
          rating: doc.data().rating, 
          publicationYear: doc.data().publicationYear,
          coverUrl: doc.data().coverUrl, // Añadimos coverUrl
        }))
      );
    });

    return unsubscribe;
  }, []);

  // Filtrar libros en tiempo real basado en la búsqueda
  const filteredBooks = books.filter(book => {
    const queryLower = searchQuery.toLowerCase();
    const titleLower = book.title.toLowerCase();
    const authorLower = book.author.toLowerCase();

    return titleLower.includes(queryLower) || authorLower.includes(queryLower);
  });


  return (
    <View style={styles.container}>

      
      <ImageBackground source={LIBRARY_BACKGROUND} style={styles.backgroundImage}>
        <View style={styles.darkOverlay} />
      </ImageBackground>

      
      <View style={styles.buttonsSection}>

      
        <View style={styles.searchHeader}>

        
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="#888" style={{ marginRight: 8 }} />
            <TextInput 
              placeholder="Buscar por título o autor..." 
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery} />
          </View>

          
          <TouchableOpacity
            style={styles.fab}
            onPress={() => navigation.navigate("CreateBooks")}
          >
            <Ionicons name="add" size={30} color="white" />
          </TouchableOpacity>

        </View>

        
        <ScrollView style={styles.listContent} showsVerticalScrollIndicator={false}>
          {filteredBooks.map(book => (
            <FuncionesBooks key={book.id} {...book} />
          ))}
        </ScrollView>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0', // Fondo principal claro
  },
  backgroundImage: {
    width: '100%',
    height: height * 0.45,
    position: 'absolute',
  },
  darkOverlay: { // Mantenemos el overlay oscuro para la imagen de fondo
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Overlay más oscuro
  },

  buttonsSection: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: '#f0f0f0', // Fondo claro para la lista
    marginTop: height * 0.45 * 0.5,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 30,
  },

  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Fondo blanco para el input para que resalte
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    // Sombra para dar énfasis
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },

  fab: {
    backgroundColor: '#37b937ff',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  listContent: {
    paddingBottom: 20,
    flex: 1,
  },
});
