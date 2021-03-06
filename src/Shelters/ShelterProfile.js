import React, { useContext, useState, useEffect } from "react";
import { useParams, Redirect, useHistory } from "react-router-dom";
import PetlyApi from "../api";
import UserInfoContext from "../common/UserInfoContext";
import swal from "sweetalert";
import {
  checkAllRequiredField,
  createInput,
  USSTATES,
  createStateOptions,
  WARNING,
} from "../common/helpers";
import "../css/ShelterProfile.css";
import Loading from "../common/Loading";
import DEFAULT_PIC from "../assets/shelter.jpg";

const ShelterProfile = () => {
  const { shelterId } = useParams();
  const { user, token } = useContext(UserInfoContext);
  const [shelter, setShelter] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const history = useHistory();
  let logoPic;

  useEffect(() => {
    async function getData() {
      try {
        const res = await PetlyApi.get("shelters", shelterId, token);
        setShelter(res);
        setIsLoading(false);
      } catch (err) {
        swal("Oops, not found");
        history.push("/");
        console.log(err);
      }
    }
    getData();
  }, []);

  //No need to include this property with the formData
  delete shelter.adoptableDogs;
  //we want to track if the user can confirm the password so we add password property
  shelter.password = "";
  const [formData, setFormData] = useState(shelter);
  const [isTouched, setIsTouched] = useState(false);
  const [isInvalid, setIsInvalid] = useState(true);

  //first render will not show shelter data, once the data is fetched, update the formData
  useEffect(() => {
    setFormData(shelter);
  }, [shelter]);

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
    const {
      name,
      city,
      state,
      phoneNumber,
      email,
      password,
      username,
    } = formData;
    const isAllRequiredFieldFilled = checkAllRequiredField([
      name,
      city,
      state,
      phoneNumber,
      email,
      password,
    ]);

    formData.logo = imageFile === null ? DEFAULT_PIC : imageFile;

    if (!isInvalid && isAllRequiredFieldFilled) {
      try {
        //authenticate user before updating profile
        await PetlyApi.authenticate("Shelter", {
          username: username,
          password: password,
        });
        //delete so it does not update the password as well
        delete formData.password;
        const response = await PetlyApi.update("shelters", formData, shelterId);
        setFormData(response);
        swal({ text: "Profile was updated", icon: "success" });
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

  if (formData.logo && formData.logo.startsWith("{")) {
    const parsedLogo = JSON.parse(formData.logo);
    logoPic = parsedLogo.url;
  } else {
    logoPic = formData.logo;
  }

  return (
    <div className="ShelterProfile-container">
      <div className="ShelterProfile-imgContainer">
        <img
          alt={shelter.username}
          src={imageFile ? imageFile : logoPic}
          className="ShelterProfile-img"
        />
        <small className="ShelterProfile-caption">{shelter.username}</small>
      </div>
      <div>
        <div className="ShelterProfile-header">
          Update Profile {formData.username}
          <a
            href={`/shelters/resetPassword/${shelter.id}`}
            className="ShelterProfile-resetPassword"
          >
            Reset Password
          </a>
        </div>
        <form onSubmit={handleSubmit} className="ShelterProfile-form">
          <input
            id="logo"
            type="file"
            name="logo"
            onChange={onImageChange}
            className="ShelterProfile-img-button"
            accept="image/"
          />
          <label htmlFor="logo">
            <div className="ShelterProfile-add-picture-button">
              Update shelter's picture
            </div>
          </label>

          {createInput(
            "name",
            "text",
            //solution to error A component is changing an uncontrolled input of type text to be controlled.
            formData.name || "",
            handleChange,
            "Shelter Name",
            true,
            "ShelterProfile-label",
            "ShelterProfile-input"
          )}
          {createInput(
            "address",
            "text",
            formData.address || "",
            handleChange,
            "Address",
            false,
            "ShelterProfile-label",
            "ShelterProfile-input"
          )}
          {createInput(
            "city",
            "text",
            formData.city || "",
            handleChange,
            "City",
            true,
            "ShelterProfile-label",
            "ShelterProfile-input"
          )}
          <label htmlFor="state" className="ShelterProfile-label">
            State:
          </label>
          <select
            id="state"
            name="state"
            onChange={handleChange}
            value={formData.state || ""}
          >
            {createStateOptions(USSTATES)}
          </select>
          {createInput(
            "postcode",
            "text",
            formData.postcode || "",
            handleChange,
            "Post Code",
            false,
            "ShelterProfile-label",
            "ShelterProfile-input"
          )}

          <label htmlFor="phoneNumber" className="ShelterSignup-label">
            Phone*:
          </label>
          <input
            id="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            name="phoneNumber"
            placeholder="123-456-7890"
            className="ShelterSignup-input"
            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
          ></input>

          {createInput(
            "email",
            "email",
            formData.email || "",
            handleChange,
            "Email",
            true,
            "ShelterProfile-label",
            "ShelterProfile-input"
          )}

          <label className="ShelterProfile-label">Shelter's Bio:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            rows="5"
            cols="45"
          ></textarea>

          <div className="ShelterProfile-passwordConfirm">
            Please confirm your password to update the profile
          </div>
          {createInput(
            "password",
            "password",
            formData.password || "",
            handleChange,
            "Password",
            true,
            "ShelterProfile-label",
            "ShelterProfile-input"
          )}

          {isInvalid && isTouched && <small>{WARNING}</small>}
          <button className="ShelterProfile-button">Update</button>
        </form>
      </div>
    </div>
  );
};

export default ShelterProfile;
