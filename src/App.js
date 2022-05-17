import React, { useEffect } from "react";
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
        swal(err[0]);
        console.log(err);
        return <Redirect to="/" />;
      }
    }
    getUser();
  }, [token]);

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
  return (
    <BrowserRouter>
      <UserInfoContext.Provider value={{ user, token }}>
        <div className="App">
          <Routes signUp={signUp} logIn={logIn} />
        </div>
      </UserInfoContext.Provider>
    </BrowserRouter>
  );
};

export default App;
