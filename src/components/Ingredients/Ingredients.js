import React, { useState, useReducer, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id);
    default: 
     throw new Error('Should not reach default');
  }
}

const httpReducer = (curHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return { loading: true, error: null };
    case 'RESPONSE':
      return { ...curHttpState, loading: false };
    case 'ERROR':
      return { loading: false, error: action.errorMessage }
    case 'CLEAR':
      return { ...curHttpState, error: null }
    default:
      throw new Error('Should not reach default');
  }
}

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, {loading: false, error: null})
  // const [userIngredients, setUserIngredients] = useState([]);
  // const [isloading, setIsLoading] = useState(false);
  // const [error, setError] = useState();

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
    // setUserIngredients(filteredIngredients);
    dispatch({ type: 'SET', ingredients: filteredIngredients })
  }, []);


  const addIngredientHandler = ingredient => {
    // setIsLoading(true);
    dispatchHttp({type: 'SEND'})
    fetch('https://react-hooks-6ee32-default-rtdb.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      // setIsLoading(false);
      dispatchHttp({type: 'RESPONSE'})
      return response.json();
    }).then(responseData => {
      // setUserIngredients(prevIngredients => [
      //   ...prevIngredients,
      //   { id: responseData.name, ...ingredient}
      // ]);
      dispatch({
        type: 'ADD', 
        ingredient: { id: responseData.name, ...ingredient} 
      })
    });
  };

  const removeIngredientHandler = ingredientId => {
    // setIsLoading(true);
    dispatchHttp({type: 'SEND'})
    fetch(`https://react-hooks-6ee32-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`, {
      method: 'DELETE'
    }).then(respose => {
      // setIsLoading(false);
      // setUserIngredients(prevIngredients => prevIngredients.filter(ingredient => ingredient.id !== ingredientId));
      dispatchHttp({type: 'RESPONSE'})
      dispatch({ type: 'DELETE', id: ingredientId })
    }).catch(error => {
      // setError('Something went wrong');
      // setIsLoading(false);
      dispatchHttp({type: 'ERROR', errorMessage: 'Something went wrong!'})
    });
  }

  const clearError = () => {
    // setError(null);    
    dispatchHttp({type: 'CLEAR'})
  }

  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} loading={httpState.loading} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} />
        {/* Need to add list here! */}
      </section>
    </div>
  );
}

export default Ingredients;
