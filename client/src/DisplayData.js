import React, { useState } from "react";
import { useQuery, gql, useLazyQuery, useMutation } from "@apollo/client";

const QUERY_ALL_USERS = gql`
  query GetAllUsers {
    users {
      id
      name
      age
      username
      nationality
    }
  }
`;

const QUERY_ALL_MOVIES = gql`
  query GetAllMovies {
    movies {
      id
      name
      yearOfPublication
      isInTheaters
    }
  }
`;

const GET_MOVIE_BY_NAME = gql`
  query GetMovieByName($name: String!) {
    movie(name: $name) {
      id
      name
      yearOfPublication
      isInTheaters
    }
  }
`;

const ADD_MOVIE = gql`
  mutation AddMovie(
    $name: String!
    $yearOfPublication: Int!
    $isInTheaters: Boolean!
  ) {
    addMovie(
      name: $name
      yearOfPublication: $yearOfPublication
      isInTheaters: $isInTheaters
    ) {
      id
      name
      yearOfPublication
      isInTheaters
    }
  }
`;

const DELETE_MOVIE = gql`
  mutation DeleteMovie($id: ID!) {
    deleteMovie(id: $id) {
      id
      name
    }
  }
`;

const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
      name
    }
  }
`;

const DisplayData = () => {
  const [movieSearched, setMovieSearch] = useState("");
  const { data, loading, error } = useQuery(QUERY_ALL_USERS);
  const { data: movieData, refetch: refetchMovies } =
    useQuery(QUERY_ALL_MOVIES);

  const [fetchMovie, { data: movieSearchedData, error: movieError }] =
    useLazyQuery(GET_MOVIE_BY_NAME);

  const [addMovie] = useMutation(ADD_MOVIE);
  const [deleteMovie] = useMutation(DELETE_MOVIE);
  const [deleteUser] = useMutation(DELETE_USER);

  const handleAddMovie = async () => {
    try {
      await addMovie({
        variables: {
          name: "New Movie",
          yearOfPublication: 2023,
          isInTheaters: true,
        },
      });
      refetchMovies();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteMovie = async (movieId) => {
    try {
      await deleteMovie({ variables: { id: movieId } });
      refetchMovies();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser({ variables: { id: userId } });
      //   refetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    console.log(error);
  }

  return (
    <div>
      <h1>Display Data</h1>
      <ul>
        {data.users.map((user) => (
          <div key={user.id}>
            <li>
              <h4>Name: {user.name}</h4>
              <p>Username: {user.username}</p>
              <p>Age: {user.age}</p>
              <p>Nationality: {user.nationality}</p>
              <button onClick={() => handleDeleteUser(user.id)}>
                Delete User
              </button>
            </li>
          </div>
        ))}
      </ul>
      {movieData &&
        movieData.movies.map((movie) => {
          return (
            <div key={movie.id}>
              <li>
                <h4>Name: {movie.name}</h4>
                <p>Year of Publication: {movie.yearOfPublication}</p>
                <p>Is in Theaters: {movie.isInTheaters ? "Yes" : "No"}</p>
                <button onClick={() => handleDeleteMovie(movie.id)}>
                  Delete Movie
                </button>
              </li>
            </div>
          );
        })}
      <div>
        <input
          type="text"
          value={movieSearched}
          onChange={(e) => setMovieSearch(e.target.value)}
        />
        <button
          onClick={() => fetchMovie({ variables: { name: movieSearched } })}
        >
          Fetch Data
        </button>
        <div>
          {movieSearchedData && movieSearchedData.movie && (
            <div>
              <h3>Name: {movieSearchedData.movie.name}</h3>
              <p>
                Year of Publication: {movieSearchedData.movie.yearOfPublication}
              </p>
              <p>
                Is in Theaters:{" "}
                {movieSearchedData.movie.isInTheaters ? "Yes" : "No"}
              </p>
            </div>
          )}
        </div>
        {movieError && <p>Error: {movieError.message}</p>}
      </div>
      <div>
        <button onClick={handleAddMovie}>Add Movie</button>
      </div>
    </div>
  );
};

export default DisplayData;
