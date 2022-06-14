import React, { useState, useContext, useEffect } from "react";
import { useParams, Redirect, useHistory } from "react-router-dom";
import UserInfoContext from "../common/UserInfoContext";
import swal from "sweetalert";
import PetlyApi from "../api";
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
  const [dog, setDog] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState(dog);
  const [isTouched, setIsTouched] = useState(false);
  const [isInvalid, setIsInvalid] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const history = useHistory();
  let profilePic;

  useEffect(() => {
    async function getData() {
      try {
        const res = await PetlyApi.get("adoptableDogs", dogId, token);
        setDog(res);
        setIsLoading(false);
      } catch (err) {
        swal("Oops, not found");
        history.push("/");
        console.log(err);
      }
    }
    getData();
  }, []);

  //first render will not show dog data, once the data is fetched, update the formData
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

  const transformFile = file => {
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImageFile(reader.result);
      };
    }
  };

  const onImageChange = e => {
    if (
      e.target.files &&
      e.target.files[0] &&
      e.target.files[0].name.match(/.(jpg|jpeg|png|gif)$/i)
    ) {
      let img = e.target.files[0];
      transformFile(img);
      setIsInvalid(false);
    } else {
      swal({
        text: "Not an image",
        icon: "warning",
      });
    }
  };

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

    copiedFormData.picture = imageFile === null ? DEFAULT_PIC : imageFile;

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

  if (formData.picture && formData.picture.startsWith("{")) {
    const parsedPicture = JSON.parse(formData.picture);
    profilePic = parsedPicture.url;
  } else {
    profilePic = formData.picture;
  }

  return (
    <div className="AdoptableDogProfile-container">
      <div className="AdoptableDogProfile-header">Update {formData.name}</div>
      <img
        alt={formData.name}
        src={imageFile ? imageFile : profilePic}
        className="AdoptabledogProfile-img"
      />
      <form onSubmit={handleSubmit} className="AdoptableDogProfile-form">
        <input
          id="picture"
          type="file"
          name="picture"
          onChange={onImageChange}
          className="AdoptableDogProfile-img-button"
          accept="image/"
        />
        <label htmlFor="picture">
          <div className="AdoptableDogProfile-add-picture-button">
            Update picture
          </div>
        </label>

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
        <button className="AdoptableDogProfile-button">update</button>
      </form>
    </div>
  );
};

export default AdoptableDogProfile;
