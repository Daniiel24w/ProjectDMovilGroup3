import { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { database } from '../../src/config/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

export default function CreateBooksScreen() {
  const navigation = useNavigation();

  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    summary: '',
    rating: 0,
    publicationYear: '',
  });

  const onSend = async () => {
    Alert.alert("Libro creado con exito");
    await addDoc(collection(database, 'books'), newBook);
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Título" onChangeText={t => setNewBook({ ...newBook, title: t })} />
      <TextInput placeholder="Autor" onChangeText={t => setNewBook({ ...newBook, author: t })} />
      <TextInput placeholder="Resumen" onChangeText={t => setNewBook({ ...newBook, summary: t })} />
      <TextInput placeholder="Rating" keyboardType="numeric" onChangeText={t => setNewBook({ ...newBook, rating: Number(t) })} />
      <TextInput placeholder="Año de publicación" onChangeText={t => setNewBook({ ...newBook, publicationYear: t })} />

      <Button title="Publicar libro" onPress={onSend} />
    </View>
  );
}

