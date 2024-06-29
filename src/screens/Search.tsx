import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { API_ACCESS_TOKEN, API_URL_MOVIE } from '@env'
import { useNavigation, StackActions } from '@react-navigation/native';
import type { Movie } from '../types/app'

export default function Search(): JSX.Element {
    const [query, setQuery] = useState<string>('')
    const [searchResults, setSearchResults] = useState<Movie[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const navigation = useNavigation()

    const handleSearch = async (): Promise<void> => {
        if (query.trim() === '')
        {
            setSearchResults([])
            return
        }

        setLoading(true)
        const url = `${API_URL_MOVIE}/search/movie?query=${encodeURIComponent(query)}`
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${API_ACCESS_TOKEN}`,
            },
        }

        try
        {
            const response = await fetch(url, options)
            const result = await response.json()
            setSearchResults(result.results as Movie[])
        } catch (error)
        {
            console.error(error)
        } finally
        {
            setLoading(false)
        }
    }

    const handleSearchWrapper = (): void => {
        void handleSearch()
    }

    return (
        <SafeAreaView style={styles.container}>
            <TextInput
                style={styles.searchBar}
                placeholder="Search for a movie..."
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={handleSearchWrapper}
            />
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            ) : (
                <FlatList
                    data={searchResults}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.movieItem}
                            onPress={() => {
                                navigation.dispatch(StackActions.push('MovieDetail', { id: item.id }))
                            }}
                        >
                            <Image
                                source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }}
                                style={styles.posterImage}
                            />
                            <View style={styles.movieInfo}>
                                <Text style={styles.title}>{item.title}</Text>
                                <Text style={styles.releaseDate}>Release Date: {item.release_date}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    ListEmptyComponent={<Text style={styles.emptyText}>No results found</Text>}
                />
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#1e1e1e',
    },
    searchBar: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 8,
        marginBottom: 16,
        color: 'white',
        backgroundColor: '#2e2e2e',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    movieItem: {
        flexDirection: 'row',
        marginBottom: 16,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#2e2e2e',
    },
    posterImage: {
        width: 100,
        height: 150,
    },
    movieInfo: {
        padding: 16,
        justifyContent: 'center',
    },
    title: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    releaseDate: {
        color: 'gray',
        marginTop: 8,
    },
    emptyText: {
        color: 'white',
        textAlign: 'center',
        marginTop: 20,
        fontSize: 18,
    },
})
