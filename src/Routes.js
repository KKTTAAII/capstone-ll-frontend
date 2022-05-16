import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import ShelterSignup from "./Login&Signup/ShelterSignup";
import PetlyApi from "./api";
import AdopterSignUp from "./Login&Signup/AdopterSignup";
import ShelterLogin from "./Login&Signup/ShelterLogin";
import AdopterLogin from "./Login&Signup/AdopterLogin";
import { useLocalStorageState } from "./hooks";
import UserInfoContext from "./UserInfoContext";

import jwt_decode from "jwt-decode";
import swal from "sweetalert";

const Routes = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState();
  const [token, setToken] = useLocalStorageState("token", null);

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
              setCurrentUser(tokenInfo);
              setIsLoggedIn(true);
            }
          } else if (tokenInfo.userType === "adopters") {
            const user = await PetlyApi.get(
              tokenInfo.userType,
              tokenInfo.username,
              token
            );
            //check if we have this user in db, if not, token may expire or no that user
            if (user) {
              setCurrentUser(tokenInfo);
              setIsLoggedIn(true);
            }
          }
        }
      } catch (err) {
        swal("Oop, somthing's wrong");
        throw new Error(err);
      }
    }
    getUser();
  }, [token]);

  const signUp = async (userType, data) => {
    try {
      const response = await PetlyApi.register(userType, data);
      const user = jwt_decode(response);
      setCurrentUser(user);
      setIsLoggedIn(true);
      setToken(response);
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  const logIn = async (userType, data) => {
    try {
      const response = await PetlyApi.logIn(userType, data);
      const user = jwt_decode(response);
      setCurrentUser(user);
      setIsLoggedIn(true);
      setToken(response);
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  return (
    <BrowserRouter>
      <UserInfoContext.Provider
        value={{
          currentUser: currentUser,
          isLoggedIn: isLoggedIn,
        }}
      >
        <Switch>
          <Route exact path={"/shelter/signup"}>
            <ShelterSignup signUp={signUp} />
          </Route>
          <Route exact path={"/adopter/signup"}>
            <AdopterSignUp signUp={signUp} />
          </Route>
          <Route exact path={"/shelter/login"}>
            <ShelterLogin logIn={logIn} />
          </Route>
          <Route exact path={"/adopter/login"}>
            <AdopterLogin logIn={logIn} />
          </Route>
        </Switch>
      </UserInfoContext.Provider>
    </BrowserRouter>
  );
};

export default Routes;
