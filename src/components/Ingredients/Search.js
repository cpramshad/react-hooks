import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const { onLoadIngredients } = props;
  const [enteredFilter, setEnteredFilter] = useState('');
  const inputRef = useRef();

  useEffect(() => {
    console.log('useEffect - setTimer');

    const timer = setTimeout(() => {

      if (enteredFilter === inputRef.current.value) {
        const query = enteredFilter.length === 0 ? '' : `?orderBy="title"&equalTo="${enteredFilter}"`
        fetch('https://react-hooks-6ee32-default-rtdb.firebaseio.com/ingredients.json' + query)
        .then(response => response.json())
        .then(resposeData => {
          const loadedIngredients = [];
          for(const key in resposeData) {
            loadedIngredients.push({
              id: key,
              title: resposeData[key].title,
              amount: resposeData[key].amount,
            });
          }
          onLoadIngredients(loadedIngredients);
        });
      }
      
    }, 500);

    return () => {
      console.log('useEffect - clearTimer');
      clearTimeout(timer);
    }
  }, [enteredFilter, onLoadIngredients, inputRef])

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            ref={inputRef}
            type="text"
            value={enteredFilter}
            onChange={event => setEnteredFilter(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
