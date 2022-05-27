import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import swal from "sweetalert";
import { WARNING, checkAllRequiredField, createInput } from "../common/helpers";
import "../css/ShelterLogin.css";

const INITIAL_STATE = {
  username: "",
  password: "",
};

const ShelterLogin = ({ logIn }) => {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [isTouched, setIsTouched] = useState(false);
  const [isInvalid, setIsInvalid] = useState(true);
  const history = useHistory();

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(formData => ({
      ...formData,
      [name]: value,
    }));
    setIsTouched(true);
    e.target.value === "" ? setIsInvalid(true) : setIsInvalid(false);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setFormData(INITIAL_STATE);
    const { username, password } = formData;
    const isAllRequiredFieldFilled = checkAllRequiredField([
      username,
      password,
    ]);
    if (!isInvalid && isAllRequiredFieldFilled) {
      const response = await logIn("Shelter", formData);
      //if there is a response, there is an error
      if (response) {
        swal({ text: response[0], icon: "warning" });
      } else {
        history.push("/shelters");
      }
    } else {
      swal({
        text: "Oops, please fill out all required fields",
        icon: "warning",
      });
      console.log("Oops, please fill out all required fields");
    }
  };

  return (
    <div className="ShelterLogin-container">
      <div className="ShelterLogin-header">Shelter Log in</div>
      <form onSubmit={handleSubmit} className="ShelterLogin-form">
        {createInput(
          "username",
          "text",
          formData.username,
          handleChange,
          "Username",
          false,
          "ShelterLogin-label",
          "ShelterLogin-input"
        )}
        {createInput(
          "password",
          "password",
          formData.password,
          handleChange,
          "Password",
          false,
          "ShelterLogin-label",
          "ShelterLogin-input"
        )}
        {isInvalid && isTouched && <small className="ShelterLogin-warning">{WARNING}</small>}
        <button className="ShelterLogin-button">Log in</button>
      </form>
      <div className="ShelterLogin-reminder">
        Don't have an account yet? Sign up{" "}
        <Link to={`/shelters/signup`} className="ShelterLogin-signuplink">here</Link>
      </div>
    </div>
  );
};

export default ShelterLogin;
