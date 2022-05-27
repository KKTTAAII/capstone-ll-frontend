import React, { useEffect, useState, useRef } from "react";
import Routes from "./Routes/Routes";
import PetlyApi from "./api";
import UserInfoContext from "./common/UserInfoContext";
import { BrowserRouter, Redirect } from "react-router-dom";
import { useLocalStorageState } from "./common/hooks";

import jwt_decode from "jwt-decode";
import swal from "sweetalert";

const App = () => {
  const [token, setToken] = useLocalStorageState("token", null);
  const [user, setUser] = useLocalStorageState("user", null);
  const [favoriteDogs, setFavoriteDogs] = useState(null);
  const [isFavoriteDogsLoading, setIsFavoriteDogsLoading] = useState(true);
  // stop memory leak in useEffect hook react - does not work? why?
  const unmounted = useRef(false);

  useEffect(() => {
    async function getUser() {
      try {
        //check first if there is token in localStorage
        if (token) {
          //decode the token
          const tokenInfo = jwt_decode(token);
          //check the userType on token because we have two types: adopters and shelters
          if (tokenInfo.userType === "shelters") {
            const user = await PetlyApi.get(
              tokenInfo.userType,
              tokenInfo.id,
              token
            );
            //check if we have this user in db, if not, token may expire or no that user
            if (user) {
              setUser(tokenInfo);
            }
          } else if (tokenInfo.userType === "adopters") {
            const user = await PetlyApi.get(
              tokenInfo.userType,
              tokenInfo.username,
              token
            );
            //check if we have this user in db, if not, token may expire or no that user
            if (user) {
              setUser(tokenInfo);
            }
          }
        }
      } catch (err) {
        setUser(null);
        setToken(null);
        console.log(err);
        return <Redirect to="/" />;
      }
    }
    getUser();
    //when the user is adopter, we want to get their list of favorite dogs so we can pass it to the Adoptable dog card
    if (user && user.userType === "adopters") {
      async function getFavoriteDogs() {
        try {
          const favDogs = await PetlyApi.getFavoriteDogs(user.username, token);
          console.log(favDogs)
          setFavoriteDogs(favDogs);
          setIsFavoriteDogsLoading(false);
        } catch (err) {
          console.log(err);
          swal({ text: err[0], icon: "warning" });
          return <Redirect to="/" />;
        }
      }
      getFavoriteDogs();
      // stop memory leak in useEffect hook react - does not work! why?
      return () => {
        unmounted.current = true;
      };
    } else {
      setIsFavoriteDogsLoading(false);
      return;
    }
  }, [token, favoriteDogs ? favoriteDogs.length : ""]);

  const signUp = async (userType, data) => {
    try {
      const response = await PetlyApi.register(userType, data);
      const user = jwt_decode(response);
      setToken(response);
      setUser(user);
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  const logIn = async (userType, data) => {
    try {
      const response = await PetlyApi.logIn(userType, data);
      const user = jwt_decode(response);
      setToken(response);
      setUser(user);
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  const logOut = () => {
    setToken(null);
    setUser(null);
  };

  const addDog = async (shelterId, data) => {
    try {
      const reponse = await PetlyApi.createDog(shelterId, data);
      return reponse;
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  const removeDog = async (shelterId, dogId) => {
    try {
      const response = await PetlyApi.deleteDog(shelterId, dogId);
      return response;
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  return (
    <BrowserRouter>
      <UserInfoContext.Provider
        value={{
          user,
          token,
          favoriteDogs,
          setFavoriteDogs,
          isFavoriteDogsLoading,
        }}
      >
        <div className="App">
          <Routes
            signUp={signUp}
            logIn={logIn}
            addDog={addDog}
            removeDog={removeDog}
            logOut={logOut}
          />
        </div>
      </UserInfoContext.Provider>
    </BrowserRouter>
  );
};

export default App;
