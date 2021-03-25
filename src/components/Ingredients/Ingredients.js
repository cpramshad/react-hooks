import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);

  // useEffect(() => {
  //   fetch('https://react-hooks-6ee32-default-rtdb.firebaseio.com/ingredients.json')
  //   .then(response => response.json())
  //   .then(resposeData => {
  //     const loadedIngredients = [];
  //     for(const key in resposeData) {
  //       loadedIngredients.push({
  //         id: key,
  //         title: resposeData[key].title,
  //         amount: resposeData[key].amount,
  //       });
  //     }
  //     setUserIngredients(loadedIngredients);
  //   });
  // }, []);

  useEffect(() => {
    console.log('Rendering Ingredients');
  });

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    setUserIngredients(filteredIngredients);
  }, []);


  const addIngredientHandler = ingredient => {
    fetch('https://react-hooks-6ee32-default-rtdb.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      return response.json();
    }).then(responseData => {
      setUserIngredients(prevIngredients => [
        ...prevIngredients,
        { id: responseData.name, ...ingredient}
      ]);
    });
  };

  const removeIngredientHandler = ingredientId => {
    setUserIngredients(prevIngredients => prevIngredients.filter(ingredient => ingredient.id !== ingredientId));
  }

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} />
        {/* Need to add list here! */}
      </section>
    </div>
  );
}

export default Ingredients;
