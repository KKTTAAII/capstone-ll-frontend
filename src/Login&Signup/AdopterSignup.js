import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import swal from "sweetalert";
import { createInput, checkAllRequiredField, WARNING } from "../helpers";

const INITIAL_STATE = {
  username: "",
  password: "",
  email: "",
  picture: "",
  description: "",
  privateOutdoors: false,
  numOfDogs: 0,
  preferredGender: "Female",
  preferredAge: "Adult",
};

const AdopterSignUp = ({ signUp }) => {
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
    let { username, password, email, privateOutdoors, numOfDogs } = formData;
    const isAllRequiredFieldFilled = checkAllRequiredField([
      username,
      password,
      email,
    ]);
    if (!isInvalid && isAllRequiredFieldFilled) {
      //turn string from the form to boolean
      if (privateOutdoors === "true") {
        privateOutdoors = true;
      } else if (privateOutdoors === "false") {
        privateOutdoors = false;
      }
      //turn string to number
      numOfDogs = +numOfDogs;

      let response = await signUp("Adopter", formData);
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
          "email",
          "text",
          formData.email,
          handleChange,
          "Email",
          true
        )}
        {createInput(
          "picture",
          "text",
          formData.picture,
          handleChange,
          "Profile Picture"
        )}
        {createInput(
          "description",
          "text",
          formData.description,
          handleChange,
          "Adopter's bio"
        )}

        <label htmlFor="privateOutdoors">Private Outdoors:</label>
        <select
          name="privateOutdoors"
          id="privateOutdoors"
          onChange={handleChange}
          value={formData.privateOutdoors}
        >
          <option value="false">No</option>
          <option value="true">Yes</option>
        </select>

        <label htmlFor="numOfDogs">Number of dogs:</label>
        <input
          onChange={handleChange}
          type="number"
          id="numOfDogs"
          name="numOfDogs"
          min="0"
          max="20"
          value={formData.numOfDogs}
        ></input>

        <label htmlFor="preferredGender">Preferred Gender:</label>
        <select
          name="preferredGender"
          id="preferredGender"
          onChange={handleChange}
          value={formData.preferredGender}
        >
          <option value="Female">Female</option>
          <option value="Male">Male</option>
        </select>

        <label htmlFor="preferredAge">Preferred Age:</label>
        <select
          name="preferredAge"
          id="preferredAge"
          onChange={handleChange}
          value={formData.preferredAge}
        >
          <option value="Baby">Baby</option>
          <option value="Young">Young</option>
          <option value="Adult">Adult</option>
          <option value="Senior">Senior</option>
        </select>

        {isInvalid && isTouched && <small>{WARNING}</small>}
        <button>Sign up</button>
      </form>
      <div>
        Already signed up? <Link to={`/adopter/login`}>Log in</Link>
      </div>
    </div>
  );
};

export default AdopterSignUp;
