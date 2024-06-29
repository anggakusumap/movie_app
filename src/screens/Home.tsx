import React from 'react'
import { ScrollView, View, StatusBar, StyleSheet } from 'react-native'
import MovieList from '../components/movies/MovieList'
import type { MovieListProps } from '../types/app'
import { SafeAreaView } from 'react-native-safe-area-context'

const movieLists: MovieListProps[] = [
    {
        title: 'Now Playing in Theater',
        path: 'movie/now_playing?language=en-US&page=1',
        coverType: 'backdrop',
    },
    {
        title: 'Upcoming Movies',
        path: 'movie/upcoming?language=en-US&page=1',
        coverType: 'poster',
    },
    {
        title: 'Top Rated Movies',
        path: 'movie/top_rated?language=en-US&page=1',
        coverType: 'poster',
    },
    {
        title: 'Popular Movies',
        path: 'movie/popular?language=en-US&page=1',
        coverType: 'poster',
    },
]

const Home = (): JSX.Element => {
    return (
        <SafeAreaView style={styles.containerView}>
            <ScrollView>
                <View style={styles.container}>
                    {movieLists.map((movieList) => (
                        <MovieList
                            title={movieList.title}
                            path={movieList.path}
                            coverType={movieList.coverType}
                            key={movieList.title}
                        />
                    ))}
                    <StatusBar translucent={false} />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        rowGap: 20,
    },
    containerView: {
        flex: 1,
        paddingHorizontal: 10,
        backgroundColor: '#1e1e1e',
    },
})

export default Home