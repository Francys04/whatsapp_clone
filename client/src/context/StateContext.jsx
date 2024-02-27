// This code defines a context for managing application state using React's Context API and the useReducer hook.
// createContext: Imports the createContext function from React to create a context object.
// useContext: Imports the useContext function from React to access the context value within components.
// useReducer: Imports the useReducer function from React to manage state using a reducer function.

import { createContext, useContext, useReducer } from "react";

// export const StateProvider = ({ initialState, reducer, children }) => ( ... ): Defines a functional component named StateProvider. This component will be responsible for:
// Accepting props:
// initialState: The initial state of the application.
// reducer: The reducer function that handles state updates based on actions.
// children: The child components that will use the state.
// Using useReducer hook:
// Calls the useReducer hook with the provided reducer function and initialState.
// This returns an array with the current state and a dispatch function to update the state.
// Utilizing StateContext.Provider:
// Wraps the children components within a StateContext.Provider.
// Sets the value of the provider to the state and dispatch function returned from useReducer.
export const StateContext = createContext();

export const StateProvider = ({ initialState, reducer, children }) => (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
);

export const useStateProvider = () => useContext(StateContext);
