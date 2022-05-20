import React, { useState, useContext, useEffect } from "react";
import { useParams, Redirect } from "react-router-dom";
import UserInfoContext from "../common/UserInfoContext";
import swal from "sweetalert";
import PetlyApi from "../api";
import { useFetch } from "../common/hooks";
import {
  checkAllRequiredField,
  createBreedOptions,
  createInput,
  WARNING,
  DOGBREEDS,
} from "../common/helpers";
import DEFAULT_PIC from "../assets/dog.png";

const AdoptableDogProfile = () => {
  const { shelterId, dogId } = useParams();
  const { user, token } = useContext(UserInfoContext);
  const [dog, isLoading] = useFetch(
    PetlyApi.get("adoptableDogs", dogId, token)
  );
  const [formData, setFormData] = useState(dog);
  const [isTouched, setIsTouched] = useState(false);
  const [isInvalid, setIsInvalid] = useState(true);

  //first render will not show dog data, once the data is fetched from useFetched, update the formData
  useEffect(() => {
    const matchedShelterDog = dog.filter(dog => dog.shelter.id === +shelterId);
    setFormData(matchedShelterDog[0]);
  }, [dog]);

  //ensure correct shelter adding their dog
  if (+shelterId !== user.id) {
    swal({ text: "Unautorized user", icon: "warning" });
    return <Redirect to="/" />;
  }

  if (isLoading) {
    return (
      <div className="loading">
        <div>LOADING ...</div>
      </div>
    );
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
    const { name, age, gender, breedId } = formData;
    const isAllRequiredFieldFilled = checkAllRequiredField([
      name,
      age,
      gender,
      breedId,
    ]);

    //we do not update these, so we will delete these we update data
    delete formData.breed;
    delete formData.shelterId;
    delete formData.shelter;

    //i mutate data here, is it okay?
    formData.picture = formData.picture === "" ? DEFAULT_PIC : formData.picture;

    if (!isInvalid && isAllRequiredFieldFilled) {
      try {
        const response = await PetlyApi.updateDog(formData, {
          userId: shelterId,
          dogId: dogId,
        });
        setFormData(response);
        console.log(response);
        swal({ text: "Dog profile was updated", icon: "success" });
      } catch (err) {
        swal({ text: err[0], icon: "warning" });
      }
    } else {
      swal({
        text: "Oops, please fill out all required fields",
        icon: "warning",
      });
      console.log("Oops, please fill out all required fields");
    }
  };

  //in case there is no dog id found, we redirect before it gets to error cannot read property of undefined(formData.name)
  if (!formData) {
    swal({ text: `No dog id ${dogId} in your profile`, icon: "warning" });
    return <Redirect to="/" />;
  }

  return (
    <div>
      <div>Update {formData.name}</div>
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
          value={formData.goodWDogs ? "1" : "0"}
        >
          <option value="0">No</option>
          <option value="1">Yes</option>
        </select>

        <label htmlFor="goodWCats">Good with cats:</label>
        <select
          name="goodWCats"
          id="goodWCats"
          onChange={handleChange}
          value={formData.goodWCats ? "1" : "0"}
        >
          <option value="0">No</option>
          <option value="1">Yes</option>
        </select>

        <label htmlFor="goodWKids">Good with children:</label>
        <select
          name="goodWKids"
          id="goodWKids"
          onChange={handleChange}
          value={formData.goodWKids ? "1" : "0"}
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
        <button>Edit</button>
      </form>
    </div>
  );
};

export default AdoptableDogProfile;
