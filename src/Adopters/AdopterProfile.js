import React, { useContext, useState, useEffect } from "react";
import { useParams, Redirect } from "react-router-dom";
import PetlyApi from "../api";
import { useFetch } from "../common/hooks";
import UserInfoContext from "../common/UserInfoContext";
import swal from "sweetalert";
import { checkAllRequiredField, createInput, WARNING } from "../common/helpers";

const AdopterProfile = () => {
  const { username } = useParams();
  const { user, token } = useContext(UserInfoContext);
  const [adopter, isLoading] = useFetch(
    PetlyApi.get("adopters", username, token)
  );
  //we want to track if the user can confirm the password so we add password property
  adopter.password = "";
  //we do not update this so we delete it
  delete adopter.favDogs;
  const [formData, setFormData] = useState(adopter);
  const [isTouched, setIsTouched] = useState(false);
  const [isInvalid, setIsInvalid] = useState(true);

  //first render will not show shelter data, once the data is fetched from useFetched, update the formData
  useEffect(() => {
    setFormData(adopter);
  }, [adopter]);

  //ensure correct shelter adding their dog
  if (username !== user.username) {
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
    const { email, password } = formData;
    const isAllRequiredFieldFilled = checkAllRequiredField([email, password]);
    if (!isInvalid && isAllRequiredFieldFilled) {
      try {
        //authenticate user before updating profile
        await PetlyApi.authenticate("Adopter", {
          username: username,
          password: password,
        });
        //delete so it does not update the password as well
        delete formData.password;
        const response = await PetlyApi.update("adopters", formData, username);
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

  return (
    <div>
      <div>Update Profile {username}</div>
      <form onSubmit={handleSubmit}>
        {createInput(
          "email",
          "email",
          //solution to error A component is changing an uncontrolled input of type text to be controlled.
          formData.email || "",
          handleChange,
          "Email",
          true
        )}
        {createInput(
          "picture",
          "text",
          formData.picture || "",
          handleChange,
          "Profile Picture"
        )}

        <label>Adopter's Bio:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
          rows="5"
          cols="33"
        ></textarea>

        <label htmlFor="privateOutdoors">Private Outdoors:</label>
        <select
          name="privateOutdoors"
          id="privateOutdoors"
          onChange={handleChange}
          value={formData.privateOutdoors ? "1" : "0" || ""}
        >
          <option value="0">No</option>
          <option value="1">Yes</option>
        </select>

        <label htmlFor="numOfDogs">Number of dogs:</label>
        <input
          onChange={handleChange}
          type="number"
          id="numOfDogs"
          name="numOfDogs"
          min="0"
          max="20"
          value={formData.numOfDogs || ""}
        ></input>

        <label htmlFor="preferredGender">Preferred Gender:</label>
        <select
          name="preferredGender"
          id="preferredGender"
          onChange={handleChange}
          value={formData.preferredGender || ""}
        >
          <option value="Female">Female</option>
          <option value="Male">Male</option>
        </select>

        <label htmlFor="preferredAge">Preferred Age:</label>
        <select
          name="preferredAge"
          id="preferredAge"
          onChange={handleChange}
          value={formData.preferredAge || ""}
        >
          <option value="Baby">Baby</option>
          <option value="Young">Young</option>
          <option value="Adult">Adult</option>
          <option value="Senior">Senior</option>
        </select>

        <div>Please confirm your password to update the profile</div>
        {createInput(
          "password",
          "password",
          formData.password || "",
          handleChange,
          "Password",
          true
        )}

        {isInvalid && isTouched && <small>{WARNING}</small>}
        <button>Update</button>
      </form>
    </div>
  );
};

export default AdopterProfile;
