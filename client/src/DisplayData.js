import React, { useState } from "react";
import { useQuery, gql, useLazyQuery } from "@apollo/client";

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
      name
    }
  }
`;

const DisplayData = () => {
  const [movieSearched, setMovieSearch] = useState("");
  const { data, loading, error } = useQuery(QUERY_ALL_USERS);
  const { data: movieData } = useQuery(QUERY_ALL_MOVIES);
  //   const [fetchMovie, { data: movieSearchedData, error: movieError }] =
  //     useLazyQuery();

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
          <div>
            <li>
              <hi>Name : {user.name}</hi>
              <hi>username : {user.username}</hi>
              <hi>age : {user.age}</hi>
              <hi>nationality : {user.nationality}</hi>
            </li>
          </div>
        ))}
      </ul>
      {movieData &&
        movieData.movies.map((movie) => {
          return (
            <div key={movie.id}>
              <li>
                <h3>name : {movie.name}</h3>
                <p>Year of Publication: {movie.yearOfPublication}</p>
                <p>Is in Theaters: {movie.isInTheaters ? "Yes" : "No"}</p>
              </li>
            </div>
          );
        })}

      <div>
        <input type="text" onChange={(e) => setMovieSearch(e.target.value)} />
        <button onClick={() => setMovieSearch(movieSearched)}>Search</button>
        <input
          type="text"
          value={movieSearched}
          onChange={(e) => setMovieSearch(e.target.value)}
        />
        <button onClick={() => movieSearched}>Search</button>
      </div>
    </div>
  );
};

export default DisplayData;
