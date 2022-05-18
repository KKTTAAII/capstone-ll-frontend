import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import swal from "sweetalert";
import {
  checkAllRequiredField,
  createInput,
  WARNING,
  createStateOptions,
  USSTATES,
} from "../common/helpers";
import DEFAULT_PIC from "../assets/shelter.jpg";

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
      //I mutate the data, is it okay here?
      formData.logo = formData.logo === "" ? DEFAULT_PIC : formData.logo;
      let response = await signUp("Shelter", formData);
      //if there is a response, there is an error
      if (response) {
        swal(response[0]);
      } else {
        history.push("/shelters");
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
        <label htmlFor="state">State:</label>
        <select
          id="state"
          name="state"
          onChange={handleChange}
          value={formData.state}
        >
          {createStateOptions(USSTATES)}
        </select>
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
          "email",
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

        <label>Shelter's Bio:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="5"
          cols="33"
        ></textarea>
        {isInvalid && isTouched && <small>{WARNING}</small>}
        <button>Sign up</button>
      </form>
      <div>
        Already signed up? <Link to={`/shelters/login`}>Log in</Link>
      </div>
    </div>
  );
};

export default ShelterSignUp;
