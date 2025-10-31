import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ImageBackground, FlatList, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; 
import { database } from '../../src/config/firebaseConfig';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import Logo from "../../assets/images/logo.png";
const BACKGROUND_IMAGE = require('../../assets/images/BackGround-Wallpaper.jpg');

const { width } = Dimensions.get('window');
const QuickAccessData = [
    { name: 'Libros', icon: 'book', color: '#0099ffff', screen: 'Libros' },
    { name: 'Perfil', icon: 'person', color: '#ffeb3b', screen: 'Perfil' },
    { name: 'Configuración', icon: 'settings', color: '#5cb85c', screen: 'Configuracion' },
];

const QuickAccessButton = ({ name, icon, color, onPress, styles }) => (
    <TouchableOpacity style={styles.accessButtonContainer} onPress={onPress}>
        <View style={[styles.accessCircle, { backgroundColor: color }]}>
            <Ionicons name={icon} size={30} color="#FFF" />
        </View>
        <Text style={styles.accessButtonText}>{name}</Text>
    </TouchableOpacity>
);

// Nuevo componente para cada elemento del carrusel
const CarouselItem = ({ book, onPress }) => (
    <TouchableOpacity style={styles.carouselItem} onPress={onPress}>
        <ImageBackground
            source={{ uri: book.coverUrl }}
            style={styles.carouselImage}
            imageStyle={{ borderRadius: 15 }}
        >
            <View style={styles.carouselTextContainer}>
                <Text style={styles.carouselTitle} numberOfLines={2}>{book.title}</Text>
            </View>
        </ImageBackground>
    </TouchableOpacity>
);


export default function HomeScreen({ navigation }) {
    const [recommendedBooks, setRecommendedBooks] = useState([]);

    const handleQuickAccess = (screenName) => {
        navigation.navigate(screenName);
    };

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const booksCollection = collection(database, 'books');
                const booksSnapshot = await getDocs(booksCollection);
                const allBooks = booksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // Función para barajar el array (algoritmo de Fisher-Yates)
                const shuffleArray = (array) => {
                    for (let i = array.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [array[i], array[j]] = [array[j], array[i]];
                    }
                    return array;
                };

                const shuffledBooks = shuffleArray(allBooks);
                
                // Tomamos los primeros 5 libros que tengan una URL de portada válida
                const randomBooksWithCover = shuffledBooks.filter(book => book.coverUrl).slice(0, 5);

                setRecommendedBooks(randomBooksWithCover);

            } catch (error) {
                console.error("Error al obtener libros recomendados: ", error);
            }
        };

        fetchBooks();
    }, []);


    return (
        <SafeAreaView style={styles.safeAreaContainer}>
            <ImageBackground
                source={BACKGROUND_IMAGE}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <ScrollView 
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.topContainer}>
                        <Image source={Logo} style={styles.logo} />
                    </View>
                    
                    <View style={styles.card}>
                        <View style={styles.sloganContainer}>
                            <Text style={styles.sloganText}>
                                En Mundo Libro, tu próxima gran aventura está a solo una página de distancia.
                            </Text>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.sectionContainer}>
                            <Text style={styles.cardSectionTitle}>Accesos Rápidos</Text>
                            <View style={styles.quickAccessRow}>
                                {QuickAccessData.map((item, index) => ( <QuickAccessButton key={index} name={item.name} icon={item.icon} color={item.color} onPress={() => handleQuickAccess(item.screen)} styles={styles} /> ))}
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.sectionContainer}>
                            <Text style={styles.cardSectionTitle}>Libros Recomendados</Text>
                            
                            {recommendedBooks.length > 0 ? (
                                <FlatList
                                    data={recommendedBooks}
                                    renderItem={({ item }) => (
                                        <CarouselItem book={item} onPress={() => navigation.navigate('ViewBook', { book: item })} />
                                    )}
                                    keyExtractor={item => item.id}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    pagingEnabled
                                    snapToInterval={width * 0.7 + 15} // Ancho del item + margen
                                    decelerationRate="fast"
                                    contentContainerStyle={styles.carouselContainer}
                                />
                            ) : (
                                <View style={styles.booksPlaceholder}><Text style={styles.placeholderText}>Cargando recomendaciones...</Text></View>
                            )}
                        </View>
                    </View>
                </ScrollView>
            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeAreaContainer: {
        flex: 1,
        backgroundColor: "#f0f0f0", // Fondo principal claro
    },
    backgroundImage: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    topContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 220,
        paddingTop: 50,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    logo: {
        width: 150,
        height: 60,
        resizeMode: "contain",
        tintColor: "#FFF",
        marginBottom: 20,
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        paddingHorizontal: 30,
        paddingVertical: 30,
        flex: 1,
        marginTop: -50,
        paddingBottom: 50,
    },
    sloganContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    sloganText: {
        fontSize: 16,
        color: "#333",
        fontFamily: 'Nunito-Italic',
        textAlign: 'center',
        lineHeight: 24, 
    },
    divider: {
        height: 1,
        backgroundColor: '#EEE', // Divisor claro
        marginVertical: 25,
    },
    sectionContainer: {
    },
    cardSectionTitle: {
        fontSize: 20,
        color: "#333",
        fontFamily: 'Nunito-Bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    quickAccessRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    accessButtonContainer: {
        alignItems: 'center',
        width: '32%',
    },
    accessCircle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        // Sombra para dar profundidad
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    accessButtonText: {
        fontSize: 14,
        color: "#333",
        fontFamily: 'Nunito-SemiBold',
        textAlign: 'center',
    },
    booksPlaceholder: {
        height: 200,
        backgroundColor: '#F5F5F5', // Fondo de placeholder claro
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        fontSize: 16,
        color: '#AAA', // Texto de placeholder gris
        fontFamily: 'Nunito-Italic',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    // Estilos para el carrusel
    carouselContainer: {
        paddingHorizontal: (width - (width * 0.7)) / 2 - 7.5, // Centrar el primer y último elemento
    },
    carouselItem: {
        width: width * 0.7,
        height: 220,
        marginHorizontal: 7.5,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    carouselImage: {
        flex: 1,
        justifyContent: 'flex-end', // Alinea el contenido (texto) hacia abajo
    },
    carouselTextContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Fondo oscuro semitransparente para el texto
        padding: 12,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
    },
    carouselTitle: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'Nunito-Bold',
        textAlign: 'center',
    },
});