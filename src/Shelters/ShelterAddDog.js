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
    //turn into integer to meet jsonschema
    const breedNum = +breedId;
    delete formData.breedId;
    formData.breedId = breedNum;

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
    <div>
      <div>Add a Dog</div>
      <form onSubmit={handleSubmit}>
        {createInput("name", "text", formData.name, handleChange, "Name", true)}
        {createInput(
          "picture",
          "text",
          formData.picture,
          handleChange,
          "Picture"
        )}

        <label htmlFor="breedId">Breed:</label>
        <select
          id="breedId"
          name="breedId"
          onChange={handleChange}
          value={formData.breedId}
        >
          {createBreedOptions(DOGBREEDS)}
        </select>

        <label htmlFor="gender">Gender:</label>
        <select
          name="gender"
          id="gender"
          onChange={handleChange}
          value={formData.gender}
        >
          <option value="Female">Female</option>
          <option value="Male">Male</option>
        </select>

        <label htmlFor="age">Age:</label>
        <select
          name="age"
          id="age"
          onChange={handleChange}
          value={formData.age}
        >
          <option value="Baby">Baby</option>
          <option value="Young">Young</option>
          <option value="Adult">Adult</option>
          <option value="Senior">Senior</option>
        </select>

        <label htmlFor="goodWDogs">Good with other dogs:</label>
        <select
          name="goodWDogs"
          id="goodWDogs"
          onChange={handleChange}
          value={formData.goodWDogs}
        >
          <option value="0">No</option>
          <option value="1">Yes</option>
        </select>

        <label htmlFor="goodWCats">Good with cats:</label>
        <select
          name="goodWCats"
          id="goodWCats"
          onChange={handleChange}
          value={formData.goodWCats}
        >
          <option value="0">No</option>
          <option value="1">Yes</option>
        </select>

        <label htmlFor="goodWKids">Good with children:</label>
        <select
          name="goodWKids"
          id="goodWKids"
          onChange={handleChange}
          value={formData.goodWKids}
        >
          <option value="0">No</option>
          <option value="1">Yes</option>
        </select>

        <label>Dog's Bio:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="5"
          cols="33"
        ></textarea>
        {isInvalid && isTouched && <small>{WARNING}</small>}
        <button>Add a Dog</button>
      </form>
    </div>
  );
};

export default AddDog;
