import React from 'react';
import { View, Text, StyleSheet, Image,ImageBackground, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler'; // Usar TextInput de RN o de gesture-handler

// Obtenemos la altura para el fondo (usada en estilos)
const { height } = Dimensions.get('window');

// --- DATOS HARDCODEADOS (Simulación de Backend) ---
const hardcodedBooks = [
  {
    id: '1',
    title: 'Holy City',
    author: 'Henry Wise',
    cover: require('../../assets/images/image.png'), // Asegúrate de tener estas imágenes
    publication: 'Atlantic Monthly Press (2021)',
    rating: 3, // Estrellas
    summary: 'Six months',
  },
  {
    id: '2',
    title: 'Eleanore of Avignon',
    author: 'Elizabeth DeGezier',
    cover: require('../../assets/images/image.png'),
    publication: 'Dutton (2024)',
    rating: 2,
    summary: 'Six months',
  },
  {
    id: '3',
    title: 'The Evolution of Annabel Craig',
    author: 'Annabel Grumbach',
    cover: require('../../assets/images/image.png'),
    publication: 'Random House (2023)',
    rating: 4,
    summary: 'Six months',
  },
];

// --- Importaciones de Imágenes de Fondo (Reutilizando Home) ---
const LIBRARY_BACKGROUND = require('../../assets/images/image.png'); // Imagen de librería de fondo

export default function BooksScreen({ navigation }) {
  
  // Función para renderizar un ítem de la lista
  const renderBookItem = ({ item }) => (
    <View style={styles.bookCard}>
      {/* Columna 1: Portada */}
      <Image source={item.cover} style={styles.bookCover} />

      {/* Columna 2: Detalles del Libro */}
      <View style={styles.detailsContainer}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDetail}>Autor: {item.author}</Text>
        <Text style={styles.cardDetail}>Publicación: {item.publication}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.cardDetail}>Rating:</Text>
          {/* Renderiza las estrellas basadas en el rating hardcodeado */}
          {Array(5).fill(0).map((_, i) => (
            <Ionicons
              key={i}
              name={i < item.rating ? 'star' : 'star-outline'}
              size={16}
              color={i < item.rating ? '#FFD700' : '#888'}
              style={{ marginLeft: 3 }}
            />
          ))}
        </View>
        <Text style={styles.cardSummary}>Resumen: {item.summary}</Text>
      </View>

      {/* Columna 3: Botones de Acción CRUD */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButtonIcon} onPress={() => console.log('Editar:', item.title)}>
          <Ionicons name="create-outline" size={24} color="#FFD700" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButtonIcon} onPress={() => console.log('Descargar:', item.title)}>
          <Ionicons name="download-outline" size={24} color="#16a2d1ff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButtonIcon} onPress={() => console.log('Eliminar:', item.title)}>
          <Ionicons name="trash-outline" size={24} color="#d11616" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      
      {/* --- BACKGROUND DE LIBRERÍA (Estilo de Home) --- */}
      <ImageBackground source={LIBRARY_BACKGROUND} style={styles.backgroundImage}>
        <View style={styles.darkOverlay} /> 
      </ImageBackground>

      {/* --- SECCIÓN PRINCIPAL (Con el estilo de borde redondeado superpuesto) --- */}
      <View style={styles.buttonsSection}>
        
        {/* Barra de Búsqueda y Botones de Filtro/Agregar */}
        <View style={styles.searchHeader}>
          {/* Input de Búsqueda */}
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="#888" style={{ marginRight: 8 }} />
            <TextInput placeholder="Buscar libro..." style={styles.searchInput} />
            <TouchableOpacity onPress={() => console.log('Abrir filtros')}>
                <Ionicons name="options-outline" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          {/* Botón Agregar (FAB lateral) */}
          <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AgregarLibro')}>
            <Ionicons name="add" size={30} color="white" />
          </TouchableOpacity>
        </View>

        {/* --- LISTA DE LIBROS --- */}
        <FlatList
          data={hardcodedBooks}
          renderItem={renderBookItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

// -----------------------------------------------------
// ESTILOS (Basados en los estilos de Home y la imagen de referencia)
// -----------------------------------------------------

const styles = StyleSheet.create({
  // --- Estilos Globales de Layout (Tomados de Home) ---
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  backgroundImage: {
    width: '100%',
    height: height * 0.45, // Altura del fondo
    position: 'absolute', // Permite que el contenido inferior suba
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  buttonsSection: {
    flex: 1, // Permite que esta sección ocupe el resto del espacio y haga scroll
    paddingHorizontal: 15,
    backgroundColor: 'white', 
    marginTop: height * 0.45 * 0.5, // 🚨 Sube para superponerse con el fondo (aprox 50% de la altura del fondo)
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 30,
    // Aseguramos que el contenido inferior (la lista) pueda hacer scroll
  },

  // --- Estilos de la Barra de Búsqueda ---
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
  
  // --- Estilos del FAB (Botón Agregar Grande) ---
  fab: {
    backgroundColor: '#37b937ff', // Color verde de tu botón 'Agregar'
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    // Sombra
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  // --- Estilos de la Lista de Libros ---
  listContent: {
    paddingBottom: 20, // Espacio al final de la lista
  },
  bookCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#EEE',
    // Sombra similar a tus botones
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
    fontFamily: 'Roboto-Italic', // Asumiendo estilo cursiva
    color: '#888',
    marginTop: 4,
  },
  
  // --- Estilos de Acciones CRUD ---
  actionsContainer: {
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: '#F5F5F5',
  },
  actionButtonIcon: {
    padding: 5, // Área de toque para el icono
  },
});