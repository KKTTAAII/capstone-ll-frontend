import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import ShelterSignup from "../Login&Signup/ShelterSignup";
import AdopterSignUp from "../Login&Signup/AdopterSignup";
import ShelterLogin from "../Login&Signup/ShelterLogin";
import AdopterLogin from "../Login&Signup/AdopterLogin";
import SheltersList from "../Shelters/SheltersList";
import ShelterDetails from "../Shelters/ShelterDetails";
import NotFound from "../common/NotFound";
import PrivateRoute from "./PrivateRoute";
import PrivateShelterRoute from "./PrivateShelterRoute";
import AdoptableDogDetails from "../AdoptableDogs/AdoptableDogDetails.js";
import AddDog from "../Shelters/ShelterAddDog";

const Routes = ({ signUp, logIn, addDog }) => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/shelters/signup">
          <ShelterSignup signUp={signUp} />
        </Route>
        <Route exact path="/adopters/signup">
          <AdopterSignUp signUp={signUp} />
        </Route>
        <Route exact path="/shelters/login">
          <ShelterLogin logIn={logIn} />
        </Route>
        <Route exact path="/adopters/login">
          <AdopterLogin logIn={logIn} />
        </Route>
        <PrivateRoute exact path="/shelters">
          <SheltersList />
        </PrivateRoute>
        <PrivateRoute exact path="/shelters/:shelterId">
          <ShelterDetails />
        </PrivateRoute>
        <PrivateShelterRoute exact path="/shelters/add/:shelterId">
          <AddDog addDog={addDog}/>
        </PrivateShelterRoute>
        <PrivateRoute exact path="/adoptableDogs/:dogId">
          <AdoptableDogDetails />
        </PrivateRoute>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
