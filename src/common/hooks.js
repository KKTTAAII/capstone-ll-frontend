import { useState, useEffect } from "react";

const useLocalStorageState = (key, defaultValue) => {
  const [state, setState] = useState(() => {
    try {
      let value = JSON.parse(window.localStorage.getItem(key) || defaultValue);
      return value;
    } catch (e) {
      window.localStorage.clear();
      throw new Error(e);
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
};

const useToggle = initialState => {
  const [state, setState] = useState(initialState);
  const toggle = () => {
    setState(state => !state);
  };
  return [state, toggle];
};

export { useLocalStorageState, useToggle };
