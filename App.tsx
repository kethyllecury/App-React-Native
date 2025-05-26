import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_KEY = 'f24e1b2a'; 

export default function App() {
  const [search, setSearch] = useState('Batman');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMovies = async (query) => {
    setLoading(true);
    try {
      const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`);
      const data = await response.json();

      if (data.Search) {
        setMovies(data.Search);

        await AsyncStorage.setItem('@movies', JSON.stringify(data.Search));
      } else {
        setMovies([]);
        await AsyncStorage.removeItem('@movies');
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
    setLoading(false);
  };

  const loadLocalData = async () => {
    const localData = await AsyncStorage.getItem('@movies');
    if (localData) {
      setMovies(JSON.parse(localData));
    }
  };

  useEffect(() => {
    loadLocalData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Busca OMDb</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite o nome do filme"
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity style={styles.button} onPress={() => fetchMovies(search)}>
          <Text style={styles.buttonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : movies.length > 0 ? (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.imdbID}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.movieTitle}>{item.Title}</Text>
              <Text>{item.Year}</Text>
            </View>
          )}
        />
      ) : (
        <Text>Nenhum filme encontrado.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 40 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  searchContainer: { flexDirection: 'row', marginBottom: 20 },
  input: {
    flex: 1,
    borderColor: '#888',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
  },
  button: {
    backgroundColor: '#007bff',
    marginLeft: 10,
    borderRadius: 5,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  item: {
    padding: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  movieTitle: { fontWeight: 'bold', fontSize: 16 },
});
