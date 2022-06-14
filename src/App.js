import React, { useEffect, useRef, useState } from "react";
import Routes from "./Routes/Routes";
import PetlyApi from "./api";
import UserInfoContext from "./common/UserInfoContext";
import { BrowserRouter } from "react-router-dom";
import { useLocalStorageState } from "./common/hooks";
import { getUser } from "./common/helpers";
import jwt_decode from "jwt-decode";
import swal from "sweetalert";

const App = () => {
  const [token, setToken] = useLocalStorageState("token", "");
  const [user, setUser] = useLocalStorageState("user", null);
  const [favoriteDogs, setFavoriteDogs] = useState([]);
  const [isFavoriteDogsLoading, setIsFavoriteDogsLoading] = useState(true);
  //we save all the favorited dogs here both from when
  //a user favorites a dog and from the favoriteDogs
  //we use this to check if there are dogs in the object so we do not
  //need to call api and just pull data from this object
  //Save API calls
  const allFavoritedDogs = useRef({});

  useEffect(() => {
    getUser(
      setToken,
      setUser,
      token,
      setFavoriteDogs,
      setIsFavoriteDogsLoading,
      allFavoritedDogs,
      favoriteDogs
    );
  }, [token, favoriteDogs.length]);

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
    setToken("");
    setUser(null);
    setIsFavoriteDogsLoading(true);
    swal({ icon: "success", text: "You are logged out" });
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
          allFavoritedDogs,
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
