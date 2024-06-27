import React from 'react'
import { View, Text, Button } from 'react-native'

const MovieDetail = ({ navigation }: any): any => {
    const fetchData = (): void => {
        // Gantilah dengan akses token Anda
        const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlYTVhNWQ4MWVlZTFkYWU3MmNkMjE5MTk4MGQyZjRmZSIsIm5iZiI6MTcxOTQ5MDI1Ni4zODA0MDYsInN1YiI6IjYzZDg1MGJjYzE1YjU1MDA4NDNjNjk3ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1XIu-0rLs5NmuUhDRIjWvdlgXpJjT9r8BnHNjCEoc10'

        const url =
            'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1'

        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${ACCESS_TOKEN}`,
            },
        }

        fetch(url, options)
            .then(async (response) => await response.json())
            .then((response) => {
                console.log(response)
            })
            .catch((err) => {
                console.error(err)
            })
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Movie Detail Page</Text>
            <Button
                title="Fetch Data"
                onPress={() => {
                    fetchData()
                }}
            />
        </View>
    )
}

export default MovieDetail