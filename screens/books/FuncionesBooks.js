import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function FuncionesBooks({
  id,
  title,
  author,
  summary,
  rating,
  publicationYear,
  coverUrl,
}) {
  const navigation = useNavigation();

  const handleCardPress = () => {
    const bookData = {
      id,
      title,
      author,
      summary,
      rating,
      publicationYear,
      coverUrl,
    };
    // Navega a la pantalla de visualización pasando todos los datos del libro.
    navigation.navigate('ViewBook', { book: bookData });
  };

  return (
    <TouchableOpacity style={styles.bookCard} onPress={handleCardPress}>
      <View style={styles.bookCoverPlaceholder}>
        {coverUrl ? (
          <Image source={{ uri: coverUrl }} style={styles.bookCoverImage} />
        ) : (
          <Ionicons name="book-outline" size={40} color="#CCC" />
        )}
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDetail}>Autor: {author}</Text>
        <Text style={styles.cardDetail}>Publicado en: {publicationYear}</Text>

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
        <Text style={styles.cardSummary} numberOfLines={2} ellipsizeMode="tail">
          {summary}
        </Text>
      </View>
    </TouchableOpacity>
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
  bookCoverPlaceholder: {
    width: 80,
    height: 110,
    borderRadius: 8,
    marginRight: 15,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  bookCoverImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    marginBottom: 5,
    color: '#333',
  },
  cardDetail: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#666',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  cardSummary: {
    fontSize: 13,
    fontFamily: 'Nunito-Italic',
    color: '#888',
    marginTop: 8,
    lineHeight: 18,
  },
});
