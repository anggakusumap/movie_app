/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useEffect, useState } from 'react'
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, Dimensions } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { FontAwesome } from '@expo/vector-icons'
import { API_ACCESS_TOKEN } from '@env'
import type { Movie } from '../types/app'

const { width } = Dimensions.get('window')

const MovieDetail = ({ route }: any): JSX.Element => {
    const { id } = route.params
    const [movie, setMovie] = useState<Movie | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    const fetchMovieDetail = async (): Promise<void> => {
        const url = `https://api.themoviedb.org/3/movie/${id}?language=en-US`
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

    useEffect(() => {
        const getData = async () => {
            await fetchMovieDetail()
        }
        getData();
    }, [])

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
            </View>
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
})

export default MovieDetail
