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
import Loading from "../common/Loading";
import "../css/AdoptableDogProfile.css";

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
    return <Loading />;
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
    let copiedFormData = JSON.parse(JSON.stringify(formData));
    delete copiedFormData.breed;
    delete copiedFormData.shelterId;
    delete copiedFormData.shelter;

    //i mutate data here, is it okay?
    copiedFormData.picture =
      copiedFormData.picture === "" ? DEFAULT_PIC : copiedFormData.picture;

    if (!isInvalid && isAllRequiredFieldFilled) {
      try {
        const response = await PetlyApi.updateDog(copiedFormData, {
          userId: shelterId,
          dogId: dogId,
        });
        setFormData(response);
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
    <div className="AdoptableDogProfile-container">
      <div className="AdoptableDogProfile-header">Update {formData.name}</div>
      <img
        alt={formData.name}
        src={formData.picture}
        className="AdoptabledogProfile-img"
      />
      <form onSubmit={handleSubmit} className="AdoptableDogProfile-form">
        {createInput(
          "name",
          "text",
          formData.name,
          handleChange,
          "Name",
          true,
          "AdoptableDogProfile-label",
          "AdoptableDogProfile-input"
        )}
        {createInput(
          "picture",
          "text",
          formData.picture,
          handleChange,
          "Picture",
          false,
          "AdoptableDogProfile-label",
          "AdoptableDogProfile-input"
        )}

        <label htmlFor="breedId" className="AdoptableDogProfile-label">
          Breed:
        </label>
        <select
          id="breedId"
          name="breedId"
          onChange={handleChange}
          value={formData.breedId}
          className="AdoptableDogProfile-select"
        >
          {createBreedOptions(DOGBREEDS)}
        </select>

        <div className="AdoptableDogProfile-form-identity">
          <label htmlFor="gender" className="AdoptableDogProfile-label select ">
            Gender:
          </label>
          <select
            name="gender"
            id="gender"
            onChange={handleChange}
            value={formData.gender}
            className="AdoptableDogProfile-select"
          >
            <option
              value="Female"
              className="AdoptableDogProfile-label select "
            >
              Female
            </option>
            <option value="Male">Male</option>
          </select>

          <label htmlFor="age" className="AdoptableDogProfile-label select age">
            Age:
          </label>
          <select
            name="age"
            id="age"
            onChange={handleChange}
            value={formData.age}
            className="AdoptableDogProfile-select"
          >
            <option value="Baby">Baby</option>
            <option value="Young">Young</option>
            <option value="Adult">Adult</option>
            <option value="Senior">Senior</option>
          </select>

          <label
            htmlFor="goodWDogs"
            className="AdoptableDogProfile-label select "
          >
            Good with other dogs:
          </label>
          <select
            name="goodWDogs"
            id="goodWDogs"
            onChange={handleChange}
            value={formData.goodWDogs ? "1" : "0"}
            className="AdoptableDogProfile-select"
          >
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>

          <label
            htmlFor="goodWCats"
            className="AdoptableDogProfile-label select "
          >
            Good with cats:
          </label>
          <select
            name="goodWCats"
            id="goodWCats"
            onChange={handleChange}
            value={formData.goodWCats ? "1" : "0"}
            className="AdoptableDogProfile-select"
          >
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>

          <label
            htmlFor="goodWKids"
            className="AdoptableDogProfile-label select "
          >
            Good with children:
          </label>
          <select
            name="goodWKids"
            id="goodWKids"
            onChange={handleChange}
            value={formData.goodWKids ? "1" : "0"}
            className="AdoptableDogProfile-select"
          >
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>
        </div>

        <label className="AdoptableDogProfile-label">Dog's Bio:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="5"
          cols="50"
        ></textarea>
        {isInvalid && isTouched && (
          <small className="AdoptableDogProfile-warning">{WARNING}</small>
        )}
        <button className="AdoptableDogProfile-button">Edit</button>
      </form>
    </div>
  );
};

export default AdoptableDogProfile;
