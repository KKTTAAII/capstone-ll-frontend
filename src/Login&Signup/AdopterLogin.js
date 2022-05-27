import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import swal from "sweetalert";
import { WARNING, checkAllRequiredField, createInput } from "../common/helpers";
import "../css/AdopterLogin.css";

const INITIAL_STATE = {
  username: "",
  password: "",
};

const AdopterLogin = ({ logIn }) => {
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
      const response = await logIn("Adopter", formData);
      //if there is a response, there is an error
      if (response) {
        swal({ text: response[0], icon: "warning" });
      } else {
        history.push("/adoptableDogs");
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
    <div className="AdopterLogin-container">
      <div className="AdopterLogin-header">Adopter Log in</div>
      <form onSubmit={handleSubmit} className="AdopterLogin-form">
        {createInput(
          "username",
          "text",
          formData.username,
          handleChange,
          "Username",
          false,
          "AdopterLogin-label",
          "AdopterLogin-input"
        )}
        {createInput(
          "password",
          "password",
          formData.password,
          handleChange,
          "Password",
          false,
          "AdopterLogin-label",
          "AdopterLogin-input"
        )}
        {isInvalid && isTouched && (
          <small className="AdopterLogin-warning">{WARNING}</small>
        )}
        <button className="AdopterLogin-button">Log in</button>
      </form>
      <div className="AdopterLogin-reminder">
        Don't have an account yet? Sign up{" "}
        <Link to={`/adopters/signup`} className="AdopterLogin-signuplink">
          here
        </Link>
      </div>
    </div>
  );
};

export default AdopterLogin;
