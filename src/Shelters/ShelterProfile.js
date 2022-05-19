import React, { useContext, useState, useEffect } from "react";
import { useParams, Redirect } from "react-router-dom";
import PetlyApi from "../api";
import { useFetch } from "../common/hooks";
import UserInfoContext from "../common/UserInfoContext";
import swal from "sweetalert";
import {
  checkAllRequiredField,
  createInput,
  USSTATES,
  createStateOptions,
  WARNING,
} from "../common/helpers";

const ShelterProfile = () => {
  const { shelterId } = useParams();
  const { user, token } = useContext(UserInfoContext);
  const [shelter, isLoading] = useFetch(
    PetlyApi.get("shelters", shelterId, token)
  );
  delete shelter.adoptableDogs;
  shelter.password = "";
  const [formData, setFormData] = useState(shelter);
  const [isTouched, setIsTouched] = useState(false);
  const [isInvalid, setIsInvalid] = useState(true);

  //first render will not show shelter data, once the data is fetched from useFetched, update the formData
  useEffect(() => {
    setFormData(shelter);
  }, [shelter]);

  //ensure correct shelter adding their dog
  if (+shelterId !== user.id) {
    swal("Unautorized user");
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

  return (
    <div>
      <div>Update Profile {formData.username}</div>
      <form onSubmit={handleSubmit}>
        {createInput(
          "name",
          "text",
          //solution to error A component is changing an uncontrolled input of type text to be controlled.
          formData.name || "",
          handleChange,
          "Shelter Name",
          true
        )}
        {createInput(
          "address",
          "text",
          formData.address || "",
          handleChange,
          "Address"
        )}
        {createInput(
          "city",
          "text",
          formData.city || "",
          handleChange,
          "City",
          true
        )}
        <label htmlFor="state">State:</label>
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
          "Post Code"
        )}
        {createInput(
          "phoneNumber",
          "text",
          formData.phoneNumber || "",
          handleChange,
          "Phone",
          true
        )}
        {createInput(
          "email",
          "email",
          formData.email || "",
          handleChange,
          "Email",
          true
        )}
        {createInput(
          "logo",
          "text",
          formData.logo || "",
          handleChange,
          "Shelter's Logo"
        )}

        <label>Shelter's Bio:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
          rows="5"
          cols="33"
        ></textarea>

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

export default ShelterProfile;
