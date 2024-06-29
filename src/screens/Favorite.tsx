import React, { useEffect, useState } from 'react'
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { StackActions, useNavigation } from '@react-navigation/native';
import type { Movie } from '../types/app'

export default function Favorite(): JSX.Element {
    const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const navigation = useNavigation()

    const fetchFavoriteMovies = async (): Promise<void> => {
        try
        {
            const initialData: string | null = await AsyncStorage.getItem('@FavoriteList')
            if (initialData !== null)
            {
                setFavoriteMovies(JSON.parse(initialData) as Movie[])
            }
        } catch (error)
        {
            console.log(error)
        } finally
        {
            setLoading(false)
        }
    }

    useEffect(() => {
        void fetchFavoriteMovies()
    }, [])

    if (loading)
    {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
        )
    }

    if (favoriteMovies.length === 0)
    {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.emptyText}>No favorite movies found.</Text>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={favoriteMovies}
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
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#1e1e1e"
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: 'white',
        textAlign: 'center',
        marginTop: 20,
        fontSize: 18,
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
})
