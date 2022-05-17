import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import swal from "sweetalert";
import { WARNING, checkAllRequiredField, createInput } from "../common/helpers";

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
        swal(response[0]);
      } else {
        history.push("/adopters");
      }
    } else {
      swal("Oop, please fill out all required fields");
      console.log("Oop, please fill out all required fields");
    }
  };

  return (
    <div>
      <div>Log in</div>
      <form onSubmit={handleSubmit}>
        {createInput(
          "username",
          "text",
          formData.username,
          handleChange,
          "Username",
          true
        )}
        {createInput(
          "password",
          "password",
          formData.password,
          handleChange,
          "Password",
          true
        )}
        {isInvalid && isTouched && <small>{WARNING}</small>}
        <button>Log in</button>
      </form>
      <div>
        Don't have an account yet? Sign up{" "}
        <Link to={`/adopters/signup`}>here</Link>
      </div>
    </div>
  );
};

export default AdopterLogin;
