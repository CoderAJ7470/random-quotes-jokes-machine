import { SetStateAction, useEffect, useState } from 'react';
import { useGetJokesQuery } from '../state/jokesAPISlice';
import { checkUserInputHasError } from '../helpers/functions';

import '../styles/options.css';
import { Display } from './Display';

export const Options = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [userInputPage, setUserInputPage] = useState('');
  const [hasError, setHasError] = useState(false);

  /**
   * Destructured options from useGetJokesQuery - part of RTK Query's functionality
   */
  const { data: jokes, isLoading } = useGetJokesQuery(pageNumber);
  const currentPage = jokes && jokes.current_page;
  const totalPages = jokes && jokes.total_pages;
  const results = jokes && jokes.results;

  const handleInputOnChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setUserInputPage(event.target.value);
  };

  /**
   * Handles the user search option if the user presses the Enter key to search for a specific page of jokes. Also includes some simple error checking.
   * @param event - The Enter key getting pressed
   */
  const handleOnKeyDown = (event: { key: string }) => {
    if (event.key === 'Enter') {
      const userInput = parseInt(userInputPage);
      const hasError = checkUserInputHasError(userInput, totalPages as never);
      setHasError(hasError);

      if (!hasError) {
        setPageNumber(parseInt(userInputPage));
      }
    }
  };

  /**
   * Handles the user event of pressing the "Load Dad Jokes" button to search for a specific page of dad jokes. Also includes some simple error checking.
   */
  const handleLoadPageButtonOnClick = () => {
    const userInput = parseInt(userInputPage);
    const hasError = checkUserInputHasError(userInput, totalPages as never);
    setHasError(hasError);

    if (!hasError) {
      setPageNumber(parseInt(userInputPage));
      setUserInputPage('');
    }
  };

  useEffect(() => {
    const inputInstruction = document.querySelector('#instruction');
    const searchInput = document.querySelector('#searchInput');

    if (hasError) {
      inputInstruction?.classList.add('error');
      searchInput?.classList.add('input-error');
    } else {
      inputInstruction?.classList.remove('error');
      searchInput?.classList.remove('input-error');
    }
  }, [hasError]);

  return (
    <>
      <section className='options-wrapper'>
        <p className='search-by-page-instructions'>
          Search for a specific page of dad jokes (returns 20 jokes/page).{' '}
          <span id='instruction' className='validation'>
            Input must be a number between 1 and {totalPages} (inclusive)
          </span>
          :
        </p>
        <section className='input-wrapper'>
          <input
            className='user-search-input'
            id='searchInput'
            type='text'
            size={3}
            onKeyDown={handleOnKeyDown}
            onChange={handleInputOnChange}
            value={userInputPage}
          />
          <button
            className='load-page-button'
            onClick={() => handleLoadPageButtonOnClick()}
            disabled={userInputPage === ''}
          >
            Load Dad Jokes
          </button>
        </section>
        <p>
          Or... simply browse pages with the paging buttons below. Showing page{' '}
          {currentPage} of {totalPages} pages
        </p>
        <section>
          <button
            className='paging-buttons'
            onClick={() => setPageNumber(pageNumber - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <button
            className='paging-buttons'
            onClick={() => setPageNumber(pageNumber + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </section>
      </section>
      <Display jokesArray={results} isLoading={isLoading} />
    </>
  );
};
