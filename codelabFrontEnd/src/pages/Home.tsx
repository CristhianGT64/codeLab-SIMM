import React from 'react';
import useFetchData from '../hooks/usePokeApi';

const Home = () => {
  const { data, error, isLoading, isError } = useFetchData();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>An error occurred: {(error as Error).message}</div>;

  return (
    <div>
      <h1>Home Page</h1>
      <ul>
        {data?.results?.map((item) => (
          <li key={item.name}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Home;