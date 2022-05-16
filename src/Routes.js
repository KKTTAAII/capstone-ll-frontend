import React, { useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import ShelterSignup from "./Login&Signup/ShelterSignup";
import PetlyApi from "./api";
import AdopterSignUp from "./Login&Signup/AdopterSignup";
import ShelterLogin from "./Login&Signup/ShelterLogin";
import AdopterLogin from "./Login&Signup/AdopterLogin";

import jwt_decode from "jwt-decode";

const Routes = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState();

  const signUp = async (userType, data) => {
    try {
      const response = await PetlyApi.register(userType, data);
      const user = jwt_decode(response);
      setCurrentUser(user);
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
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
};

export default Routes;
