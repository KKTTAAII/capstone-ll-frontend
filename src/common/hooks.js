import React, { useState, useEffect } from "react";
import { useHistory, Redirect } from "react-router-dom";
import swal from "sweetalert";
import PetlyApi from "../api";

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

const useFetch = (request, dependencies = null) => {
  const [resp, setResp] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    async function getData() {
      try {
        const res = await request;
        setResp(res);
        setIsLoading(false);
      } catch (err) {
        swal("Oops, not found");
        history.push("/");
        console.log(err);
      }
    }
    getData();
  }, [dependencies]);

  return [resp, isLoading, setResp];
};

const useToggle = initialState => {
  const [state, setState] = useState(initialState);
  const toggle = () => {
    setState(state => !state);
  };
  return [state, toggle];
};

const useFavoriteDogsState = (user, token) => {
  if (user.userType === "adopters") {
    const [favoriteDogs, setFavoriteDogs] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      async function getFavoriteDogs() {
        try {
          const favDogs = await PetlyApi.getFavoriteDogs(user.username, token);
          setFavoriteDogs(favDogs);
          setIsLoading(false);
        } catch (err) {
          console.log(err);
          swal({ text: err[0], icon: "warning" });
          return <Redirect to="/" />;
        }
      }
      getFavoriteDogs();
    }, [favoriteDogs ? favoriteDogs.length : ""]);

    return [favoriteDogs, isLoading, setFavoriteDogs];
  }
};

export { useLocalStorageState, useFetch, useToggle, useFavoriteDogsState };
