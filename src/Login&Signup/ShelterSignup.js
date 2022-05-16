import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import swal from "sweetalert";
import { checkAllRequiredField, createInput, WARNING } from "../helpers";

const INITIAL_STATE = {
  username: "",
  password: "",
  name: "",
  address: "",
  city: "",
  state: "",
  postcode: "",
  phoneNumber: "",
  email: "",
  logo: "",
  description: "",
};

const ShelterSignUp = ({ signUp }) => {
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
    const {
      username,
      password,
      name,
      city,
      state,
      phoneNumber,
      email,
    } = formData;
    const isAllRequiredFieldFilled = checkAllRequiredField([
      username,
      password,
      name,
      city,
      state,
      phoneNumber,
      email,
    ]);
    if (!isInvalid && isAllRequiredFieldFilled) {
      let response = await signUp("Shelter", formData);
      //if there is a response, there is an error
      if (response) {
        swal(response[0]);
      } else {
        history.push("/");
      }
    } else {
      swal("Oop, please fill out all required fields");
      console.log("Oop, please fill out all required fields");
    }
  };

  return (
    <div>
      <div>Sign up</div>
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
        {createInput(
          "name",
          "text",
          formData.name,
          handleChange,
          "Shelter Name",
          true
        )}
        {createInput(
          "address",
          "text",
          formData.address,
          handleChange,
          "Address"
        )}
        {createInput("city", "text", formData.city, handleChange, "City", true)}
        {createInput(
          "state",
          "text",
          formData.state,
          handleChange,
          "State",
          true
        )}
        {createInput(
          "postcode",
          "text",
          formData.postcode,
          handleChange,
          "Post Code"
        )}
        {createInput(
          "phoneNumber",
          "text",
          formData.phoneNumber,
          handleChange,
          "Phone",
          true
        )}
        {createInput(
          "email",
          "text",
          formData.email,
          handleChange,
          "Email",
          true
        )}
        {createInput(
          "logo",
          "text",
          formData.logo,
          handleChange,
          "Shelter's Logo"
        )}
        {createInput(
          "description",
          "text",
          formData.description,
          handleChange,
          "Shelter's Mission"
        )}
        {isInvalid && isTouched && <small>{WARNING}</small>}
        <button>Sign up</button>
      </form>
      <div>
        Already signed up? <Link to={`/shelter/login`}>Log in</Link>
      </div>
    </div>
  );
};

export default ShelterSignUp;
