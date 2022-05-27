import React, { useState, useContext } from "react";
import { useHistory, useParams, Redirect } from "react-router-dom";
import swal from "sweetalert";
import {
  WARNING,
  checkAllRequiredField,
  createInput,
  DOGBREEDS,
  createBreedOptions,
} from "../common/helpers";
import UserInfoContext from "../common/UserInfoContext";
import DEFAULT_PIC from "../assets/dog.png";
import "../css/ShelterAddDog.css";

const INITIAL_STATE = {
  name: "",
  breedId: "1",
  gender: "Female",
  age: "Baby",
  picture: "",
  description: "",
  goodWKids: "0",
  goodWDogs: "0",
  goodWCats: "0",
};

const AddDog = ({ addDog }) => {
  const { shelterId } = useParams();
  const { user } = useContext(UserInfoContext);
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [isTouched, setIsTouched] = useState(false);
  const [isInvalid, setIsInvalid] = useState(true);
  const history = useHistory();

  //ensure correct shelter adding their dog
  if (+shelterId !== user.id) {
    swal({ text: "Unautorized user", icon: "warning" });
    return <Redirect to="/" />;
  }

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
    const { name, breedId, gender, age } = formData;
    const isAllRequiredFieldFilled = checkAllRequiredField([
      name,
      breedId,
      gender,
      age,
    ]);

    //i mutate data here, is it okay?
    formData.picture = formData.picture === "" ? DEFAULT_PIC : formData.picture;

    if (!isInvalid && isAllRequiredFieldFilled) {
      let response = await addDog(shelterId, formData);
      history.push(`/adoptableDogs/${response.id}`);
    } else {
      swal({
        text: "Oop, please fill out all required fields",
        icon: "warning",
      });
      console.log("Oop, please fill out all required fields");
    }
  };

  return (
    <div className="ShelterAddDog-container">
      <div className="ShelterAddDog-header">Add a Dog</div>
      <form onSubmit={handleSubmit} className="ShelterAddDog-form">
        {createInput(
          "name",
          "text",
          formData.name,
          handleChange,
          "Name",
          true,
          "ShelterAddDog-label",
          "ShelterAddDog-input"
        )}
        {createInput(
          "picture",
          "text",
          formData.picture,
          handleChange,
          "Picture URL",
          false,
          "ShelterAddDog-label",
          "ShelterAddDog-input"
        )}

        <label htmlFor="breedId" className="ShelterAddDog-label">
          Breed:
        </label>
        <select
          id="breedId"
          name="breedId"
          onChange={handleChange}
          value={formData.breedId}
          className="ShelterAddDog-select"
        >
          {createBreedOptions(DOGBREEDS)}
        </select>

        <div className="ShelterAddDog-form-identity">
          <label htmlFor="gender" className="ShelterAddDog-label select">
            Gender:
          </label>
          <select
            name="gender"
            id="gender"
            onChange={handleChange}
            value={formData.gender}
            className="ShelterAddDog-select"
          >
            <option value="Female">Female</option>
            <option value="Male">Male</option>
          </select>

          <label htmlFor="age" className="ShelterAddDog-label select age">
            Age:
          </label>
          <select
            name="age"
            id="age"
            onChange={handleChange}
            value={formData.age}
            className="ShelterAddDog-select"
          >
            <option value="Baby">Baby</option>
            <option value="Young">Young</option>
            <option value="Adult">Adult</option>
            <option value="Senior">Senior</option>
          </select>
        </div>

        <div>
          <label htmlFor="goodWDogs" className="ShelterAddDog-label select">
            Good with other dogs:
          </label>
          <select
            name="goodWDogs"
            id="goodWDogs"
            onChange={handleChange}
            value={formData.goodWDogs}
            className="ShelterAddDog-select"
          >
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>

          <label htmlFor="goodWCats" className="ShelterAddDog-label select">
            Good with cats:
          </label>
          <select
            name="goodWCats"
            id="goodWCats"
            onChange={handleChange}
            value={formData.goodWCats}
            className="ShelterAddDog-select"
          >
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>

          <label htmlFor="goodWKids" className="ShelterAddDog-label select">
            Good with children:
          </label>
          <select
            name="goodWKids"
            id="goodWKids"
            onChange={handleChange}
            value={formData.goodWKids}
            className="ShelterAddDog-select"
          >
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>
        </div>

        <label className="ShelterAddDog-label bio">Dog's Bio:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="5"
          cols="50"
        ></textarea>
        {isInvalid && isTouched && <small className="ShelterAddDog-warning">{WARNING}</small>}
        <button className="ShelterAddDog-button">Add a Dog</button>
      </form>
    </div>
  );
};

export default AddDog;
