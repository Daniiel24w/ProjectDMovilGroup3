import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler';
import { database } from '../../src/config/firebaseConfig';
import { onSnapshot, collection, orderBy, query } from 'firebase/firestore';
import FuncionesBooks from '../books/FuncionesBooks';

const { height } = Dimensions.get('window');

const LIBRARY_BACKGROUND = require('../../assets/images/image.png');

export default function BooksScreen({ navigation }) {

  const [books, setBooks] = useState([]);

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
        }))
      );
    });

    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>

      
      <ImageBackground source={LIBRARY_BACKGROUND} style={styles.backgroundImage}>
        <View style={styles.darkOverlay} />
      </ImageBackground>

      
      <View style={styles.buttonsSection}>

      
        <View style={styles.searchHeader}>

        
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="#888" style={{ marginRight: 8 }} />
            <TextInput placeholder="Buscar libro..." style={styles.searchInput} />
            <TouchableOpacity onPress={() => console.log('Abrir filtros')}>
              <Ionicons name="options-outline" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          
          <TouchableOpacity
            style={styles.fab}
            onPress={() => navigation.navigate("CreateBooks")}
          >
            <Ionicons name="add" size={30} color="white" />
          </TouchableOpacity>

        </View>

        
        <View style={styles.listContent}>
          {books.map(book => (
            <FuncionesBooks key={book.id} {...book} />
          ))}
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  backgroundImage: {
    width: '100%',
    height: height * 0.45,
    position: 'absolute',
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },

  buttonsSection: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: 'white',
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
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
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
  },
});
