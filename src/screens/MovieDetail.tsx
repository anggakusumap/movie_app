/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useEffect, useState } from 'react'
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, Dimensions, TouchableOpacity, FlatList } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { FontAwesome } from '@expo/vector-icons'
import { API_ACCESS_TOKEN, API_URL_MOVIE } from '@env'
import type { Cast, Movie } from '../types/app'
import AsyncStorage from '@react-native-async-storage/async-storage'

const { width } = Dimensions.get('window')

const MovieDetail = ({ route }: any): JSX.Element => {
    const { id } = route.params
    const [movie, setMovie] = useState<Movie | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [isFavorite, setIsFavorite] = useState<boolean>(false)
    const [cast, setCast] = useState<Cast[]>([])

    const addFavorite = async (movie: Movie): Promise<void> => {
        try
        {
            const initialData: string | null = await AsyncStorage.getItem('@FavoriteList')
            const favMovieList: Movie[] = initialData !== null ? JSON.parse(initialData) : []
            favMovieList.push(movie)
            await AsyncStorage.setItem('@FavoriteList', JSON.stringify(favMovieList))
            setIsFavorite(true)
        } catch (error)
        {
            console.log(error)
        }
    }

    const removeFavorite = async (id: number): Promise<void> => {
        try
        {
            const initialData: string | null = await AsyncStorage.getItem('@FavoriteList')
            if (initialData !== null)
            {
                let favMovieList: Movie[] = JSON.parse(initialData)
                favMovieList = favMovieList.filter(movie => movie.id !== id)
                await AsyncStorage.setItem('@FavoriteList', JSON.stringify(favMovieList))
                setIsFavorite(false)
            }
        } catch (error)
        {
            console.log(error)
        }
    }

    const checkFavoriteStatus = async (id: number): Promise<void> => {
        try
        {
            const initialData: string | null = await AsyncStorage.getItem('@FavoriteList')
            if (initialData !== null)
            {
                const favMovieList: Movie[] = JSON.parse(initialData)
                const isFav = favMovieList.some(movie => movie.id === id)
                setIsFavorite(isFav)
            }
        } catch (error)
        {
            console.log(error)
        }
    }

    const fetchMovieDetail = async (): Promise<void> => {
        const url = `${API_URL_MOVIE}movie/${id}?language=en-US`
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
            const result: Movie = await response.json()
            setMovie(result)
            setLoading(false)
        } catch (error)
        {
            console.log(error)
        }
    }

    const fetchMovieCast = async (): Promise<void> => {
        const url = `${API_URL_MOVIE}movie/${id}/credits?language=en-US`
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
            setCast(result.cast as Cast[])
        } catch (error)
        {
            console.log(error)
        }
    }

    useEffect(() => {
        void fetchMovieDetail()
        void fetchMovieCast()
        void checkFavoriteStatus(Number(id))
    }, [id])

    if (loading)
    {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        )
    }

    return (
        <ScrollView style={styles.container}>
            {movie !== null &&
                <>
                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: `https://image.tmdb.org/t/p/w500${movie?.backdrop_path}` }}
                            style={styles.backdropImage}
                        />
                        <LinearGradient
                            colors={['transparent', 'rgba(0, 0, 0, 0.8)']}
                            style={styles.gradient}
                        >
                            <Text style={styles.title}>{movie?.title}</Text>
                            <View style={styles.ratingContainer}>
                                <FontAwesome name="star" size={24} color="yellow" />
                                <Text style={styles.rating}>{movie?.vote_average.toFixed(1)}</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.favoriteButton}
                                onPress={async () => {
                                    if (isFavorite)
                                    {
                                        try
                                        {
                                            await removeFavorite(movie.id);
                                        } catch (error)
                                        {
                                            // Handle error (optional)
                                            console.error("Failed to remove favorite:", error);
                                        }
                                    } else
                                    {
                                        try
                                        {
                                            await addFavorite(movie);
                                        } catch (error)
                                        {
                                            // Handle error (optional)
                                            console.error("Failed to add favorite:", error);
                                        }
                                    }
                                }}
                            >

                                <FontAwesome
                                    name={isFavorite ? "heart" : "heart-o"}
                                    size={24}
                                    color="red"
                                />
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                    <View style={styles.detailsContainer}>
                        <Text style={styles.releaseDate}>
                            Release Date: {movie?.release_date}
                        </Text>
                        <Text style={styles.overview}>{movie?.overview}</Text>
                        <View style={styles.additionalInfo}>
                            <Text style={styles.infoLabel}>Genres: </Text>
                            <Text style={styles.infoText}>{movie?.genres.map(genre => genre.name).join(', ')}</Text>
                        </View>
                        <View style={styles.additionalInfo}>
                            <Text style={styles.infoLabel}>Runtime: </Text>
                            <Text style={styles.infoText}>{movie?.runtime} minutes</Text>
                        </View>
                        <View style={styles.castContainer}>
                            <Text style={styles.sectionTitle}>Cast</Text>
                            <FlatList
                                horizontal
                                data={cast}
                                renderItem={({ item }) => (
                                    <View style={styles.castItem}>
                                        <Image
                                            source={{ uri: `https://image.tmdb.org/t/p/w200${item.profile_path}` }}
                                            style={styles.castImage}
                                        />
                                        <Text style={styles.castName}>{item.name}</Text>
                                        <Text style={styles.castCharacter}>{item.character}</Text>
                                    </View>
                                )}
                                keyExtractor={(item) => item.id.toString()}
                                showsHorizontalScrollIndicator={false}
                            />
                        </View>
                    </View>
                </>
            }
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1e1e1e',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'white',
        textAlign: 'center',
        marginTop: 20,
    },
    imageContainer: {
        width: '100%',
        height: width * 0.56, // Aspect ratio of 16:9
        position: 'relative',
    },
    backdropImage: {
        width: '100%',
        height: '100%',
    },
    gradient: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        paddingHorizontal: 16,
        paddingVertical: 24,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    rating: {
        color: 'yellow',
        fontSize: 18,
        marginLeft: 8,
    },
    favoriteButton: {
        marginTop: 16,
    },
    detailsContainer: {
        padding: 16,
    },
    releaseDate: {
        color: 'white',
        marginBottom: 8,
        fontSize: 16,
        fontWeight: '500',
    },
    overview: {
        color: 'white',
        fontSize: 16,
        marginBottom: 16,
    },
    additionalInfo: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    infoLabel: {
        color: 'white',
        fontWeight: 'bold',
    },
    infoText: {
        color: 'white',
        marginLeft: 4,
    },
    castContainer: {
        marginTop: 16,
    },
    sectionTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    castItem: {
        marginRight: 12,
        alignItems: 'center',
    },
    castImage: {
        width: 80,
        height: 120,
        borderRadius: 8,
    },
    castName: {
        color: 'white',
        marginTop: 4,
        fontSize: 14,
        fontWeight: 'bold',
    },
    castCharacter: {
        color: 'gray',
        fontSize: 12,
    },
})

export default MovieDetail
