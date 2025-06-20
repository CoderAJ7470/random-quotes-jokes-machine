import { useGetJokesQuery } from '../state/quotesAPISlice';
import '../styles/display.css';

import { Joke, Jokes } from '../helpers/types';

export const Display = () => {
  const { data: jokes, isLoading } = useGetJokesQuery({});
  const jokesArray = jokes && jokes.results;

  if (isLoading) {
    return (
      <section className='jokes-display'>
        Please wait, getting the jokes...
      </section>
    );
  }

  return (
    <section className='jokes-display'>
      {jokesArray.map((joke: Joke) => {
        return (
          <p className='joke' key={joke.id}>
            {joke.joke}
          </p>
        );
      })}
    </section>
  );
};
