import { useState, useEffect } from "react";

function useLocalStorageState(key, defaultValue) {
  const [state, setState] = useState(() => {
    try {
      let value = JSON.parse(window.localStorage.getItem(key) || defaultValue);
      return value;
    } catch (e) {
      throw new Error(e);
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}

export { useLocalStorageState };
